using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Notificationlog
{
    public long Id { get; set; }

    public long NotificationId { get; set; }

    public int NetworkId { get; set; }

    public long? ComaignId { get; set; }

    public int? OrganizationId { get; set; }

    public byte NotificationTypeId { get; set; }

    public string? Recipient { get; set; }

    public string? SendFrom { get; set; }

    public string? Body { get; set; }

    public string? Subject { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime ExpiryTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ArchiveTime { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public virtual Notification Notification { get; set; } = null!;
}
