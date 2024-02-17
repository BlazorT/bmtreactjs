namespace com.blazor.bmt.viewmodels;

public partial class FleetrosterplanViewModel
{
    public long Id { get; set; }
    public Int64? RosterId { get; set; }
    public int? RosteredDaid { get; set; }
    public int? HelperDriverId { get; set; }
    public string? Wincode { get; set; }
    public string? Code { get; set; }    
    public string? VehicleName { get; set; }
    public string? DAUserName { get; set; }
    public int? MakeDetailId { get; set; }
    public string? Contact { get; set; }
    public string? NumberPlate { get; set; }
    public int? stateId { get; set; }

    public int? CategoryId { get; set; }
    public int? OwnershipTypeId { get; set; }

    public string? CustomField1 { get; set; }

    public string? CustomField2 { get; set; }

    public string? CustomField3 { get; set; }

    public int? Status { get; set; }

    public string? RosterRemarks { get; set; }

    public int? LastUpdatedBy { get; set; }
    
   public DateTime? ScheduleDate { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public long VehicleId { get; set; }

   // public virtual ICollection<FleetrosterplanViewModel>? rosterfleetplans { get; set; } = new List<FleetrosterplanViewModel>();
}
