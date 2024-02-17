using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;


public partial class Inspectionreport:EntityTransaction
{
   // public long Id { get; set; }

    public int? VehicleId { get; set; }

    public string? Remarks { get; set; }

    public int InspectedBy { get; set; }

    public int ApprovedBy { get; set; }
    public int? reportTypeId { get; set; }
    public int? Status { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }
}
