using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelPlanService.Models
{
    public class ChecklistItem
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long TravelPlanId { get; set; }

        [ForeignKey(nameof(TravelPlanId))]
        public TravelPlan? TravelPlan { get; set; }

        [Required]
        [MaxLength(200)]
        public string Text { get; set; } = string.Empty;

        public bool Completed { get; set; }
    }
}