namespace com.blazor.bmt.viewmodels;

public partial class DspstockstatViewModel
{
     public int Id { get; set; }

    public int? Dspid { get; set; }

    public int ProductDetailId { get; set; }

    public double? TotalAvailableStock { get; set; }

    public double? TotalSoldStock { get; set; }

    public double? TotalSaleReseveredStock { get; set; }

    public double? TotalPurReseveredStock { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }
}
