﻿using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class City
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Code { get; set; }

    public string Description { get; set; } = null!;

    public int SortOrder { get; set; }

    public int StateId { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
