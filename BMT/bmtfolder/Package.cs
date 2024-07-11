﻿using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Package
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public float? Fee { get; set; }

    public float? EarlyBirdDiscount { get; set; }

    public float? Discount { get; set; }

    public int? PackageInDays { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
