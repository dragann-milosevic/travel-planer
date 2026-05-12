using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelPlanService.Models
{
    public class Destination
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
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public DateTime ArrivalDate { get; set; }

        [Required]
        public DateTime DepartureDate { get; set; }

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}