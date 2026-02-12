using com.blazor.bmt.core.baseentity;
using System;
namespace com.blazor.bmt.core;

public partial class Compaignrecipient : EntityTransaction
{
   // public long Id { get; set; }

    public int? NetworkId { get; set; }

    public string ContentId { get; set; } = null!;

    public int? SourceId { get; set; }

    public string? Desc { get; set; }
    public int? albumid { get; set; }
    public int? OrgId { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }
}
