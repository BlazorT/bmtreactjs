using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class OrgpackagedetailModel : BaseModelTransactions
{
    //public long Id { get; set; }

    public int OrgId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int? TargetAudienceId { get; set; }

    public string? Password { get; set; }

    public string? ApikeySecret { get; set; }

    public string? Custom2 { get; set; }

    public string? Custom1 { get; set; }

    public string? Sender { get; set; }

    public int? UnitId { get; set; }

    public int? VirtualAccount { get; set; }

    public string? Url { get; set; }

    public string? HashTags { get; set; }

    public int NetworkId { get; set; }

    public int? PurchasedQouta { get; set; }

    public string? AutoReplyContent { get; set; }

    public int? ReplyMediaContentId { get; set; }

    public int? AutoReplyAllowed { get; set; }

    public int? PostTypeId { get; set; }

    /// <summary>
    /// 1- Message, 2- Post, 3- Reel, 4- Repost, 5- videa, 6- Post With Image
    /// </summary>
    public int? UsedQuota { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime FinishTime { get; set; }

    public int? BufferQuota { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public string? BusinessId { get; set; }

    public string? Apiuri { get; set; }

    public string? Apikey { get; set; }

    public string? WebUrl { get; set; }
}
