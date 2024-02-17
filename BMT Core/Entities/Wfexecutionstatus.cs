using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Wfexecutionstatus
{
    public long Id { get; set; }

    public int WftaskId { get; set; }

    public int? DspId { get; set; }

    public string? Note { get; set; }

    public DateTime? Time { get; set; }

    public int? ExecutedBy { get; set; }

    public int Status { get; set; }

    public byte[] RowVer { get; set; } = null!;

    public int? AssignedTo { get; set; }
}
