using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Roleright
{
    public int Id { get; set; }

    public int RoleId { get; set; }

    public int MenuId { get; set; }

    public byte? Full { get; set; }
    public byte? CanAdd { get; set; }
    public byte? CanDelete { get; set; }

    public byte? CanExport { get; set; }

    public byte? CanPrint { get; set; }

    public byte? CanView { get; set; }

    public byte? CanUpdate { get; set; }

    public int? Status { get; set; }

    public int? UpdatedBy { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int RowVer { get; set; }
}
