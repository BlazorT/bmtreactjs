﻿namespace com.blazor.bmt.viewmodels;

public partial class CompaignscheduledayViewModel 
{
    public long Id { get; set; }

    public long CompaignScheduleId { get; set; }

    public int? DayNumber { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public virtual CompaignexecutionscheduleViewModel CompaignSchedule { get; set; } = null!;
}

