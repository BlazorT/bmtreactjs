using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Compaignnetwork : EntityTransaction
{
    //public long Id { get; set; }

    public long? CompaignId { get; set; }

    public int NetworkId { get; set; }

    public string? Desc { get; set; }

    public string? Code { get; set; }
    public string? posttypejson { get; set; }
    
    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
