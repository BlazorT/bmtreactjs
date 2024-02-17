using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Lead : EntityTransaction
{
    //public long Id { get; set; }

    public string? Code { get; set; }

    public long? CompaignId { get; set; }

    public string? Tags { get; set; }

    public string? Url { get; set; }

    public double? MatchingPerc { get; set; }

    public string? Area { get; set; }

    public string? Gps { get; set; }

    public int? CountryId { get; set; }

    public string? Contact { get; set; }

    public string? DetailJson { get; set; }

    public string? Note { get; set; }

    public DateTime? ApproveTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public int Status { get; set; }

    public virtual Compaign? Compaign { get; set; }

    public virtual Country? Country { get; set; }
}
