using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core
{
    public partial class AuditLog:EntityTransaction
    {
       // public long Id { get; set; }
        public int AuditEntityId { get; set; }
        public string KeyValue { get; set; }
        public string AttributeName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public int DspId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }

       // public virtual Users CreatedByNavigation { get; set; }
    }
}
