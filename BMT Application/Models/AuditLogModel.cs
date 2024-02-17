using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model
{
    public partial class AuditLogModel
    {
        public long Id { get; set; }
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
