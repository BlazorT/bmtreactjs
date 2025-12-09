using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Compaign
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? Title { get; set; }

    public string? Remarks { get; set; }

    public string? HashTags { get; set; }

    public sbyte? AutoGenerateLeads { get; set; }

    public float? TaxApplicable { get; set; }

    public float? Discount { get; set; }

    public float? TotalBudget { get; set; }

    public int? OrgId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? FinishTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? ApprovalTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public sbyte? PaymentStatus { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public string? Targetaudiance { get; set; }

    public string? PaymentRef { get; set; }
}
