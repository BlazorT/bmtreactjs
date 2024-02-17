using com.blazor.bmt.core.baseentity;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Apptrace 
{
    public long AppTraceId { get; set; }

    public string? MachineIp { get; set; }

    public string? UniqueId { get; set; }

    public int UserId { get; set; }

    public int? MenuId { get; set; }

    public string? TraceDesc { get; set; }

    public byte? TraceType { get; set; }

    public DateTime? TraceTime { get; set; }
}
