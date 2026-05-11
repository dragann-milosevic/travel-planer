using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Common.DTOs;
using Common.Enums;
using Common.Interfaces;

namespace NotificationService
{
    /// <summary>
    /// Stateful service that:
    /// - Stores share tokens in a Reliable Dictionary (V4 pattern)
    /// - Processes audit events from a Reliable Queue (V5 EDA pattern)
    /// - Exposes operations to other services via Service Fabric Remoting (V3 pattern)
    /// </summary>
    internal sealed class NotificationService : StatefulService, INotificationService
    {
        private const string SharesDictionaryName = "shares";
        private const string AuditQueueName = "auditQueue";

        public NotificationService(StatefulServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }

        // ============================================================
        // Share token operations (Reliable Dictionary)
        // ============================================================

        public async Task<ShareLinkDTO> CreateShareTokenAsync(long travelPlanId, ShareAccessType accessType)
        {
            var shares = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, ShareLinkDTO>>(SharesDictionaryName);

            var token = Guid.NewGuid().ToString("N");
            var now = DateTime.UtcNow;
            var link = new ShareLinkDTO
            {
                Id = DateTime.UtcNow.Ticks,
                TravelPlanId = travelPlanId,
                Token = token,
                AccessType = accessType,
                CreatedAt = now,
                ExpiresAt = now.AddDays(30)
            };

            using (var tx = this.StateManager.CreateTransaction())
            {
                await shares.AddAsync(tx, token, link);
                await tx.CommitAsync();
            }

            ServiceEventSource.Current.ServiceMessage(this.Context,
                "Share token created for plan {0} with access {1}", travelPlanId, accessType);

            return link;
        }

        public async Task<ShareLinkDTO?> ValidateTokenAsync(string token)
        {
            var shares = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, ShareLinkDTO>>(SharesDictionaryName);

            using (var tx = this.StateManager.CreateTransaction())
            {
                var result = await shares.TryGetValueAsync(tx, token);
                if (!result.HasValue) return null;

                var link = result.Value;
                if (link.ExpiresAt < DateTime.UtcNow)
                {
                    return null;
                }
                return link;
            }
        }

        public async Task<List<ShareLinkDTO>> GetSharesForPlanAsync(long travelPlanId)
        {
            var shares = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, ShareLinkDTO>>(SharesDictionaryName);
            var result = new List<ShareLinkDTO>();

            using (var tx = this.StateManager.CreateTransaction())
            {
                var enumerable = await shares.CreateEnumerableAsync(tx);
                using (var enumerator = enumerable.GetAsyncEnumerator())
                {
                    while (await enumerator.MoveNextAsync(CancellationToken.None))
                    {
                        var link = enumerator.Current.Value;
                        if (link.TravelPlanId == travelPlanId && link.ExpiresAt >= DateTime.UtcNow)
                        {
                            result.Add(link);
                        }
                    }
                }
            }

            return result;
        }

        public async Task<bool> RevokeShareAsync(long travelPlanId, long shareId)
        {
            var shares = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, ShareLinkDTO>>(SharesDictionaryName);
            string? tokenToRemove = null;

            using (var tx = this.StateManager.CreateTransaction())
            {
                var enumerable = await shares.CreateEnumerableAsync(tx);
                using (var enumerator = enumerable.GetAsyncEnumerator())
                {
                    while (await enumerator.MoveNextAsync(CancellationToken.None))
                    {
                        var link = enumerator.Current.Value;
                        if (link.TravelPlanId == travelPlanId && link.Id == shareId)
                        {
                            tokenToRemove = enumerator.Current.Key;
                            break;
                        }
                    }
                }

                if (tokenToRemove != null)
                {
                    await shares.TryRemoveAsync(tx, tokenToRemove);
                    await tx.CommitAsync();
                    return true;
                }
            }

            return false;
        }

        public async Task<int> RevokeAllSharesForPlanAsync(long travelPlanId)
        {
            var shares = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, ShareLinkDTO>>(SharesDictionaryName);
            var tokensToRemove = new List<string>();

            using (var tx = this.StateManager.CreateTransaction())
            {
                var enumerable = await shares.CreateEnumerableAsync(tx);
                using (var enumerator = enumerable.GetAsyncEnumerator())
                {
                    while (await enumerator.MoveNextAsync(CancellationToken.None))
                    {
                        if (enumerator.Current.Value.TravelPlanId == travelPlanId)
                        {
                            tokensToRemove.Add(enumerator.Current.Key);
                        }
                    }
                }

                foreach (var token in tokensToRemove)
                {
                    await shares.TryRemoveAsync(tx, token);
                }
                await tx.CommitAsync();
            }

            return tokensToRemove.Count;
        }

        // ============================================================
        // Audit log operations (Reliable Queue, V5 EDA pattern)
        // ============================================================

        public async Task PublishAuditEventAsync(AuditEventDTO auditEvent)
        {
            var queue = await this.StateManager.GetOrAddAsync<IReliableQueue<AuditEventDTO>>(AuditQueueName);

            using (var tx = this.StateManager.CreateTransaction())
            {
                await queue.EnqueueAsync(tx, auditEvent);
                await tx.CommitAsync();
            }
        }

        // ============================================================
        // Background worker — processes audit queue
        // ============================================================

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            var queue = await this.StateManager.GetOrAddAsync<IReliableQueue<AuditEventDTO>>(AuditQueueName);

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using (var tx = this.StateManager.CreateTransaction())
                {
                    var result = await queue.TryDequeueAsync(tx);
                    if (result.HasValue)
                    {
                        var auditEvent = result.Value;
                        ServiceEventSource.Current.ServiceMessage(this.Context,
                            "[AUDIT] {0} | source={1} | userId={2} | at={3:O}",
                            auditEvent.Message,
                            auditEvent.ServiceSource,
                            auditEvent.UserId?.ToString() ?? "-",
                            auditEvent.Timestamp);

                        await tx.CommitAsync();
                    }
                    else
                    {
                        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
                    }
                }
            }
        }
    }
}