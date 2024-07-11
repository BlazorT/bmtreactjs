using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Tradeunit
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ShortCode { get; set; }

    public int? WeightQty { get; set; }

    public DateTime? UpdateAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public int Status { get; set; }
}
