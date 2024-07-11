using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Onlineuser
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime LoginTime { get; set; }

    public DateTime? LogoutTime { get; set; }

    public string? MachineIp { get; set; }

    public int Status { get; set; }
}
