using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using Common.Enums;

namespace Common.DTOs
{
    [DataContract]
    public class ShareLinkDTO
    {
        [DataMember]
        public long Id { get; set; }

        [DataMember]
        public long TravelPlanId { get; set; }

        [DataMember]
        public string Token { get; set; } = string.Empty;

        [DataMember]
        public ShareAccessType AccessType { get; set; }

        [DataMember]
        public DateTime CreatedAt { get; set; }

        [DataMember]
        public DateTime ExpiresAt { get; set; }
    }
}