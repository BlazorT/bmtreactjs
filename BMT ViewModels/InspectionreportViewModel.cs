namespace com.blazor.bmt.viewmodels;

public partial class InspectionreportViewModel 
{
   public long Id { get; set; }

    public Int64? VehicleId { get; set; }
    public int? DspId { get; set; }

    public string? Remarks { get; set; }

    public int InspectedBy { get; set; }
    public string? InspectorName { get; set; }
    public string? VehicleWinCode { get; set; }

    public string? itemsJson { get; set; }
    public string? inspectiontype { get; set; }
    public string? ApprovalName { get; set; }
    public int ApprovedBy { get; set; }

    public int? Status { get; set; }

    public int? reportTypeId { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int? categoryId { get; set; }
    public string? ownershipname { get; set; }
    public string? categoryname { get; set; }

    public int? ownershiptypeid { get; set; }
    public int? makedetailid { get; set; }

    public string? makename { get; set; }
    public string? NumberPlate { get; set; }
     

    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }
    public virtual ICollection<VehicleinspectionItemViewModel>? inspectionItems { get; set; } = new List<VehicleinspectionItemViewModel>();
}
