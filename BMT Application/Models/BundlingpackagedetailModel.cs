using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class BundlingpackagedetailModel : BaseModelTransactions
{
   // public long Id { get; set; }

    public int? NetworkId { get; set; }

    public int? UnitId { get; set; }

    public double? UnitPrice { get; set; }

    public double? Discount { get; set; }

    public double? Tax { get; set; }

    public int? FreeAllowed { get; set; }

    public int? CurrentApplied { get; set; }

    public int BundlingAllowed { get; set; }

    //public int? CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    public DateTime? FinishTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? ApprovalTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
