namespace com.blazor.bmt.viewmodels
{
    public partial class AuditLogViewModel
    {
        public long AuditLogId { get; set; }

        public int AuditEntityId { get; set; }

        public string KeyValue { get; set; } = null!;

        public string AttributeName { get; set; } = null!;

        public string OldValue { get; set; } = null!;

        public string NewValue { get; set; } = null!;

        public int StoreId { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
