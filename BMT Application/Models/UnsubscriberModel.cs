using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class UnsubscriberModel
{
    public long Id { get; set; }

    public string Contactid { get; set; } = null!;

    public string? Remarks { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Networkid { get; set; }

    public int? Status { get; set; }
}
