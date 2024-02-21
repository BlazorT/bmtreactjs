namespace com.blazor.bmt.viewmodels
{
   
    public class ReportCompaignsViewModel
    {
        public string OrganizationName { get; set; }
        public int? OrganizationId { get; set; }
        public int? TotalCompaigns { get; set; }
        public int? CompletedCompaigns { get; set; }
        public int? InprogressCompaigns { get; set; }
        public double? Budget { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public DateTime? ExpiryTime { get; set; }
        public int? Status { get; set; }
        public string? StatusStr { get; set; }
    }
}
