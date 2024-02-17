using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Vehiclemake
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string? Desc { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    public int? ManufactureId { get; set; }
}
