using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Enums;

namespace Common.DTOs
{
    public class ShareLinkCreateDTO
    {
        public long TravelPlanId { get; set; }
        public ShareAccessType AccessType { get; set; }
    }
}