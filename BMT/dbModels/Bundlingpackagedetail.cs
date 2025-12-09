using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Bundlingpackagedetail
{
    public long Id { get; set; }

    public int? NetworkId { get; set; }

    public int? UnitId { get; set; }

    public float? UnitPrice { get; set; }

    public float? Discount { get; set; }

    public float? Tax { get; set; }

    public int? FreeAllowed { get; set; }

    public int? CurrentApplied { get; set; }

    public int BundlingAllowed { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? FinishTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? ApprovalTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
