using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class DspstockstatModel:BaseModel
{
   // public int Id { get; set; }

    public int? Dspid { get; set; }

    public int ProductDetailId { get; set; }

    public double? TotalAvailableStock { get; set; }

    public double? TotalSoldStock { get; set; }

    public double? TotalSaleReseveredStock { get; set; }

    public double? TotalPurReseveredStock { get; set; }

    //public int CreatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }


}
