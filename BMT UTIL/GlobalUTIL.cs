using System.Data.Common;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Data;
using CorePush.Google;
using System.Globalization;
using com.blazor.bmt.viewmodels;
using MySql.Data.MySqlClient;

namespace com.blazor.bmt.util
{
    public class GlobalSettings
    {
        public static string? loginUserName { get; set; }
        public static int loginUserId { get; set; }
        public static int loginRoleId { get; set; }
        public static string loginRoleName { get; set; }    
        public static string? loginAvatar { get; set; }
        //public static string? VAT_TAXID { get; set; }
        public static string? LoginUserContact { get; set; }
        public static int LoginUserCityId { get; set; }
        public static int LoginUserStateId { get; set; }
        public static string? LoginUserEmail { get; set; }
        public static string? OrgContact { get; set; }
        public static string? OrgWhatsApp { get; set; }
        public static string? OrgCityName { get; set; }
        public static string? OrgStateName { get; set; }
        //public static string? DspCurrency { get; set; } = (new RegionInfo(Thread.CurrentThread.CurrentUICulture.LCID)).ISOCurrencySymbol;
        public static string? OrgName { get; set; } = "BMT LLC";
        public static int DefaultOrgId { get; set; } = 1;
        public static string? OrgOwnerName { get; set; }
        public static string? OrgEmail { get; set; }
        public static string? TradeName { get; set; }
        public static string? OrgLogoPath { get; set; }
        public static string? OrgAddress { get; set; }
        public static List<ConfigurationsViewModel> Configurations { get; set; } = new List<ConfigurationsViewModel>();
        public static int OrgCityId { get; set; }
        //public static int ShowRoomStateId { get; set; }
       // public static int DefaultPublicUser { get; set; }
        
      //  public static int SubscriptionPackageId { get; set; }
        public static string DateTimeFormat { get; set; } = @"dd/MM/yyy hh:mm:ss";
       // public static string BlazorAdminGroup { get; set; }


    }
        public class GlobalUTIL
    {
        public static List<GlobalLookUpViewModel> LookUpsCollection = new List<GlobalLookUpViewModel>();

        public static DateTime CurrentDateTime{           
            get
            {
                return DateTime.UtcNow;
            } 
         }
        public static DateTime benchmarktime { get; set; }
        private static readonly HttpClient http = new HttpClient();
        public static List<UserViewModel> userls = new List<UserViewModel>();
        public static string VehicleImagePath = "vehicleImages\\";
        public static string VehicleImageWebPath = "wwwroot\\vehicleImages\\";
        public static List<string> Roles = new List<string>(new string[] { "SuperAdmin", "Admin", "Supervisor", "User", "Staff", "OrgSupervisor" });
       
        public static string Encrypt(string toEncrypt, bool useHashing, string secKey)
        {

            if (secKey.Contains(BlazorConstant.SECKEY))
            {
                byte[] keyArray;
                byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);

                string key = secKey;
                if (useHashing)
                {
                    MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                    keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                    hashmd5.Clear();
                }
                else
                    keyArray = UTF8Encoding.UTF8.GetBytes(key);

                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;

                ICryptoTransform cTransform = tdes.CreateEncryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
                tdes.Clear();
                return Convert.ToBase64String(resultArray, 0, resultArray.Length);
            }
            else return string.Empty;
        }
        //public static List<UsersViewModel> loadAccounts(List<string> accounts)
        //{
        //    userls.Clear();
        //    try
        //    {
        //        foreach (string acount in accounts)
        //        {
        //            UsersViewModel usr = new UsersViewModel();
        //            string usrstr = Decrypt(acount, true, BlazorConstant.SECKEY);
        //            usr.storeid = usrstr.Split(",")[0];
        //            usr.username = usrstr.Split(",")[1];
        //            usr.password = usrstr.Split(",")[2];
        //            usr.storename = usrstr.Split(",")[3];
        //            usr.roleid = usrstr.Split(",")[4];
        //            usr.id = Convert.ToInt32(usr.roleid);
        //            usr.accessToken = usrstr.Split(",")[5];
        //            usr.connectionstr = usrstr.Split(",")[6];
        //            usr.status = usrstr.Split(",")[7];
        //            userls.Add(usr);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return userls;

