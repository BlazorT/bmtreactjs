namespace com.blazor.bmt.viewmodels;
public partial class WorkflowmappingViewModel
{
    public int Id { get; set; }

    public int WftaskId { get; set; }

    public int? DspId { get; set; }

    public string? InitExp { get; set; }

    public int CreatedBy { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public string? CompletionExp { get; set; }

    public int? AncestorTaskId { get; set; }

    public int? PrecessorTaskId { get; set; }
}
