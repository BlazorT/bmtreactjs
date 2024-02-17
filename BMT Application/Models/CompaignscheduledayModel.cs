using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class CompaignscheduledayModel : BaseModelTransactions
{
    //public long Id { get; set; }

    public long CompaignScheduleId { get; set; }

    public int? DayNumber { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

   // public virtual Compaignexecutionschedule CompaignSchedule { get; set; } = null!;
}

