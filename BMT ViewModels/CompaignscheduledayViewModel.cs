namespace com.blazor.bmt.viewmodels;

public partial class CompaignscheduledayViewModel 
{
    public Int64 Id { get; set; }

    public Int64 CompaignScheduleId { get; set; }

    public int? DayNumber { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    //public virtual CompaignexecutionscheduleViewModel? CompaignSchedule { get; set; } = null!;
}

