using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class ApplogModel : BaseModelTransactions
{
    //public long Id { get; set; }

    public string? MachineIp { get; set; }

    public int UserId { get; set; }

    public int? MenuId { get; set; }

    public string? LogDesc { get; set; }

    public byte? ActionType { get; set; }

    public DateTime? LogTime { get; set; }
}
