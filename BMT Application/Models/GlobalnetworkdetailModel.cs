﻿using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class GlobalnetworkdetailModel : BaseModelTransactions
{
    //public long Id { get; set; }

    public int NetworkId { get; set; }

    public string? Desc { get; set; }

    public string? ApikeySecret { get; set; }

    public string? Pwd { get; set; }

    public string? Custom2 { get; set; }

    public string? Custom1 { get; set; }

    public string? Pincode { get; set; }

    public int? PuechasedQouta { get; set; }

    public int? FreeQouta { get; set; }

    public int? UnitId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? FinishTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? ApprovalTime { get; set; }

   // public DateTime? LastUpdatedAt { get; set; }

    public int Status { get; set; }

   // public int RowVer { get; set; }

    public int? IsCurrent { get; set; }
}