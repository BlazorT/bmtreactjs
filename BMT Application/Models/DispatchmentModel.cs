using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;
public partial class DispatchmentModel : BaseModelTransactions
{
    //public long Id { get; set; }

    public int Dspid { get; set; }

    public int? ProductDetailId { get; set; }

    public long? VehicleId { get; set; }

    public int AssignedTo { get; set; }

    public int? AssignedQty { get; set; }

    public string Remarks { get; set; } = null!;

    //public int CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    //public int RowVer { get; set; }
}
