using com.blazor.bmt.core.baseentity;
using System;

namespace com.blazor.bmt.application.model;

public partial class CategoryModel
{
   public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string? Desc { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }
}
