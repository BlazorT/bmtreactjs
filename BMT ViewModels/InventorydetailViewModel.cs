namespace com.blazor.bmt.viewmodels;

public partial class Inventorydetailviewmodel
{
    public Int64 Id { get; set; }
    public int Dspid { get; set; }

    public int ProductDetailId { get; set; }

    public string BarCode { get; set; } = null!;

    public double? SoldQty { get; set; }

    public double PurchasedQty { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }

    public int? AssignedTo { get; set; }

    public int? AssignedQty { get; set; }

    public string? picture { get; set; }
    public string? keyword { get; set; }
    
        public int? TotalSoldStock { get; set; }
    public int? TotalAvailableStock { get; set; }
    public int? manufactureCountryId { get; set; }
    public int? BusinessEntityId { get; set; }
    public int? CategoryId { get; set; }
    public string? countryName { get; set; }
    public string? productName { get; set; } = null!;
    public string? shortCode { get; set; } = null!;
   
}
