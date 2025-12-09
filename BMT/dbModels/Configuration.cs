using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Configuration
{
    public int Id { get; set; }

    public int OrganizationId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Key { get; set; } = null!;

    public string Value { get; set; } = null!;

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int NetworkId { get; set; }

    public int Rowver { get; set; }
}
