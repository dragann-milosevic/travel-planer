using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Enums;

namespace Common.DTOs
{
    public class SharedPlanDTO
    {
        public TravelPlanReadDTO Plan { get; set; } = new TravelPlanReadDTO();
        public ShareAccessType AccessType { get; set; }
    }
}