namespace com.blazor.bmt.viewmodels;
public partial class MediacontentViewModel
{

    public long Id { get; set; }
    public string Name { get; set; } = null!;

    public Int64? CompaignId { get; set; }

    public string? Title { get; set; }

    public string? EpisodeNo { get; set; }

    public string? MetaData { get; set; }

    public Int64? SourceRefId { get; set; }

    public string? Description { get; set; }

    public string? Remarks { get; set; }

    public int? ContentTypeId { get; set; }

    public string? Mediacontentcol { get; set; }
    public string? ContentCode { get; set; }
    public string? PosterImage { get; set; }


    public string? MessageRefId { get; set; }
    public int? DeliveryStatus { get; set; }


    public string? MimeType { get; set; }


    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }
}
