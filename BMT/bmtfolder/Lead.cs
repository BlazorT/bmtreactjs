using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Lead
{
    public long Id { get; set; }

    public string? Code { get; set; }

    public long? CompaignId { get; set; }

    public string? Tags { get; set; }

    public string? Url { get; set; }

    public float? MatchingPerc { get; set; }

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
}
