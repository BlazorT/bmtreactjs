﻿using System;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using Org.BouncyCastle.Ocsp;
using System.Linq;

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
        public Task SendEmailNotificationAsync(string recipientEmail, string accessTokenwithURI, string uri)
        {           
            //SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(1);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault();
                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, "BMT");
                var toAddress = new MailAddress(recipientEmail, "BMT");
                // const string fromPassword = "fromPassword";
               string subject = "BMT";
                string body = string.Format(viewModel.invitationEmailBody, accessTokenwithURI, uri);
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
                    BodyEncoding=  Encoding.UTF8,
                IsBodyHtml = true

                })
                {                   
                    smtp.Send(message);
                }


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
              //  return null;
               
            }
          
        }
        public Task SendMerchantEmailNotificationAsync(string recipientEmail, string accessTokenwithURI, string uri)
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(1);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault();

                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, "BMT");
                var toAddress = new MailAddress(recipientEmail, "BMT");
                // const string fromPassword = "fromPassword";
                string subject = "BMT";
                string body = string.Format(viewModel.invitationEmailBody, accessTokenwithURI, uri);
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


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        public Task SendResendMerchantEmailNotificationAsync(string recipientEmail, string emailBody, string subjectTitle)
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(1);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault();
                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.invitationEmailSubject);
                var toAddress = new MailAddress(recipientEmail, viewModel.invitationEmailSubject);
                // const string fromPassword = "fromPassword";
                string subject = viewModel.invitationEmailSubject;
                string body = emailBody;
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
                   
                    smtp.Send(message);
                }


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        public Task SendResetEmailNotificationAsync(string recipientEmail, string ResetURI, string coreUri)
        {
            SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(1);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault();

                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, viewModel.invitationEmailSubject);
                var toAddress = new MailAddress(recipientEmail, viewModel.invitationEmailSubject);
                // const string fromPassword = "fromPassword";
                string subject = "BMT - FORGOT PASSWORD ";
                string body = string.Format(viewModel.profilePwdResetEmail, recipientEmail, ResetURI, coreUri); 
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


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        public Task SendAccountStatusChangeEmailNotificationAsync(string recipientEmail, string remarks)
        {
           // SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(1);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault();
                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, "BMT");
                var toAddress = new MailAddress(recipientEmail, "BMT");
                // const string fromPassword = "fromPassword";
                string subject = "BMT- Account Status Change Notification";
                string body = string.Format(viewModel.accountBlockEmailBody, recipientEmail, remarks);               
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
                    
                    smtp.Send(message);
                }


                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw ex;
                //  return null;

            }

        }
        public Task MerchantVideoStatusChangeEmailNotificationAsync(string recipientEmail,int status, string remarks)
        {
            // SmtpClient client = new SmtpClient();
            try
            {
                if (GlobalSettings.Configurations == null || GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault() == null)
                    GlobalUTIL.loadConfigurations(1);
                // Store Configuration Loaded
                ConfigurationsViewModel viewModel = GlobalSettings.Configurations.Where(x => x.OrgId == GlobalSettings.DefaultOrgId).FirstOrDefault();
                var fromAddress = new MailAddress(GlobalBasicConfigurationsViewModel.SmtpSenderEmail, "BMT");
                var toAddress = new MailAddress(recipientEmail, "BMT");
                // const string fromPassword = "fromPassword";
                string subject = "BMT- Compaign Status Change Notification";
                string body= string.Format(viewModel.OrganizationApprovedEmailBody, recipientEmail, remarks);
                if (status== (int)COMPAIGNS_STATUS.DROPPED)
                 body = string.Format(viewModel.OrganizationRejectedEmailBody, recipientEmail, remarks);
               
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

                    smtp.Send(message);
                }


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
