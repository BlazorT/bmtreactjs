using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Orglicensing : EntityTransaction
{
   // public long Id { get; set; }

    public int OrgId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int? IsProduction { get; set; }

    public string? Primarykey { get; set; }

    public string? Accesskey { get; set; }

    public int NetworkId { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiryDate { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public virtual Network Network { get; set; } = null!;
}
