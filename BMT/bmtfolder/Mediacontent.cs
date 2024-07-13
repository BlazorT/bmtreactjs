﻿using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Mediacontent
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public long? CompaignId { get; set; }

    public long? SourceRefId { get; set; }

    public string? Remarks { get; set; }

    public string? Description { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public string? ContentCode { get; set; }

    public string? Title { get; set; }

    public string? EpisodeNo { get; set; }

    public string? MetaData { get; set; }

    public string? Mediacontentcol { get; set; }

    public int? ContentTypeId { get; set; }

    public string? PosterImage { get; set; }
}