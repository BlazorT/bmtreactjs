using com.blazor.bmt.core.baseentity;
using System;
namespace com.blazor.bmt.application.model;

public partial class ApprovalrequestModel// : EntityTransaction
{
    public long Id { get; set; }

    public int? Targetorgid { get; set; }

    public string? Description { get; set; }

    public string? Remarks { get; set; }

    public string? Authcode { get; set; }

    public string? Reqcode { get; set; }

    public DateTime? Authexpiry { get; set; }

    public int? OrgId { get; set; }

    public int? Albumid { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? ApprovalTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
