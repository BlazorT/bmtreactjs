using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;


public partial class Shift :Entity
{
   // public long Id { get; set; }

    public int Dspid { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime ExpiryTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public int? Hours { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int? ShiftTypeId { get; set; }
}
