using System;

namespace com.blazor.bmt.viewmodels
{
    public  class ConfigurationsViewModel
    {
        public string PROXY_USER { get; set; } = String.Empty;
        public string IS_PROXY_ENABLED { get; set; } = String.Empty;      
        public string PROXY_SENDER_USER_PWD { get; set; } = String.Empty;
  
        public string SMS_MESSAGE_TEMPLATE { get; set; } = String.Empty;
        public string SMS_SERVICE_PWD { get; set; } = String.Empty;
        public int OrgId { get; set; } = 1;
        public int? LastUpdatedBy { get; set; }
        public string OrgName { get; set; } = String.Empty;
       
       
        public string ViewCountIntervalSeconds { get; set; } = "30";
   
        public bool enableEmailNotification { get; set; } = true;
        public bool enableAppNotification { get; set; } = false;
        // public static string flagReportEmailBody { get; set; } = String.Empty;
        public string invitationEmailBody { get; set; } = String.Empty;
        public string invitationEmailSubject { get; set; } = String.Empty;

        public string stmpuser { get; set; } = "user";
        public string stmpserver { get; set; } = "smtp.gmail.com";        
        public string stmppwd { get; set; } = "htt6755";
        public string smtpport { get; set; } = "587";       
        public string flagReportEmailBody { get; set; } = String.Empty;
        public string vehicleUploadEmailbody { get; set; } = String.Empty;
        public string accountActivateEmailBody { get; set; } = String.Empty;
        public string accountBlockEmailBody { get; set; } = String.Empty;
        public string CompaignUploadNotificationEmailSubject { get; set; } = String.Empty;
        public string archiveTime { get; set; } = String.Empty;
        public string freeTimeInSeconds { get; set; } = String.Empty;
        public bool enableComments { get; set; } = false;
        public bool enableFreeMinutes { get; set; } = false;

        public string profilePwdResetEmail = "profilePwdResetEmail";
        public string profilePwdResetEmailSubject = "4DSPS - Forgot Password";
        //  public static string VehicleOfferNotificationEmailBody { get; set; } = "VehicleOfferNotificationEmailBody";       
        public string SmsMessageBody { get; set; } = "smsMessageBody";
      
        public string OrganizationRejectedEmailBody { get; set; } = "OrganizationRejectedEmailBody";
        public string OrganizationApprovedEmailBody { get; set; } = "OrganizationApprovedEmailBody";
        public string AccountDeletedEmailBody { get; set; } = "AccountDeletedEmailBody";     
        public string AccountStatusChangedEmailBody { get; set; } = "AccountStatusChangedEmailBody";  
      
       
        public bool enableSMS { get; set; } = false;       
        public string VehicleSharingEmailBody { get; set; } = String.Empty;
        public string VehicleSharingEmailSubject { get; set; } = "6BY7 LLC - Vehicle uploaded";
        public string InspectionRequestEmailBody { get; set; } = String.Empty;
        public string InspectionRequestEmailSubject { get; set; } = "6BY7 LLC  - Inspection Request";
        public string InspectionReportEmailBody { get; set; } = String.Empty;
        public string InspectionReportEmailSubject { get; set; } = "6BY7 LLC  - Inspection Report";
    }
    public partial class ConfigrationsMergedViewModel
    {       
        public  string PROXY_USER { get; set; } = String.Empty;
        public  string IS_PROXY_ENABLED { get; set; } = String.Empty;
        public  string SMS_SERVICE_URL { get; set; } = String.Empty;
        public  string PROXY_SENDER_USER_PWD { get; set; } = String.Empty;
        public  string SMS_SERVICE_QOUTA { get; set; } = String.Empty;
        public  string SMS_SERVICE_USERNAME { get; set; } = String.Empty;
        public  string SMS_MESSAGE_TEMPLATE { get; set; } = String.Empty;
        public  string SMS_SERVICE_PWD { get; set; } = String.Empty;
        public int ShowRoomId { get; set; }
        public string ShowRoomName { get; set; } = String.Empty;
        public  string API_AUTH_KEY { get; set; } = String.Empty;
      
        public  string stmpuser { get; set; } = "user";
        public  string stmpserver { get; set; } = "smtp.gmail.com";
        // public static string AccountPwdResetEmail { get; set; } = String.Empty;
       
