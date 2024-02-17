
namespace com.blazor.bmt.viewmodels;

public partial class ProductViewModel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ShortCode { get; set; }

    public string? BarCode { get; set; }

    public string? Description { get; set; }

    public int? CategoryId { get; set; }
    public int? AssignmentType { get; set; }
    public int? BusinessEntityId { get; set; } = 0;
    public int ManufactureCountryId { get; set; }

    public int GroupId { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Picture { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
