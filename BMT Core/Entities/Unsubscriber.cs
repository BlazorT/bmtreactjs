using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Unsubscriber : EntityTransaction
{
   // public long Id { get; set; }

    public string Contactid { get; set; } = null!;

    public string? Remarks { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Networkid { get; set; }

    public int? Status { get; set; }
}
