﻿using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Alertlevel
{
    public int LevelId { get; set; }

    public string Name { get; set; } = null!;

    public int? OrgId { get; set; }

    public string? Description { get; set; }

    public int RemainingDays { get; set; }

    public double Days { get; set; }

    public string? Code { get; set; }

    public string? Color { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
