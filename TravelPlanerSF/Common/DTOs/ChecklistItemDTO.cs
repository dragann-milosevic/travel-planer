using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class ChecklistItemDTO
    {
        public long Id { get; set; }
        public long TravelPlanId { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool Completed { get; set; }
    }
}