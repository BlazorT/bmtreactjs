using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Alertlevel
{
    public int LevelId { get; set; }

    public string Name { get; set; } = null!;

    public int? OrgId { get; set; }

    public string? Description { get; set; }

    public int RemainingDays { get; set; }

    public float Days { get; set; }

    public string? Code { get; set; }

    public string? Color { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
