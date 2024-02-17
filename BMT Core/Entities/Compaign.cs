using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Compaign : EntityTransaction
{
   // public long Id { get; set; }

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

    public virtual ICollection<Lead> Leads { get; } = new List<Lead>();
}
