using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Userrole
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int SortOrder { get; set; }

    public int Status { get; set; }
}
