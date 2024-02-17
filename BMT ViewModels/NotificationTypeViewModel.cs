
namespace com.blazor.bmt.viewmodels
{
    public partial class NotificationTypeViewModel
    {
        public byte Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Template { get; set; }
        public string? Color { get; set; }
        public byte? SortOrder { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
    }
}
