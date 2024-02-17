using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class RosterplanModel: BaseModelTransactions
{
   // public long Id { get; set; }

    public int RosterTypeId { get; set; }
    public int DspId { get; set; }

    public DateTime? RosterEndDate { get; set; }

    public DateTime? RosterPlanDate { get; set; }

    public string? Week { get; set; }

    public DateTime? RosterDate { get; set; }

    public string? CustomField1 { get; set; }

    public string? CustomField2 { get; set; }

    public string? CustomField3 { get; set; }

    public int? Status { get; set; }

    public string? RosterRemarks { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    //public int CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int RowVer { get; set; }

    public int? SyncStatus { get; set; }

    public DateTime? LastSyncTime { get; set; }
}
