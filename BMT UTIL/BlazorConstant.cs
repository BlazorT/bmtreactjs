using System.Diagnostics;

namespace com.blazor.bmt.util
{
    public class BlazorConstant
    {
        public static string UPDATED_SUCCESS = "<b> {0} </b> is updated successfully, at {1}";
        public static string PASSWORD_UPDATED_SUCCESS = "Password of <b> {0} </b> is updated successfully, at {1}";
        public static string VEHICLE_STATUSE_UPDATED_SUCCESS = "<b> {0} </b> status is updated successfully, at {1}";
        public static string VEHICLE_likes_UPDATED_SUCCESS = "Vehicle {0} like is updated successfully, at {1}";
        public static string UPDATED_NOTIFIED_SUCCESS = "<b> {0} </b> is updated & notified via email {1} successfully, at {2}";
        public static string INSERTED_SUCCESS = "<b> {0} </b> is added successfully, at {1}";
        public static string INSERTED_FAILED = "<b> {0} </b> insert is failed,can try again or contact administrator, Error {1}";
        public static string MERCHANT_ACTIVATION_FAILED = "<b> {0} </b> activation is failed,can try again or contact administrator, Error {1}";
        public static string MERCHANT_ACTIVATION_SUCCESS = "<b> {0} </b> is activated successfully, ready for login, at {1}";
        public static string VEHICLE_DETAILS_SHARE_MESSAGE_SUCCESS = "Vehicle - <b> {0} </b>  details are shared successfully, email sent to  <b>{1}</b> , at {2}";
        public static string VEHICLE_DETAILS_SHARE_MESSAGE_FAILED = "Vehicle - <b> {0} </b>  details, could not be shared, process failed - failure reason - {1} , at {2}";
        public static string UPDATE_FAILED = "<b> {0} </b> update is failed,can try again or contact administrator, Error - {1}";
        public static string DUPLICATE_FAILED = "<b> {0} </b> update is failed, {1} already exists. Please choose another email address.";
        public static string DUPLICATE_INSERT_FAILED = "<b> {0} </b> registration failed, {1} already exists. Please choose another email address.";
        public static string DELETE_FAILED = "Delete of <b> {0} </b> is failed, reference data can be reason, try again or contact administrator, Error {1}";
        public static string DELETE_SUCCESS = "Delete of <b> {0} </b> is completed successfully, at {1}";
        public static string CANCEL_MESSAGE = "Are you sure, you want cancel? ";
        public static string LEAVE_PAGE_MESSAGE = "Are you sure, you want to leave this page? ";
        public static string RESET_MESSAGE = "Sure, you want to reload page, all changes will be discarded..? ";
        public static string UPLOAD_INPROGRESS_WAIT_MESSAGE = "Upload is not complete, please first complete upload..!";
        public static string DELETE_CONFIRMATION_MESSAGE = "Are you sure, you want to delete ? ";
        public static string ACTIVATE_CONFIRMATION_MESSAGE = "Are you sure, you want to activate ? ";
        public static string REPORT_VEHICLE_CONFIRMATION_MESSAGE = "Are you sure, you want to report the selected vehicle ? ";
        public static string DUPLICATE_VEHICLE_DATA_CONFIRMATION = "Are you sure, you want to make copy data from the selected vehicle ? ";
        public static string Block_VEHICLE_CONFIRMATION_MESSAGE = "Are you sure, you want to Block the selected vehicle ? ";
        public static string SOLD_VEHICLE_CONFIRMATION_MESSAGE = "Are you sure, you want to change the selected vehicle status to Sold? ";
        public static string LIKE_VEHICLE_CONFIRMATION_MESSAGE = "Are you sure, you want to like vehicle? ";
        public static string UNSUBSCRIPTION_CONFIRMATION_EMAIL = " Dear {0} <br > Thank you for using Blazor Media Toolkit (BMT) service, Your account is closed at {1}, its no more accessible, <br><br> For data retrieval, can contact BMT Admin till <b>{2}</b> date via phone , Charges may apply.  Thank you!!! <br><br> Blazor Media Toolkit (BMT), Admin <br> +92(42) 35132337  <br> https://bmt.blazortech.com/ ";
        public static string UNSUBSCRIPTION_REQUEST_EMAIL = " Dear {0} <br > Thank you for using Blazor Media Toolkit (BMT) service, we received your account close request at {1}, please use this confirmation code <b>{2} </b> to complete this process. <br><br> As a result your all data will be deleted and within 7 days only retreival can be possible, for that you need to contact Blazor Media Toolkit (BMT) admin.  Thank you!!! <br><br> Blazor Media Toolkit (BMT), Admin <br> +92(42) 35132337  <br> https://bmt.blazortech.com/ ";

