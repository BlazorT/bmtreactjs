using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Tradeunit : Entity
{
    // public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ShortCode { get; set; }

    public int? WeightQty { get; set; }

    public DateTime? UpdateAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public int Status { get; set; }
}
