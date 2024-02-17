namespace com.blazor.bmt.viewmodels;

public partial class PaymentmethodViewModel 
{
     public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int? SortOrder { get; set; }

    public int? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
