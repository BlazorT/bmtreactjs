using System;

namespace com.blazor.bmt.viewmodels
{   
    public class GlobalBasicConfigurationsViewModel
    {
        public static int? Id { get; set; }
        public  static int? DefaultPublicUserId { get; set; }

        public static int? DefaultDspid { get; set; }

        public static string? DefaultDspname { get; set; }

        public static string SmtpServer { get; set; } = null!;

        public static int? Smtpport { get; set; }

        public static byte? IsProxyEnabled { get; set; }

        public static byte? Sslenabled { get; set; }

        public static long? SmsQouta { get; set; }

        public static string? ProxyServer { get; set; }

        public static string? ProxyUserPwd { get; set; }

        public static string? ProxyUserName { get; set; }

        public static string? DspAdminEmail { get; set; }

        public static string? SmsServiceUser { get; set; }

        public static string? SmsPassword { get; set; }

        public static string? SmsServiceUrl { get; set; }

        public static string SmtpUser { get; set; } = null!;

        public static string SmtpSenderEmail { get; set; } = null!;

        public static byte? email_notification_enabled { get; set; }

        public static byte? sms_notification_enabled { get; set; }

        public static string SmtpUserPwd { get; set; } = null!;

        public static string FcmSenderId { get; set; } = null!;

        public static string FcmServerKey { get; set; } = null!;

        public static string ApiAuthKey { get; set; } = null!;

        public static string InsertSmshistoryQuery { get; set; } = null!;

        public static string UpdateSmsnotificationsQuery { get; set; } = null!;

        public static string GetSmsnotificationsQuery { get; set; } = null!;

        public static int? LastUpdatedBy { get; set; }

        public static int? CreatedBy { get; set; }

        public static DateTime CreatedAt { get; set; }

        public static DateTime? LastUpdatedAt { get; set; }

        public static int? Status { get; set; }
    }
}
