namespace com.blazor.bmt.viewmodels;

public partial class CompaignexecutionscheduleViewModel 
{
    public Int64 Id { get; set; }

    public int? NetworkId { get; set; }

    public Int64 CompaignDetailId { get; set; }

    public double? Budget { get; set; }

    public int? Intervalval { get; set; }
   // public string? days { get; set; }
    public int? IntervalTypeId { get; set; }

    public long? MessageCount { get; set; }

    public DateTime? FinishTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
    public string? days { get; set; }
    //public virtual ICollection<CompaignscheduledayViewModel>? days { get; } //= new List<CompaignscheduledayViewModel>();
}
