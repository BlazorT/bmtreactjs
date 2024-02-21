namespace com.blazor.bmt.viewmodels
{
   
    public class ReportStatsViewModel
    {
        public int? OrgId { get; set; }
        public string MonthName { get; set; }
        public int? MonthNo { get; set; }
        public int? TotalCompaigns { get; set; }
        public int? CompletedCompaigns { get; set; }
        public int? InprogressCompaigns { get; set; }
        public double? budget { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }       
        public int? Status { get; set; }
    }
}
