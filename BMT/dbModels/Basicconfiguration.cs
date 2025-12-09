using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Basicconfiguration
{
    public int Id { get; set; }

    public int? DefaultPublicUserId { get; set; }

    public int? DefaultOrgId { get; set; }

    public string? DefaultOrgName { get; set; }

    public string SmtpServer { get; set; } = null!;

    public int? Smtpport { get; set; }

    public byte? IsProxyEnabled { get; set; }

    public byte? Sslenabled { get; set; }

    public long? SmsQouta { get; set; }

    public string? ProxyServer { get; set; }

    public string? ProxyUserPwd { get; set; }

    public string? ProxyUserName { get; set; }

    public string? AdminEmail { get; set; }

    public string? SmsServiceUser { get; set; }

    public string? SmsPassword { get; set; }

    public string? SmsServiceUrl { get; set; }

    public string SmtpUser { get; set; } = null!;

    public string SmtpUserPwd { get; set; } = null!;

    public string FcmSenderId { get; set; } = null!;

    public string FcmServerKey { get; set; } = null!;

    public string ApiAuthKey { get; set; } = null!;

    public string InsertSmshistoryQuery { get; set; } = null!;

    public string EmailSender { get; set; } = null!;

    public string GetSmsnotificationsQuery { get; set; } = null!;

    public int? LastUpdatedBy { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    public string? SmtpSenderEmail { get; set; }

    public sbyte? EmailNotificationEnabled { get; set; }

    public sbyte? SmsNotificationEnabled { get; set; }
}
