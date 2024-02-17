using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class VehicleinspectionModel 
{
     public Int64 Id { get; set; }

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
