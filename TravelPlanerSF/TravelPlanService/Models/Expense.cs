using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Enums;

namespace TravelPlanService.Models
{
    public class Expense
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long TravelPlanId { get; set; }

        [ForeignKey(nameof(TravelPlanId))]
        public TravelPlan? TravelPlan { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public ExpenseCategory Category { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}