using com.blazor.bmt.core.baseentity;
using System;
namespace com.blazor.bmt.core;

public partial class Vehicleinspection :EntityTransaction
{
   // public Int64 Id { get; set; }

    public int? InspectionItemId { get; set; }
    
    public Int64? InspectionReportId { get; set; }
    public long Vehicleid { get; set; }

    public int Found { get; set; }

    public string Remarks { get; set; } = null!;

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }
}
