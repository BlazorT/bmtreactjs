using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Network : Entity
{
    // public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int? CategoryId { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
