using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class WfexecutionstatusModel
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
