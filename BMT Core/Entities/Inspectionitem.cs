using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Inspectionitem :Entity
{
    //public Int64 Id { get; set; }

    public int? Dspid { get; set; }

    public int? PartId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string SubPart { get; set; } = null!;

    public string Value { get; set; } = null!;

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }
}
