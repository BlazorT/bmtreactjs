using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Contactsalbum : EntityTransaction
{
   // public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Code { get; set; }

    public string? Desc { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Networkid { get; set; }

    public int Orgid { get; set; }

    public int? Status { get; set; }
}
