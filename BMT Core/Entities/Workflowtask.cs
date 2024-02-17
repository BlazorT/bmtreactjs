using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Workflowtask:Entity
{
    //public int Id { get; set; }

    public int? DspId { get; set; }

    public string Name { get; set; } = null!;

    public string? InitExpression { get; set; }

    public string? CompletionExpression { get; set; }

    public int? TaskTypeId { get; set; }

    public string? Description { get; set; }
    
    public int? AncestorTaskId { get; set; }
    public int? PredesessorTaskId { get; set; }

    public int CreatedBy { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int CurrentStatus { get; set; }

    public int RowVer { get; set; } = 1;
}
