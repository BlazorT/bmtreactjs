using System;
using System.Collections.Generic;

namespace com.blazor.bmt.viewmodels;

public partial class ProductgroupViewModel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
