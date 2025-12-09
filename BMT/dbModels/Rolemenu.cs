using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Rolemenu
{
    public int Id { get; set; }

    public int RoleId { get; set; }

    public int MenuId { get; set; }

    public byte? CanDelete { get; set; }

    public byte? CanDownload { get; set; }

    public byte? CanView { get; set; }

    public byte? CanPlay { get; set; }

    public byte? CanUpdate { get; set; }

    public int? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }
}