        public  string ViewCountIntervalSeconds { get; set; } = "30";
        public  string stmppwd { get; set; } = "htt6755";
        public  string smtpport { get; set; } = "587";
        public  bool enableEmailNotification { get; set; } = true;
        public  bool enableAppNotification { get; set; } = true;
        // public static string flagReportEmailBody { get; set; } = String.Empty;
        public string invitationEmailBody { get; set; } = String.Empty;
        public string invitationEmailSubject { get; set; } = "4DSPS Registeration";
        public string profilePwdResetEmail = "profilePwdResetEmail";
        public string profilePwdResetEmailSubject = "4DSPS - Forgot Password";
        //  public static string VehicleOfferNotificationEmailBody { get; set; } = "VehicleOfferNotificationEmailBody";       
        public string SmsMessageBody { get; set; } = "smsMessageBody";
        public string OnBoardedEmaillBody { get; set; } = "OnBoardedEmaillBody";
        public string OnBoardedEmaillBodySubject { get; set; } = "4DSPS - Onground Intimation";

        public string BackgroundCheckEmaillBody { get; set; } = "BackgroundCheckEmaillBody";
        public string BackgroundCheckEmaillBodySubject { get; set; } = "4DSPS - Background Check";
        // public static string accountStatusEmailSubject { get; set; } = String.Empty;
        public string DrugCheckEmaillBody { get; set; } = "DrugCheckEmaillBody";
        public string DrugCheckEmaillSubject { get; set; } = "4DSPS - Drug Test";
        public string OffboardedEmailBody { get; set; } = "OffboardedEmailBody";
        public string OffboardedEmailSubject { get; set; } = "4DSPS - Offground";
        public string DSPPerformanceNotification { get; set; } = "DSPPerformanceNotification";
        public string DSPPerformanceNotificationSubject { get; set; } = "4DSPS - Performance";

        public string DAPerformanceNotification { get; set; } = "DAPerformanceNotification";
        public string DAPerformanceNotificationSubject { get; set; } = "4DSPS - DA Performance";

        public string DAReplyNotification { get; set; } = "DAReplyNotification";
        public string DAJObApplyProcessUpdated { get; set; } = "DAJObApplyProcessUpdated";
        public string DAJObApplyProcessUpdatedSubject { get; set; } = "4DSPS - DA Apply";

        public string AccountDeletedEmailBody { get; set; } = "AccountDeletedEmailBody";
        public string AccountDeletedEmailSubject { get; set; } = "4DSPS - Account Deletion";
        public string AccountStatusChangedEmailBody { get; set; } = "AccountStatusChangedEmailBody";
        public string AccountStatusChangedEmailSubject { get; set; } = "4DSPS - Account Status";

        public  string archiveTime { get; set; } = String.Empty;
        public  string freeTimeInSeconds { get; set; } = String.Empty;
        public  bool enableSMS { get; set; } = false;
        public  bool enableFreeMinutes { get; set; } = false;
        //public  string VehicleSharingEmailBody { get; set; } = String.Empty;
        //public  string VehicleSharingEmailSubject { get; set; } = "4DSPS 6BY7 LLC - Vehicle uploaded";
        public  string fcmSenderId { get; set; } = String.Empty;
        public  string fcmServerKey { get; set; } = String.Empty;
      
    }
    public partial class ConfigrationsCombinedViewModel
    {
        public static int Id { get; set; }
        public static int OrgId { get; set; }
        public static string Name { get; set; } = null!;
        public static string Description { get; set; } = null!;
        public static string Key { get; set; } = null!;
        public static string Value { get; set; } = null!;
        public static int Status { get; set; }
        public static int? CreatedBy { get; set; }
        public static DateTime? CreatedAt { get; set; }
        public static int? LastUpdatedBy { get; set; }
        public static DateTime? LastUpdatedAt { get; set; }
        //public static string authKey { get; set; } = String.Empty; 
    }
    public partial class Configration
    {
        public  int Id { get; set; }
        public  int DspId { get; set; }
        public  string Name { get; set; } = null!;
        public  string Description { get; set; } = null!;
        public  string Key { get; set; } = null!;
        public  string Value { get; set; } = null!;
        public  int Status { get; set; }
        public  int? CreatedBy { get; set; }
        public  DateTime? CreatedAt { get; set; }
        public  int? LastUpdatedBy { get; set; }
        public  DateTime? LastUpdatedAt { get; set; }
        //public static string authKey { get; set; } = String.Empty; 
    }
    //public class ConfigurationKeyValues
    //{
    //    public string fcmSenderId { get; set; }
    //    public string fcmServerKey { get; set; }
    //    public string apnBundleId { get; set; }
    //    public string apnP8PrivateKey { get; set; }
    //    public string apnP8PrivateKeyId { get; set; }
    //    public string apnTeamId { get; set; }
    //    public string apnDeviceToken { get; set; }
    //    public string apnServerType { get; set; }

    //}
}
