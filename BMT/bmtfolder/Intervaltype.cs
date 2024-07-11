using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Intervaltype
{
    public sbyte Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public sbyte? SortOrder { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }
}
