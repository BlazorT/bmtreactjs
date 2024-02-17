using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Integrationservicesetting:Entity
{
   // public int Id { get; set; }

    public string? Name { get; set; }

    public string ServiceUri { get; set; } = null!;

    public string Token { get; set; } = null!;

    public int Frequency { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? Contact { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    /// <summary>
    /// Sole Proprieter, Partnership, etc
    /// </summary>
    public int RowVer { get; set; }

    public int? ServiceTypeId { get; set; }
}
