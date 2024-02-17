using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Mediasourceinfo : EntityTransaction
{
    //public long Id { get; set; }

    public int? UserId { get; set; }

    public int? CompaignId { get; set; }

    public string FileName { get; set; } = null!;

    public string Ftppath { get; set; } = null!;

    public string FileUniqueId { get; set; } = null!;

    public int? SizeInKbs { get; set; }

    public string? MimeType { get; set; }

    public int? CategoryId { get; set; }

    public string? EpisodeNo { get; set; }

    public string? MetaData { get; set; }

    public byte? DownloadStatus { get; set; }

    public string? AvailabilityUrl { get; set; }

    public string? Description { get; set; }

    public string? ShortDesc { get; set; }

    public string? ContentDesc { get; set; }

    public string? Remarks { get; set; }

    public DateTime AvailabilityTime { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
