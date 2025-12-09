using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Compaignrecipient
{
    public long Id { get; set; }

    public int? NetworkId { get; set; }

    public string ContentId { get; set; } = null!;

    public int? SourceId { get; set; }

    public string? Desc { get; set; }

    public int? OrgId { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }

    public int? AlbumId { get; set; }
}
