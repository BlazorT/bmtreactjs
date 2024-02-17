using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Mediacontent : EntityTransaction
{
    //public long Id { get; set; }

    public string Name { get; set; } = null!;

    public int? CompaignId { get; set; }

    public string ContentCode { get; set; } = null!;

    public string? Title { get; set; }

    public string? EpisodeNo { get; set; }

    public string? MetaData { get; set; }

    public int? SourceRefId { get; set; }

    public string? Description { get; set; }

    public string? Remarks { get; set; }

    public string? MimeType { get; set; }

    public int? ContentTypeId { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public string? PosterImage { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }
}
