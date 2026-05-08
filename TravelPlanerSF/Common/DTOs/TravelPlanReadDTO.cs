using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class TravelPlanReadDTO
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Notes { get; set; } = string.Empty;
        public long OwnerId { get; set; }
        public List<DestinationDTO> Destinations { get; set; } = new List<DestinationDTO>();
        public List<ActivityDTO> Activities { get; set; } = new List<ActivityDTO>();
        public List<ExpenseDTO> Expenses { get; set; } = new List<ExpenseDTO>();
        public List<ChecklistItemDTO> ChecklistItems { get; set; } = new List<ChecklistItemDTO>();
    }
}