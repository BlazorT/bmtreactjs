
namespace com.blazor.bmt.viewmodels;

public partial class MenuViewModel
{
    public int Id { get; set; }
    public int? AssignmentId { get; set; }
    public int? submenuId { get; set; }
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? ActionName { get; set; }
    public string? Badge { get; set; }
    public string? Tag { get; set; }

    public string? Title { get; set; }

    public string? MenueIcon { get; set; }
    public string? ComponentName { get; set; }

    public int? ParentId { get; set; }

    public int? RoleId { get; set; }

    public byte? Full { get; set; }

    public byte? CanAdd { get; set; }

    public byte? CanDelete { get; set; }

    public byte? CanExport { get; set; }

    public byte? CanPrint { get; set; }

    public byte? CanView { get; set; }

    public byte? CanUpdate { get; set; }

    public int SortOrder { get; set; }
    public int? ParentMSortOrder { get; set; } = 0;

    public sbyte IsVisible { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? Status { get; set; }
}
