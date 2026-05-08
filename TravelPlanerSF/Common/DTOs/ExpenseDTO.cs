using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Enums;

namespace Common.DTOs
{
    public class ExpenseDTO
    {
        public long Id { get; set; }
        public long TravelPlanId { get; set; }
        public string Name { get; set; } = string.Empty;
        public ExpenseCategory Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}