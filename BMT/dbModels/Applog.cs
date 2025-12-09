using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Applog
{
    public long Id { get; set; }

    public string? MachineIp { get; set; }

    public int UserId { get; set; }

    public int? OrgId { get; set; }

    public int? MenuId { get; set; }

    public string? LogDesc { get; set; }

    public byte? ActionType { get; set; }

    public DateTime? LogTime { get; set; }

    public string? Synccode { get; set; }
}
