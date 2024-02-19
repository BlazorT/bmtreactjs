using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model
{
    public partial class AuditLogModel
    {
        public long Id { get; set; }

        public int AuditEntityId { get; set; }

        public string KeyValue { get; set; } = null!;

        public string AttributeName { get; set; } = null!;

        public string OldValue { get; set; } = null!;

        public string NewValue { get; set; } = null!;

        public int OrgId { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
