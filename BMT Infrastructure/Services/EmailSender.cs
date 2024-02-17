using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;

namespace Blazor.Web.Infrastructure.Services
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class EmailSender // : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            // TODO: Wire this up to actual email sending logic via SendGrid, local SMTP, etc.
            return Task.CompletedTask;
        }
        public Task VehicleInfoSharingEmailNotificationAsync(int dspId,List<string> recipientslst,  string vehicleNameOrTitle)
        {
            if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                GlobalUTIL.loadConfigurations(dspId);
            // Store Configuration Loaded
            ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();
            try
            {
                MailAddress fromAddress = null;
                //MailAddress toAddress = null;
                // ConfigrationsCombinedViewModel.apnBundleId
                fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.VehicleSharingEmailSubject);
                //toAddress = new MailAddress(recipientslst[0], ViewModels.VehicleSharingEmailSubject);
                // const string fromPassword = "fromPassword";
                string subject = viewModel.VehicleSharingEmailSubject;
                string body = string.Format(viewModel.VehicleSharingEmailBody, vehicleNameOrTitle);
             
                var smtp = new SmtpClient
                {
                    Host = GlobalBasicConfigurationsViewModel.SmtpUser,
                    Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                };
                var message = new MailMessage();
                message.Subject = subject;
                message.From = fromAddress;
                message.Body = body;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;
                foreach (string email in recipientslst)
                {
                    message.To.Add(new MailAddress(email));
                }                
                smtp.Send(message);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        public Task SendRegistrationEmailNotificationAsync(int dspId, string recipientEmail, string desc = "")
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(dspId);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();
                if (viewModel != null)
                {
                    var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.invitationEmailSubject);
                    var toAddress = new MailAddress(recipientEmail, "4DSPS  - DSP Registration");
                    // const string fromPassword = "fromPassword";
                    string subject = string.IsNullOrWhiteSpace(viewModel.invitationEmailSubject) ? "Registration with 4DSPS " : viewModel.invitationEmailSubject;// RegisertationEmailSubject;
                    string body = string.Format(viewModel.invitationEmailBody, recipientEmail, desc);             
                    var smtp = new SmtpClient
                    {
                        Host = GlobalBasicConfigurationsViewModel.SmtpUser,// GlobalBasicConfigurationsViewModel.SmtpUser,
                        Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                    };
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        BodyEncoding = Encoding.UTF8,
                        IsBodyHtml = true

                    })
                    {
                        if (Convert.ToBoolean(GlobalBasicConfigurationsViewModel.email_notification_enabled) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.DspAdminEmail) && recipientEmail.ToLower() != GlobalBasicConfigurationsViewModel.DspAdminEmail.ToLower())
                        {
                            MailAddress toAdminAddress = new MailAddress(GlobalBasicConfigurationsViewModel.DspAdminEmail, viewModel.invitationEmailSubject);// UTIL.BlazorConstants.VIDEO_FLAG_REPORT_SUBJECT);
                            message.CC.Add(toAdminAddress);
                        }
                        smtp.Send(message);
                    }
                }// Configuration
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public Task SendVehicleUploadEmailNotificationAsync(int dspId, string recipientEmail, string emailTitle = "")
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(dspId);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();

                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.invitationEmailSubject);
                var toAddress = new MailAddress(recipientEmail, "4DSPS - Inspection Request");
                // const string fromPassword = "fromPassword";
                string subject = string.IsNullOrWhiteSpace(viewModel.invitationEmailSubject) ? "Inspection Request with 4DSPS " : viewModel.invitationEmailSubject;// RegisertationEmailSubject;
                string body = string.Format(viewModel.invitationEmailBody, (string.IsNullOrWhiteSpace(recipientEmail) ? emailTitle : recipientEmail));
                //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
                var smtp = new SmtpClient
                {
                    Host = GlobalBasicConfigurationsViewModel.SmtpUser,// GlobalBasicConfigurationsViewModel.SmtpUser,
                    Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body,
                    BodyEncoding = Encoding.UTF8,
                    IsBodyHtml = true

                })
                {
                    if (Convert.ToBoolean(GlobalBasicConfigurationsViewModel.email_notification_enabled) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.DspAdminEmail) && recipientEmail.ToLower() != GlobalBasicConfigurationsViewModel.DspAdminEmail.ToLower())
                    {
                        MailAddress toAdminAddress = new MailAddress(GlobalBasicConfigurationsViewModel.DspAdminEmail, "New Upload");// UTIL.BlazorConstants.VIDEO_FLAG_REPORT_SUBJECT);
                        message.CC.Add(toAdminAddress);
                    }
                    smtp.Send(message);
                }


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        
        public Task SendInspectionRequestEmailNotificationAsync(int dspId, string recipientEmail,string customerName, string title = "")
        {
            if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                GlobalUTIL.loadConfigurations(dspId);
            // Store Configuration Loaded
            ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();

            SmtpClient client = new SmtpClient();
            try
            {
                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.InspectionRequestEmailSubject);
                var toAddress = new MailAddress(recipientEmail, viewModel.InspectionRequestEmailSubject);
                // const string fromPassword = "fromPassword";
                string subject = viewModel.InspectionRequestEmailSubject;
                string body = string.Format(viewModel.InspectionRequestEmailBody, string.IsNullOrWhiteSpace(customerName) ? recipientEmail: customerName, title);
                //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
                var smtp = new SmtpClient
                {
                    Host = GlobalBasicConfigurationsViewModel.SmtpUser,
                    Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body,
                    BodyEncoding = Encoding.UTF8,
                    IsBodyHtml = true

                })
                {
                    if (Convert.ToBoolean(GlobalBasicConfigurationsViewModel.email_notification_enabled) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.DspAdminEmail) && recipientEmail.ToLower() != GlobalBasicConfigurationsViewModel.DspAdminEmail.ToLower())
                    {
                        MailAddress toAdminAddress = new MailAddress(GlobalBasicConfigurationsViewModel.DspAdminEmail, viewModel.InspectionRequestEmailSubject);
                        message.CC.Add(toAdminAddress);
                    }
                    smtp.Send(message);
                }


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public Task SendInspectionReportEmailNotificationAsync(int dspId, string recipientEmail, string customerName, string title = "")
        {
            if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                GlobalUTIL.loadConfigurations(dspId);
            // Store Configuration Loaded
            ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();

            SmtpClient client = new SmtpClient();
            try
            {

                if (viewModel != null)
                {
                    var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.InspectionReportEmailSubject);
                    var toAddress = new MailAddress(recipientEmail, viewModel.InspectionReportEmailSubject);
                    // const string fromPassword = "fromPassword";
                    string subject = viewModel.InspectionReportEmailSubject;
                    string body = string.Format(viewModel.InspectionReportEmailBody, recipientEmail, title);
                    //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
                    var smtp = new SmtpClient
                    {
                        Host = GlobalBasicConfigurationsViewModel.SmtpUser,
                        Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                    };
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        BodyEncoding = Encoding.UTF8,
                        IsBodyHtml = true

                    })
                    {
                        if (Convert.ToBoolean(GlobalBasicConfigurationsViewModel.email_notification_enabled) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.DspAdminEmail) && recipientEmail.ToLower() != GlobalBasicConfigurationsViewModel.DspAdminEmail.ToLower())
                        {
                            MailAddress toAdminAddress = new MailAddress(GlobalBasicConfigurationsViewModel.DspAdminEmail, viewModel.InspectionReportEmailSubject);
                            message.CC.Add(toAdminAddress);
                        }
                        smtp.Send(message);
                    }
                }// Configuration not found

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        //public Task VehiclePlaceOfferNotificationAsync(int showRoomId, string recipientEmail,  string amountWithCurrency = "", string titleOrDesc= "") {
        //    SmtpClient client = new SmtpClient();
        //    try {
        //        if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == showRoomId).FirstOrDefault() == null)
        //            GlobalUTIL.loadConfigurations(showRoomId);
        //        // Store Configuration Loaded
        //        ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == showRoomId).FirstOrDefault();
        //        var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.VehicleOfferNotificationEmailSubject);
        //        var toAddress = new MailAddress(recipientEmail, viewModel.VehicleOfferNotificationEmailSubject);
           
        //        string subject = viewModel.VehicleOfferNotificationEmailSubject;
        //        string body = string.Format(viewModel.VehicleOfferNotificationEmailBody, amountWithCurrency, titleOrDesc);
        //        //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
        //        var smtp = new SmtpClient {
        //            Host = GlobalBasicConfigurationsViewModel.SmtpUser,
        //            Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
        //            EnableSsl = true,
        //            DeliveryMethod = SmtpDeliveryMethod.Network,
        //            UseDefaultCredentials = false,
        //            Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
        //        };
        //        using (var message = new MailMessage(fromAddress, toAddress) {
        //            Subject = subject,
        //            Body = body,
        //            BodyEncoding = Encoding.UTF8,
        //            IsBodyHtml = true

        //        }) {
        //            string adminEmail = string.IsNullOrWhiteSpace(GlobalSettings.DspEmail) ? GlobalBasicConfigurationsViewModel.DspAdminEmail : GlobalSettings.DspEmail;
        //            if (!string.IsNullOrWhiteSpace(adminEmail) && recipientEmail.ToLower() != adminEmail) {
        //                MailAddress toAdminAddress = new MailAddress(adminEmail, viewModel.VehicleOfferNotificationEmailSubject);
        //                message.CC.Add(toAdminAddress);
        //            }
        //            smtp.Send(message);
        //        }


        //        return Task.CompletedTask;
        //    }
        //    catch (Exception ex) {
        //        throw ex;
        //    }

        //}

        public Task SendEmailNotificationAsync(int dspId, string recipientEmail, string accessTokenwithURI, string coreURI, string emailSolutation)
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(dspId);
                ConfigurationsViewModel ViewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();

                if (ViewModel != null)
                {

                    var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, ViewModel.invitationEmailSubject);
                    var toAddress = new MailAddress(recipientEmail, "Subscription Acknowledgement");
                    // const string fromPassword = "fromPassword";
                    string subject = ViewModel.invitationEmailSubject;
                    string body = string.Format(ViewModel.invitationEmailBody, emailSolutation, coreURI);
                    //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
                    var smtp = new SmtpClient
                    {
                        Host = GlobalBasicConfigurationsViewModel.SmtpUser,
                        Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                    };
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        BodyEncoding = Encoding.UTF8,
                        IsBodyHtml = true

                    })
                    {
                        if (Convert.ToBoolean(GlobalBasicConfigurationsViewModel.email_notification_enabled) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.DspAdminEmail) && recipientEmail.ToLower() != GlobalBasicConfigurationsViewModel.DspAdminEmail.ToLower())
                        {
                            MailAddress toAdminAddress = new MailAddress(GlobalBasicConfigurationsViewModel.DspAdminEmail, "Account Status Changed");
                            message.CC.Add(toAdminAddress);
                        }
                        smtp.Send(message);
                    }
                }//  Configuration Found
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        public Task SendResetEmailNotificationAsync(int dspId, string recipientEmail, string ResetURI, string CoreURI, string emailTitle = "")
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(dspId);
                ConfigurationsViewModel ViewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();
                if (ViewModel != null)
                {
                    var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, ViewModel == null ? "Forgot Password" : ViewModel.profilePwdResetEmailSubject);
                    var toAddress = new MailAddress(recipientEmail, ViewModel == null ? "Forgot Password" : ViewModel.profilePwdResetEmailSubject);
                    // const string fromPassword = "fromPassword";
                    string subject = ViewModel == null ? "Forgot Password" : ViewModel.profilePwdResetEmailSubject;// "Forgot Password";
                    string body = String.Format(ViewModel.profilePwdResetEmail, recipientEmail, emailTitle);
                    //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
                    var smtp = new SmtpClient
                    {
                        Host = GlobalBasicConfigurationsViewModel.SmtpServer,
                        Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                    };
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        BodyEncoding = Encoding.UTF8,
                        IsBodyHtml = true

                    })
                    {
                        ////TO, BBC, CC

                        //if (objEmails != null && objEmails.Count > 0)
                        //{
                        //    foreach (DispatchPlanRecipientsViewModel recipient in objEmails)
                        //    {
                        //        if (recipient.To)
                        //        {
                        //            message.CC.Add(recipient.EmailAddress);
                        //        }
                        //        else if (recipient.CC)
                        //        {
                        //            message.CC.Add(recipient.EmailAddress);
                        //        }
                        //        else if (recipient.BCC)
                        //        {
                        //            message.Bcc.Add(recipient.EmailAddress);
                        //        }
                        //    }
                        //}// if (objSettings.EmailAttachments != n
                        //// Attachments

                        //if (objSettings.EmailAttachments != null)
                        //{
                        //    foreach (Attachment atch in objSettings.EmailAttachments)
                        //    {
                        //        message.Attachments.Add(atch);
                        //    }
                        //}// if (objSettings.EmailAttachments != null)
                        smtp.Send(message);
                    }
                }// Configuration

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }
        }
        public Task SendForgotMobileNotificationAsync(int dspId, string recipientEmail, string Token, string emailsubject = "")
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(dspId);
                ConfigurationsViewModel ViewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();

                if (ViewModel != null)
                {
                    var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, ViewModel.profilePwdResetEmailSubject);
                    var toAddress = new MailAddress(recipientEmail, ViewModel.profilePwdResetEmailSubject);
                    // const string fromPassword = "fromPassword";
                    string subject = ViewModel.profilePwdResetEmailSubject;
                    string body = string.Format(ViewModel.profilePwdResetEmail, string.IsNullOrWhiteSpace(emailsubject) ? recipientEmail : emailsubject, Token);
                    //  List<DispatchPlanRecipientsViewModel> objEmails = GetBusinessAgentEmailsList(SupplierId);
                    var smtp = new SmtpClient
                    {
                        Host = GlobalBasicConfigurationsViewModel.SmtpUser,
                        Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                    };
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        BodyEncoding = Encoding.UTF8,
                        IsBodyHtml = true

                    })
                    {
                        ////TO, BBC, CC

                        //if (objEmails != null && objEmails.Count > 0)
                        //{
                        //    foreach (DispatchPlanRecipientsViewModel recipient in objEmails)
                        //    {
                        //        if (recipient.To)
                        //        {
                        //            message.CC.Add(recipient.EmailAddress);
                        //        }
                        //        else if (recipient.CC)
                        //        {
                        //            message.CC.Add(recipient.EmailAddress);
                        //        }
                        //        else if (recipient.BCC)
                        //        {
                        //            message.Bcc.Add(recipient.EmailAddress);
                        //        }
                        //    }
                        //}// if (objSettings.EmailAttachments != n
                        //// Attachments

                        //if (objSettings.EmailAttachments != null)
                        //{
                        //    foreach (Attachment atch in objSettings.EmailAttachments)
                        //    {
                        //        message.Attachments.Add(atch);
                        //    }
                        //}// if (objSettings.EmailAttachments != null)
                        smtp.Send(message);
                    }

                }// Configuration
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }
        }
      
        public Task SubscriptionStatusChangeEmailNotificationAsync(int dspId, string recipientEmail, int Status, string remarks, string enailTiltle = "")
        {
            // SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(dspId);
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.DspId == dspId).FirstOrDefault();
                if (viewModel != null)
                {
                    var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, "Account Status Changed");
                    var toAddress = new MailAddress(recipientEmail, "Account Status Changed");
                    // const string fromPassword = "fromPassword";
                    string subject = "Account Status Changed";
                    string body = string.Format(viewModel.AccountStatusChangedEmailBody, string.IsNullOrWhiteSpace(enailTiltle) ? recipientEmail : enailTiltle, remarks);
                    if (Status == (int)UTIL.STATUS_USERS.INACTIVE || Status == (int)UTIL.STATUS_USERS.BLOCKED)
                    {
                        body = string.Format(viewModel.AccountStatusChangedEmailBody, string.IsNullOrWhiteSpace(enailTiltle) ? recipientEmail : enailTiltle, remarks);
                    }
                    else if (Status == (int)UTIL.STATUS_USERS.DELETED)
                    {
                        body = string.Format(viewModel.AccountDeletedEmailBody, string.IsNullOrWhiteSpace(enailTiltle) ? recipientEmail : enailTiltle, remarks);
                    }
                    var smtp = new SmtpClient
                    {
                        Host = GlobalBasicConfigurationsViewModel.SmtpUser,
                        Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
                    };
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        BodyEncoding = Encoding.UTF8,
                        IsBodyHtml = true

                    })
                    {
                        // Additional for admin
                        if (Convert.ToBoolean(GlobalBasicConfigurationsViewModel.email_notification_enabled) && !string.IsNullOrWhiteSpace(GlobalBasicConfigurationsViewModel.DspAdminEmail) && recipientEmail.ToLower() != GlobalBasicConfigurationsViewModel.DspAdminEmail.ToLower())
                        {
                            MailAddress toAdminAddress = new MailAddress(GlobalBasicConfigurationsViewModel.DspAdminEmail, "Account Status Changed");
                            message.CC.Add(toAdminAddress);
                        }
                        //if (!string.IsNullOrWhiteSpace(UTIL.PackageUtil.adminEmailAddress) && recipientEmail.ToLower() != UTIL.PackageUtil.adminEmailAddress.ToLower() && (Status == (int)UTIL.STATUS_USERS.INACTIVE || Status == (int)UTIL.STATUS_USERS.ACCESS_BLOCKED))
                        //{
                        //    MailAddress toAdminAddress = new MailAddress(BasicConfigurationsViewModel.cdp_admin_email, ViewModels.PostFlagEmailSubject);
                        //    message.CC.Add(toAdminAddress);
                        //}

                        smtp.Send(message);
                    }
                }// Configuration

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        //public Task VehicleStatusChangeEmailNotificationAsync(int DspId,string[] recipientslst, int status, string vehicleNameOrTitle)
        //{
        //    // SmtpClient client = new SmtpClient();
        //    try
        //    {
        //        if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.DspId == DspId).FirstOrDefault() == null)
        //            GlobalUTIL.loadConfigurations(DspId);
        //        ConfigurationsViewModel ViewModels = GlobalSettings.Configurations.Where(x => x.DspId == DspId).FirstOrDefault();
        //        MailAddress fromAddress = null;
        //        //MailAddress toAddress = null; 
        //        // ConfigrationsCombinedViewModel.apnBundleId
        //         fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, ViewModels.VehicleStatusActivationNotificationEmailSubject);               
        //        // const string fromPassword = "fromPassword";
        //        string subject = ViewModels.VehicleStatusActivationNotificationEmailSubject;
        //        string body = string.Format(ViewModels.VehicleStatusActivationNotificationEmailBody, vehicleNameOrTitle);
        //        switch (status) { 
        //        //case (int)UTIL.VEHICLE_STATUS.GROUNDED:
        //        //        subject = string.IsNullOrEmpty(ViewModels.PostFlagEmailSubject)?"Vehicle Reported / Flagged": ViewModels.PostFlagEmailSubject;
        //        //        body = string.Format(ViewModels.PostFlagEmailBody, recipientslst.FirstOrDefault(), vehicleNameOrTitle);
        //        //        break;
        //            case (int)UTIL.VEHICLE_STATUS.GROUNDED:
        //                subject = string.IsNullOrEmpty(ViewModels.VehicleStatusDeleteNotificationEmailSubject) ? "Vehicle Grounded" : ViewModels.VehicleStatusDeleteNotificationEmailSubject;
        //                body = string.Format(ViewModels.VehicleStatusDeleteNotificationEmailBody,  vehicleNameOrTitle);
        //                break;
        //            case (int)UTIL.VEHICLE_STATUS.MAINTENANCE:
        //                subject = string.IsNullOrEmpty(ViewModels.VehicleStatusSoldNotificationEmailSubject) ? "Vehicle Under Maintenance" : ViewModels.VehicleStatusSoldNotificationEmailSubject;
        //                body = string.Format(ViewModels.VehicleStatusSoldNotificationEmailBody,  vehicleNameOrTitle);
        //                break;
        //            case (int)UTIL.VEHICLE_STATUS.OPERATIONAL:
        //                subject = string.IsNullOrEmpty(ViewModels.VehicleStatusBlockNotificationEmailSubject) ? "Vehicle Operational" : ViewModels.VehicleStatusBlockNotificationEmailSubject;
        //                body = string.Format(ViewModels.VehicleStatusBlockNotificationEmailBody,  vehicleNameOrTitle);
        //                break;
        //            //case (int)UTIL.VEHICLE_STATUS.GROUNDED:
        //            //    subject = string.IsNullOrEmpty(ViewModels.VehicleStatusInActiveNotificationEmailSubject) ? "Vehicle Removed from portal" : ViewModels.VehicleStatusInActiveNotificationEmailSubject;
        //            //    body = string.Format(ViewModels.VehicleStatusInActiveNotificationEmailBody, vehicleNameOrTitle);
        //            //    break;
        //        }
        //        //if (status != (int)UTIL.COMMON_STATUS.ACTIVE)
        //        //{
        //        //    fromAddress = new MailAddress(BasicConfigurationsViewModel.smtp_user, ViewModels.VehicleStatusBlockNotificationEmailSubject);
        //        //   // toAddress = new MailAddress(recipientslst[0], ViewModels.VehicleStatusBlockNotificationEmailSubject);
        //        //    body = string.Format(ViewModels.VehicleStatusBlockNotificationEmailBody, vehicleNameOrTitle);
        //        //}

        //        var smtp = new SmtpClient
        //        {
        //            Host = GlobalBasicConfigurationsViewModel.SmtpUser,
        //            Port = Convert.ToInt32(GlobalBasicConfigurationsViewModel.Smtpport),
        //            EnableSsl = true,
        //            DeliveryMethod = SmtpDeliveryMethod.Network,
        //            UseDefaultCredentials = false,
        //            Credentials = new NetworkCredential(GlobalBasicConfigurationsViewModel.SmtpUser, GlobalBasicConfigurationsViewModel.SmtpUserPwd)
        //        };
        //        var message = new MailMessage();
        //        message.Subject = subject;
        //        message.From = fromAddress;
        //        message.Body = body;
        //        message.BodyEncoding = Encoding.UTF8;
        //        message.IsBodyHtml = true;
        //        foreach (string email in recipientslst)
        //        {
        //            message.To.Add(new MailAddress(email));
        //        }
        //        smtp.Send(message);


        //        return Task.CompletedTask;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //        //  return null;

        //    }

        //}

        public Task GenerateTestSMTPSettings(BasicConfigurationViewModel bcvm)
        {
            // SmtpClient client = new SmtpClient();
            try
            {
                
                MailAddress fromAddress = null;
                MailAddress toAddress = null;
                //MailAddress toAddress = null; 
                // ConfigrationsCombinedViewModel.apnBundleId
                fromAddress = new MailAddress(bcvm.SmtpSenderEmail, "Test Email");
                toAddress = new MailAddress("zahid.nawaz@4dsps.com", "Test Email");
                // const string fromPassword = "fromPassword";
                string subject = "Test Run of Email";
                string body = "Its just by Blazor Team";  

                var smtp = new SmtpClient
                {
                    Host = bcvm.SmtpServer,
                    Port = Convert.ToInt32(bcvm.Smtpport),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(bcvm.SmtpUser, bcvm.SmtpUserPwd)
                };
                var message = new MailMessage();
                message.Subject = subject;
                message.From = fromAddress;
                message.To.Add(toAddress);
                message.Body = body;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;
              
                smtp.Send(message);


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
    }
}
