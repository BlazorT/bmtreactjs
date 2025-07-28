namespace com.blazor.bmt.viewmodels
{
    public class CampaignNotificationViewModel
    {
        public long Id { get; set; }
        public int? OrgId { get; set; }
        public int? readCount { get; set; }
        public int? commentsCount { get; set; }
        public int? clicksCount { get; set; }
        public int? sharesCount { get; set; }
        public int? likesCount { get; set; }

        public string? Name { get; set; }
        public string? recipient { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }
        public string? Remarks { get; set; }
        public string? HashTags { get; set; }
        public double? TotalBudget { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public DateTime? FinishTime { get; set; }
        public DateTime? StartTime { get; set; }
        public int Status { get; set; }

        // Fields from related tables
        public long? NotificationId { get; set; }
        public string? DeliveryStatus { get; set; }
        public string? NetworkName { get; set; }
    }
}
