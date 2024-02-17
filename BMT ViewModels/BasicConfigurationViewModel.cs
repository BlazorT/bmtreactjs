namespace com.blazor.bmt.viewmodels
{
    public partial class BasicConfigurationViewModel
    {
        public int Id { get; set; }

        public int? DefaultPublicUserId { get; set; }

        public int? DefaultDspid { get; set; }

        public string? DefaultDspname { get; set; }

        public string SmtpServer { get; set; } = ""!;
        public string SmtpSenderEmail { get; set; } = ""!;

        public int? Smtpport { get; set; }

        public byte? IsProxyEnabled { get; set; }

        public byte? email_notification_enabled { get; set; } = 1;
        public byte? sms_notification_enabled { get; set; } = 1;

        public byte? Sslenabled { get; set; }

        public long? SmsQouta { get; set; }

        public string? ProxyServer { get; set; }

        public string? ProxyUserPwd { get; set; }

        public string? ProxyUserName { get; set; }

        public string? DspAdminEmail { get; set; }

        public string? SmsServiceUser { get; set; }

        public string? SmsPassword { get; set; }

        public string? SmsServiceUrl { get; set; }

        public string SmtpUser { get; set; } = null!;

        public string SmtpUserPwd { get; set; } = null!;

        public string FcmSenderId { get; set; } = null!;

        public string FcmServerKey { get; set; } = null!;

        public string ApiAuthKey { get; set; } = null!;

        public string InsertSmshistoryQuery { get; set; } = null!;

        public string UpdateSmsnotificationsQuery { get; set; } = null!;

        public string GetSmsnotificationsQuery { get; set; } = null!;

        public int? LastUpdatedBy { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? LastUpdatedAt { get; set; }

        public int? Status { get; set; }
    }

}
