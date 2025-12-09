using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Notification
{
    public long Id { get; set; }

    public int NetworkId { get; set; }

    public int? ComaignId { get; set; }

    public int? OrganizationId { get; set; }

    public byte NotificationTypeId { get; set; }

    public string? Recipient { get; set; }

    public string? SendFrom { get; set; }

    public string? Body { get; set; }

    public string? Subject { get; set; }

    public string? Title { get; set; }

    public string? MessageRefId { get; set; }

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime ExpiryTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? DeliveryStatus { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public int? LikesCount { get; set; }

    public int? ClicksCount { get; set; }

    public int? SharesCount { get; set; }

    public int? CommentsCount { get; set; }

    public int? ReadCount { get; set; }

    public int? ViewsCount { get; set; }
}
