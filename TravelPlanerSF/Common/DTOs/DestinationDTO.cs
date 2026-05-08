using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class DestinationDTO
    {
        public long Id { get; set; }
        public long TravelPlanId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}