        public static string LOGGEDOUT_MESSAGE = "You are logged out....!";
        public static string LOGGEDOUT_MESSAGE_CONFIRMATION = "Are you sure, you want to log-out ? ";
        public static string UPLOAD_VIDEO_SIZE_LIMIT = "File of size <= {0} is allowed for manual upload, its size is {1}, can try more sized file bulk upload..!";
        public static string INVITATION_EMAIL_SENT_SUCCESSFULLY = "Subscription request from this email {0} has been successfully, at {1}.";
        public static string RESEND_INVITATION_EMAIL_SENT_SUCCESSFULLY = "Invitation resent to {0} successfully, at {1}.";
        public static string RESEND_EMAIL_ALREADY_SENT = "Email to <b>{0}</b> already has been sent, must wait for 20 minutes for next email!";
        public static string INVITATION_EMAIL_FAILED = "Invitation request from <b>{0}</b> is failed. Try later or contact 4DSPS team. Error {1}";
        public static string RESEND_INVITATION_EMAIL_FAILED = "Reset request from <b>{0}</b> is failed. Try later or contact 4DSPS team. Error {1}";
        public static string RESET_EMAIL_SENT_SUCCESSFULLY = "Password reset request recieved and confirmation code has been sent at email address <b>{0}</b> successfully, at {1}. ";
        public static string ACCOUNT_DELETE_TOKEN_SENT_SUCCESSFULLY = "Account delete request recieved and confirmation code has been sent at email address <b>{0}</b> successfully, at {1}. ";
        public static string ACCOUNT_DELETE_EMAIL_SENT_SUCCESSFULLY = "Your Account <b>{0}</b> is closed successfully, at {1}. ";
        public static string UNSUBSCRIBE_EMAIL_FAILED  = "Unsubscribe reset request failed for email address <b>{0}</b>, Error Details- {1}, ";
        public static string RESET_EMAIL_FAILED = "Password reset request  failed for email address <b>{0}</b>, Error Details- {1}, ";
        public static string RESET_EMAIL_ALREADY_RECIEVED = "Password Reset request already sent at email address <b>{0}</b> please wait 30 minutes for another reset request,  {1}!";
        public static string LOGGED_OUT_MSG = "4DSPS Logged-Out";
        public static string LOGGED_IN_MSG = "4DSPS Logged-In";
        public static string EXTERNAL_DELIMETER1 = "$";
        public static string TOKEN_EXTERNAL_DELIMETER = "_";       
        public static string USER_IDENTTITY = "ShowRoomIdentity";
        public static string COOKIES_AUTHENTICATION_KEY = "ShowRoomCookieAuthentication"; 
        public static string CORS_POLICY_KEY = "BlazorCorsPolicy";
        public static string UPLOAD_SUCCESS = "<b> {0} </b> is uploaded successfully, at {1}";
        public static string UPLOAD_FAILED = "<b> {0} </b> upload failed,try another time or contact Blazor Media Toolkit administrator, Error - {1}";
        public const string DELIMETER = ",";
        public static string EXTERNAL_DELIMETER = "$";
        public const string SECKEY = "8102@RoZaLb";
        public static string SECKEYCODE = "@RoZ";
        public static int REQUEST_INTERVAL_SECONDS = 60;
        public static int DEFAULT_CURRENCY = 2;
        public static int REQUEST_INTERVAL_EMAIL_SECONDS = 10;
        public static int REQUEST_INTERVAL_SHORT_INTERVAL = 3;
        public static int REQUEST_INTERVAL_THIN_SHORT_INTERVAL = 1;
        public static string CONNECTION_STRING = "";
        public static string SENDER_FMC_TOKEN = "";
        public static string MESSAGING_API_KEY = "";
        public static string CACHE_KEY_FORGOTPWD = "Forgotpassword";  
        public static string UPLOAD_WEB_ROOT_UPLOADFOLDER = @"/wwwroot/productimages/";
  
