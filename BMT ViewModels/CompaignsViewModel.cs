
namespace com.blazor.bmt.viewmodels
{
    public class CompaignsViewModel//:BaseViewModelTransaction
    {
        public Int64 Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }
        public string? Remarks { get; set; }
        public string? HashTags { get; set; }
        public byte? AutoGenerateLeads { get; set; }
        public double? TaxApplicable { get; set; }
        public double? Discount { get; set; }
        public double? TotalBudget { get; set; }
        public int? OrgId { get; set; }
        public int? NetworkId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? FinishTime { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? ApprovalTime { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public byte? PaymentStatus { get; set; }
        /// <summary>
        /// 0- None, 1- Paid, 2- Not Paid
        /// </summary>
        public int Status { get; set; }
        public int RowVer { get; set; }
        public string? NetworkName { get; set; }
        public string? OrgName { get; set; }
        public string? targetaudiance { get; set; }
        public string? Contact { get; set; }       
        public double? Budget { get; set; }       
        public string? logoAvatar { get; set; }
        public string? compaignschedules { get; set; }
        public string? compaignsdetails { get; set; }
        public string? attachments { get; set; }
        public virtual ICollection<CompaignNetworkViewModel>? CompaignNetworks { get; set; }
        public virtual ICollection<CompaignexecutionscheduleViewModel>? CompaignExecutionSchedules { get; set; }
    }
}

