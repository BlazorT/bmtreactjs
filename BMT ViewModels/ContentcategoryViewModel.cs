﻿namespace com.blazor.bmt.viewmodels;

public partial class ContentcategoryViewModel 
{
    public int Id { get; set; }

    public string? Description { get; set; }

    public string Name { get; set; } = null!;

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
