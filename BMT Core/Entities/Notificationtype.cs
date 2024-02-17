using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Notificationtype
{
    public byte Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Template { get; set; }

    public string? Color { get; set; }

    public byte? SortOrder { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }
}
