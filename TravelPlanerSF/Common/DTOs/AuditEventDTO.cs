using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace Common.DTOs
{
    [DataContract]
    public class AuditEventDTO
    {
        [DataMember]
        public string Message { get; set; } = string.Empty;

        [DataMember]
        public string ServiceSource { get; set; } = string.Empty;

        [DataMember]
        public DateTime Timestamp { get; set; }

        [DataMember]
        public long? UserId { get; set; }
    }
}