        public static string API_AUTH_KEY = "ApiAuthKey";

        public static string fcmSenderId = "fcmSenderId";
        public static Int16 DEFAULT_VEHICLE_ROWS = 6;
        public static Int16 DEFAULT_VEHICLE_ROWS_HOME = 39;
        public static string fcmServerKey = "fcmServerKey";      

        public static string MESSAGE_TEMPLATE { get; set; } = String.Empty;  
       
        public static string SMTP_EMAIL_SERVER = "smtpserver";      
        // SMS
        public static string SMS_ENABLE = "EnableSMS";
        public static string SMS_PASSWORD = "SMSPassword";
        public static string SMS_MESSAGE_TEMPLATE = "smstemplate";
        public static string SMS_SERVICE_QOUTA = "SMSQouta";
        public static string SMS_SERVICE_USERNAME = "SMSUserName";
        public static string SMS_SENDER_CODE = "SMSSenderName";
        public static string SMS_SERVICE_URL = "SMSServiceURL";
        public static string SMS_QOUTA = "SMSQouta";
        public static string SMS_SENT_COUNT = "SentSMSMessages";
        public static string TIME_INTERVAL_FOR_SENDING_SMS_SECS = "TimeIntervalForSendingSMS";
        // Admin Group
        public static string BLAZOR_ADMIN_GROUP = "znawazch@gmail.com";
        // TAX
        public static string TAX = "tax";
        //EMAIL
        public static string SMTP_EMAIL_USER = "stmpuser";
        public static string SENDER_EMAIL_USER = "stmpuser";
        public static string EMAIL_SUBJECT = "invitationEmailSubject";
      //  public static string PASSWORD_RESET_EMAIL_BODY = "profilePwdResetEmail";
        public static string SMTP_EMAIL_PWD = "stmppwd";
        public static string SMTP_PORT = "smtpport";
 
        public static string ENABLE_EMAIL_NOTIFICATION = "enableEmailNotification";
        public static string ENABLE_APP_NOTIFICATION = "enableAppNotification";
        public static string VIEW_COUNT_INTERVAL = "ViewCountIntervalSeconds";      
        public static string PROXY_USER = "ProxyUserName";
        public static string IS_PROXY_ENABLED = "IsProxyEnabled";
       
        public static string PROXY_SENDER_USER_PWD = "ProxyUserPassword";
        public static string UPRDATE_NOTIFICATION_QRY = "UpdateNotifications";
        public static string INSERT_NOTIFICATION_QRY_HISTROY = "InsertHistory";
        public static string SELECT_NOTIFICATION_QRY = "GetNotifications";

        //public static string enableEmailNotification { get; set; } = "enableEmailNotification";
        //public static string enableAppNotification { get; set; } = "enableAppNotification";
        // public static string flagReportEmailBody { get; set; } = String.Empty;
        public static string INVITATION_EMAIL_BODY { get; set; } = "invitationEmailBody";
        public static string INVITATION_EMAIL_SUBJECT { get; set; } = "invitationEmailSubject";       
        public static string ACCOUNT_PASSWORD_RESET_EMAIL_BODY = "profilePwdResetEmail";
        public static IFormatProvider? INSERTED_SUCCESS_API;

        //  public static string VehicleOfferNotificationEmailBody { get; set; } = "VehicleOfferNotificationEmailBody";       
        public static string WHATSAPP_TEMPLATE { get; set; } = "WhatsApp";
        public static string INSTA_TEMPLATE { get; set; } = "instagram";
        public static string TWITTER_TEMPLATE { get; set; } = "twitter";
        // public static string accountStatusEmailSubject { get; set; } = String.Empty;
        public static string SNAPCHAT_TEMPLATE { get; set; } = "snapchat";
        public static string TIKTOK_TEMPLATE { get; set; } = "tiktok";
        public static string LINKEDIN_TEMPLATE { get; set; } = "linkedin";
        public static string FACEBOOK_TEMPLATE { get; set; } = "facebook";    
        public static string ACCOUNT_DELETED_EMAIL_BODY { get; set; } = "AccountDeletedEmailBody";
        public static string ACCOUNT_STATUS_CHANGED_EMAIL_BODY { get; set; } = "AccountStatusChangedEmailBody";
 


    }
}
