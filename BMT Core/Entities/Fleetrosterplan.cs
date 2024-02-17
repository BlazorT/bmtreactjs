using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Fleetrosterplan:EntityTransaction
{
  //  public long Id { get; set; }

    public Int64? RosterId { get; set; }

    public int? RosteredDaid { get; set; }

    public int? HelperDriverId { get; set; }

    public string? Wincode { get; set; }

    public string? CustomField1 { get; set; }

    public string? CustomField2 { get; set; }

    public string? CustomField3 { get; set; }

    public int? Status { get; set; }

    public string? RosterRemarks { get; set; }

    public int? LastUpdatedBy { get; set; }
    public DateTime? ScheduleDate { get; set; }
    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public long VehicleId { get; set; }
}
