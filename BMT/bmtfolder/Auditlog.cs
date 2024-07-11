using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Auditlog
{
    public long Id { get; set; }

    public int AuditEntityId { get; set; }

    public string? KeyValue { get; set; }

    public string? AttributeName { get; set; }

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public int? DspId { get; set; }

    public int? FieldId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }
}
