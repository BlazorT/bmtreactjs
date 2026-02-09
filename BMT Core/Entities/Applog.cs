using com.blazor.bmt.core.baseentity;
using System;

namespace com.blazor.bmt.core;

public partial class Applog : EntityTransaction
{
    //public long Id { get; set; }

    // public long Id { get; set; }

    public string? MachineIp { get; set; }

    public int UserId { get; set; }

    public int? OrgId { get; set; }

    public int? MenuId { get; set; }

    public string? LogDesc { get; set; }

    public byte? ActionType { get; set; }

    public DateTime? LogTime { get; set; }

    public string? Synccode { get; set; }
}
