namespace com.blazor.bmt.viewmodels;
public partial class MediacontentViewModel
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public string FileName { get; set; } = null!;

    public long? UserId { get; set; }

    public long? Daid { get; set; }

    public byte? IsDownloadAllowed { get; set; }

    public string? Remarks { get; set; }

    public string? MimeType { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Sr { get; set; }
}
