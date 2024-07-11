using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Mediapicture
{
    public int Id { get; set; }

    public int CompaignId { get; set; }

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string FileUniqueId { get; set; } = null!;

    public int SizeInKbs { get; set; }

    public string? MimeType { get; set; }

    public string? MetaData { get; set; }

    public string? AvailabilityUrl { get; set; }

    public string? Description { get; set; }

    public string? ShortDesc { get; set; }

    public string? Remarks { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Sr { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }
}
