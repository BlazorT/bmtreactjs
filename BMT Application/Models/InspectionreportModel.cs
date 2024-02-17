using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;
public partial class InspectionreportModel:BaseModelTransactions
{
   // public long Id { get; set; }

    public int? VehicleId { get; set; }

    public string? Remarks { get; set; }

    public int InspectedBy { get; set; }
    public int? reportTypeId { get; set; }
    public int ApprovedBy { get; set; }

    public int? Status { get; set; }

    //public virtual ICollection<VehicleinspectionModel>? inspectionItems { get; set; } = new List<VehicleinspectionModel>();

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    //public int CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int RowVer { get; set; }
}
