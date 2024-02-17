namespace com.blazor.bmt.viewmodels;

public partial class WorkflowtaskViewModel 
{
   public int Id { get; set; }

    public int? DspId { get; set; }

    public string Name { get; set; } = null!;

    public string? InitExpression { get; set; }

    public string? CompletionExpression { get; set; }

    public int? TaskTypeId { get; set; }

    public string? Description { get; set; }

    public int? AncestorTaskId { get; set; }
    

    public int? PredesessorTaskId { get; set; }

    public int CreatedBy { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int CurrentStatus { get; set; }

    public int RowVer { get; set; } =1;
    public virtual ICollection<WffieldViewModel>? taskfields { get; set; } = new List<WffieldViewModel>();
}
