using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Enums;

namespace TravelPlanService.Models
{
    public class Activity
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long TravelPlanId { get; set; }

        [ForeignKey(nameof(TravelPlanId))]
        public TravelPlan? TravelPlan { get; set; }

        public long? DestinationId { get; set; }

        [ForeignKey(nameof(DestinationId))]
        public Destination? Destination { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [MaxLength(10)]
        public string Time { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public decimal EstimatedCost { get; set; }

        [Required]
        public ActivityStatus Status { get; set; } = ActivityStatus.Planned;
    }
}