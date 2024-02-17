using System;

namespace com.blazor.bmt.viewmodels
{
    public partial class AppTraceViewModel
    {
        public long AppTraceId { get; set; }
        public string MachineIp { get; set; }
        public string UniqueId { get; set; }
        public int UserId { get; set; }
        public int? MenuId { get; set; }
        public string TraceDesc { get; set; }
        public byte? TraceType { get; set; }
        public DateTime? TraceTime { get; set; }
    }
}
