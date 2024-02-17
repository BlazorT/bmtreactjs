using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Usersaccesshistory : EntityTransaction
{
    //public long Id { get; set; }

    public int UserId { get; set; }

    public DateTime LoginTime { get; set; }

    public DateTime? LogoutTime { get; set; }

    public string? StationCode { get; set; }

    public string? MachineIp { get; set; }

    public DateTime? RecordedTime { get; set; }

    public int Status { get; set; }
}
