﻿using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class MenuModel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? ActionName { get; set; }
    public string? Badge { get; set; }
    public string? Tag { get; set; }
    public string? Title { get; set; }
    public string? MenueIcon { get; set; }

    public int? ParentId { get; set; }

    public int SortOrder { get; set; }

    public sbyte IsVisible { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }
}
