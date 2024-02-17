namespace com.blazor.bmt.viewmodels;
public partial class DispatchmentViewModel 
{
    public long Id { get; set; }

    public int Dspid { get; set; }

    public int InventoryOf { get; set; }

    public int? ProductDetailId { get; set; }
    public int? AssignmentType { get; set; } = 0;

    public long? VehicleId { get; set; }
    public string? VehicleName { get; set; }

    public string? shortcode { get; set; }
    public string? ProductName { get; set; }

    public string? AssignedToName { get; set; }
    public int AssignedTo { get; set; }
    public int? isAssigned { get; set; }
     
    public int? AssignedQty { get; set; }
    public int? BusinessEntityId { get; set; }
    public int? AvailableQty { get; set; }

    public string Remarks { get; set; } = null!;

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }

}