        //}
        public static bool sendEmail(string mail, string smpt, string token, string senderEmail, string emailBody, string pwd)
        {
            SmtpClient smtpClient = new SmtpClient(smpt, 587);
            try
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail),
                    Subject = string.Format("Forgot Password, {0}", senderEmail),
                    Body = string.Format(emailBody, token),
                    IsBodyHtml = true,
                };
                smtpClient.Credentials = new System.Net.NetworkCredential(senderEmail, pwd);
                mailMessage.To.Add(mail);
                smtpClient.EnableSsl = true;
                smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;

        }
        internal static string Decrypt(string connectionString)
        {
            throw new NotImplementedException();
        }
        public static bool IsValidEmail(string email) {
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith(".") || !trimmedEmail.Contains('@') || !trimmedEmail.Contains('.') || ("" + trimmedEmail).Length < 5) {
                return false; // suggested by @TK-421
            }
            try {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch {
                return false;
            }
        }
        public static string Decrypt(string cipherString, bool useHashing, string secKey)
        {
            try
            {
                if (secKey.Contains(BlazorConstant.SECKEY))
                {
                    byte[] keyArray;
                    byte[] toEncryptArray = Convert.FromBase64String(cipherString);
                    string key = secKey;
                    if (useHashing)
                    {
                        MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                        keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                        hashmd5.Clear();
                    }
                    else
                        keyArray = UTF8Encoding.UTF8.GetBytes(key);

                    TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                    tdes.Key = keyArray;
                    tdes.Mode = CipherMode.ECB;
                    tdes.Padding = PaddingMode.PKCS7;

                    ICryptoTransform cTransform = tdes.CreateDecryptor();
                    byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

                    tdes.Clear();
                    return UTF8Encoding.UTF8.GetString(resultArray);
                }
                else return string.Empty;
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }
        
        public static async Task SendFcmNotificationAsync( string title, string strMsg, string[] recipients)
        {
            try {
                //var settings = new FcmSettings {
                //    SenderId = BasicConfigurationsViewModel.fcmSenderId,
                //    ServerKey = BasicConfigurationsViewModel.fcmServerKey
                //};

                //var fcm = new FcmSender(settings, http);
                //var payload = new {
                //    notification = new { body = strMsg, title = title }
                //};
                //// List<string> tokens = new List<string> { "cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8", "cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8" };
                //foreach (string token in recipients) {
                //    var response = await fcm.SendAsync(token, payload);
                //}
            }
            catch (Exception ex) { 
            
            }

        }
        public static List<UserViewModel> getMobileUsers(int orgId, int mobileSource = 0)
        {
            List<UserViewModel> OrgUsers = new List<UserViewModel>();
            using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    List<MySqlParameter> parameter = new List<MySqlParameter>();
                    MySqlParameter pOrgId = new MySqlParameter("p_OrgId", SqlDbType.Int);
                    pOrgId.Value = orgId;
                    parameter.Add(pOrgId);
                    MySqlParameter pRegistrationSource = new MySqlParameter("p_registrationSource", SqlDbType.Int);
                    pRegistrationSource.Value = mobileSource;
                    parameter.Add(pRegistrationSource);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddRange(parameter.ToArray());
                    command.CommandText = "spGetApiNotificationUsers";
                    using (DbDataReader dr = command.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            UserViewModel user = new UserViewModel();
                            user.Id = Convert.ToInt32(dr["Id"]);
                            //user.username = "" + (dr["UserName"]);
                            //user.FMCToken = "" + (dr["FMCToken"]);
                            //user.storeid = Convert.ToInt32(dr["StoreID"]);
                            //user.roleid = Convert.ToInt32(dr["RoleID"]);
                            //user.address = "" + dr["Address"];
                            //user.identityId = "" + dr["IdentityID"];
                            //user.RegistrationSource = Convert.ToInt32(dr["RegistrationSource"]);
                            //user.status = Convert.ToInt32(dr["Status"]);
                            //user.primarycontact = Convert.ToString(dr["PrimaryContact"]);
                            //user.token = Convert.ToString(dr["Token"]);
                            OrgUsers.Add(user);
                        }//while (dr.Read())
                    }// using (DbDataReader dr = command.ExecuteReader())                        
                }
            }
            return OrgUsers;
        }
        public static void loadConfigurations(Int32 OrgId=1)
        {
            using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    List<MySqlParameter> parameter = new List<MySqlParameter>();
                    MySqlParameter pOrgId = new MySqlParameter("p_OrgId", SqlDbType.Int);
                    pOrgId.Value = 1;
                    parameter.Add(pOrgId);
                    command.CommandText = "spWebApiConfigs";
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddRange(parameter.ToArray());
                    ConfigurationsViewModel viewModel = new ConfigurationsViewModel();
                    using (DbDataReader dr = command.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            viewModel.OrgId = OrgId;
                            // Notification
                     
                            if (BlazorConstant.SMS_MESSAGE_TEMPLATE.ToLower() == ("" + (dr["key"])).ToLower())
                                viewModel.SMS_MESSAGE_TEMPLATE = "" + (dr["value"]);                          
                           
                            if (BlazorConstant.ENABLE_EMAIL_NOTIFICATION.ToLower() == ("" + (dr["key"])).ToLower())
                            viewModel.enableEmailNotification = string.IsNullOrWhiteSpace(""+(dr["value"]))?false:Convert.ToBoolean(Convert.ToInt16("" + (dr["value"])));
                            if (BlazorConstant.ENABLE_APP_NOTIFICATION.ToLower() == ("" + (dr["key"])).ToLower())
                                viewModel.enableAppNotification = string.IsNullOrWhiteSpace("" + (dr["value"])) ? false : Convert.ToBoolean(Convert.ToInt16("" + (dr["value"])));
                           if (BlazorConstant.INVITATION_EMAIL_BODY.ToLower() == ("" + (dr["key"])).ToLower())
                                viewModel.invitationEmailBody = "" + (dr["value"]);
                            if (BlazorConstant.INVITATION_EMAIL_SUBJECT.ToLower() == ("" + (dr["key"])).ToLower())
                                viewModel.invitationEmailSubject = "" + (dr["value"]);                                                     
                            if (BlazorConstant.ACCOUNT_DELETED_EMAIL_BODY.ToLower() == ("" + (dr["key"])).ToLower())// Account Status
                                viewModel.AccountDeletedEmailBody = "" + (dr["value"]);                           
                            if (BlazorConstant.SMS_MESSAGE_BODY.ToLower() == ("" + (dr["key"])).ToLower())// Account Status
                                viewModel.SmsMessageBody = "" + (dr["value"]);                          
                            if (BlazorConstant.ACCOUNT_DELETED_EMAIL_BODY.ToLower() == ("" + (dr["key"])).ToLower())// Account Status
                                viewModel.AccountDeletedEmailBody = "" + (dr["value"]);
                            if (BlazorConstant.ACCOUNT_STATUS_CHANGED_EMAIL_BODY.ToLower() == ("" + (dr["key"])).ToLower())// Account Status
                                viewModel.AccountStatusChangedEmailBody = "" + (dr["value"]);
                            if (BlazorConstant.ACCOUNT_PASSWORD_RESET_EMAIL_BODY.ToLower() == ("" + (dr["key"])).ToLower())// Account Status
                                viewModel.profilePwdResetEmail = "" + (dr["value"]);

    }//while (dr.Read())
                        if(viewModel.OrgId >0)
                        GlobalSettings.Configurations.Add(viewModel);
                    }// using (DbDataReader dr = command.ExecuteReader())                        
                }
            }
        }
        public static void loadGlobalSettings() {
            if (string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.SmtpServer))
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {

                        command.CommandText = "SELECT Id, proxy_server,proxy_user_pwd,proxy_user_name,isProxyEnabled,email_notification_enabled,sms_notification_enabled,DefaultPublicUserId,DefaultOrgId,DefaultOrgName,SmtpServer,SMTPPort,SSLEnabled,sms_qouta,dsp_admin_email,sms_service_user,sms_password,sms_service_url,SmtpUser,SmtpUserPwd,fcmSenderId,fcmServerKey,ApiAuthKey,InsertSMSHistoryQuery,UpdateSMSNotificationsQuery,GetSMSNotificationsQuery,LastUpdatedBy,CreatedBy,CreatedAt,LastUpdatedAt,Status FROM BasicConfigurations ";
                        command.CommandType = System.Data.CommandType.Text;
                        using (DbDataReader dr = command.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                // Notification
                                //APN
                               
                                GlobalBasicConfigurationsViewModel.Id = Convert.ToByte(dr["Id"]);
                                GlobalBasicConfigurationsViewModel.DefaultPublicUserId = Convert.ToInt32(dr["DefaultPublicUserId"]);
                                GlobalBasicConfigurationsViewModel.DefaultOrgid = Convert.ToInt32(dr["DefaultOrgId"]);
                                GlobalBasicConfigurationsViewModel.DefaultOrgname = "" + (dr["DefaultOrgName"]);// Convert.ToInt32(dr["DefaultShowRoomName"]);
                                                                                                                  //SMS
                                GlobalBasicConfigurationsViewModel.SmsQouta = Convert.ToInt32(dr["sms_qouta"]);
                                GlobalBasicConfigurationsViewModel.Sslenabled = Convert.ToByte(dr["SSLEnabled"]);

                                GlobalBasicConfigurationsViewModel.SmsServiceUser = "" + (dr["sms_service_user"]);
                                GlobalBasicConfigurationsViewModel.SmsPassword = "" + (dr["sms_password"]);
                                GlobalBasicConfigurationsViewModel.SmsServiceUrl = "" + (dr["sms_service_url"]);
                                //PROXY
                                GlobalBasicConfigurationsViewModel.ProxyServer = "" + (dr["proxy_server"]);
                                GlobalBasicConfigurationsViewModel.ProxyUserPwd = "" + (dr["proxy_user_pwd"]);
                                GlobalBasicConfigurationsViewModel.ProxyUserName = "" + (dr["proxy_user_name"]);
                                GlobalBasicConfigurationsViewModel.IsProxyEnabled = Convert.ToByte(dr["isProxyEnabled"]);
                                //Email & SMS Notification
                                GlobalBasicConfigurationsViewModel.sms_notification_enabled = Convert.ToByte(String.IsNullOrWhiteSpace("" + dr["sms_notification_enabled"]) ? 0 : dr["sms_notification_enabled"]);// Convert.ToByte(dr["sms_notification_enabled"]);
                                GlobalBasicConfigurationsViewModel.email_notification_enabled = Convert.ToByte(String.IsNullOrWhiteSpace(""+dr["email_notification_enabled"])?0: dr["email_notification_enabled"]);
                                //EMAIl
                                GlobalBasicConfigurationsViewModel.SmtpServer = "" + (dr["SmtpServer"]);
                                GlobalBasicConfigurationsViewModel.OrgAdminEmail = "" + (dr["dsp_admin_email"]);
                                GlobalBasicConfigurationsViewModel.SmtpUser = "" + (dr["SmtpUser"]);
                                GlobalBasicConfigurationsViewModel.SmtpSenderEmail = "" + (dr["dsp_admin_email"]);
                                GlobalBasicConfigurationsViewModel.SmtpUserPwd = "" + (dr["SmtpUserPwd"]);
                                GlobalBasicConfigurationsViewModel.Smtpport = Convert.ToInt32(dr["SmtpPort"]);
                                // Notification
                                GlobalBasicConfigurationsViewModel.FcmSenderId = "" + (dr["fcmSenderId"]);
                                GlobalBasicConfigurationsViewModel.FcmServerKey = "" + (dr["fcmServerKey"]);
                                //SMS Dynamic Queries                                
                                GlobalBasicConfigurationsViewModel.InsertSmshistoryQuery = "" + (dr["InsertSMSHistoryQuery"]);
                                GlobalBasicConfigurationsViewModel.UpdateSmsnotificationsQuery = "" + (dr["UpdateSMSNotificationsQuery"]);
                                GlobalBasicConfigurationsViewModel.GetSmsnotificationsQuery = "" + (dr["GetSMSNotificationsQuery"]);
                                // API
                                GlobalBasicConfigurationsViewModel.ApiAuthKey = "" + (dr["ApiAuthKey"]);
                            }//while (dr.Read())
                        }// using (DbDataReader dr = command.ExecuteReader())                        
                    }
                }
            }
        }
        public static List<GlobalLookUpViewModel> LoadGlobalLookUpCollectionViewModel()
        {

            if (LookUpsCollection.Any())
                return LookUpsCollection;
            else
            {
                List<GlobalLookUpViewModel> ls = new List<GlobalLookUpViewModel>();
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pOrgId = new MySqlParameter("p_OrgId", SqlDbType.Int);
                        pOrgId.Value = 1;
                        parameter.Add(pOrgId);                       
                        command.Parameters.AddRange(parameter.ToArray());
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.CommandText = "spGlobalLookUpData";
                        using (DbDataReader dr = command.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                GlobalLookUpViewModel lov = new GlobalLookUpViewModel();
                                lov.Id = Convert.ToInt32(dr["Id"]);
                                lov.Name = "" + (dr["Name"]);
                                lov.Code = "" + (dr["Code"]);
                                lov.Desc = "" + (dr["Desc"]);
                                lov.SortOrder = Convert.ToInt32(dr["SortOrder"]);
                                lov.LVType = Convert.ToInt32(dr["LVType"]);
                                ls.Add(lov);
                            }//while (dr.Read())
                        }// using (DbDataReader dr = command.ExecuteReader())                        
                    }
                }
                LookUpsCollection = ls;
                return ls;
            }
        }

    }
}
