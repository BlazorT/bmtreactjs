namespace com.blazor.bmt.viewmodels
{
    public partial class AuditLogViewModel
    {
        public long Id { get; set; }
        public int AuditEntityId { get; set; }
        public string KeyValue { get; set; }
        public string AttributeName { get; set; }
        public string? userName { get; set; }
        public string? entityName { get; set; }
        public string? keyword { get; set; }
        public string? fieldName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public int DspId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
