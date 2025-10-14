using Blazor.Web.UI.Interfaces;
using AutoMapper;
using System.Data.Common;
using System.Data;
using System.Text.Json;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;
using Blazor.Web.ViewModels;
using com.blazor.bmt.core;
using com.blazor.bmt.application.model;

namespace Blazor.Web.UI.Services
{
    public class BlazorRepoPageService : IBlazorRepoPageService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<BlazorRepoPageService> _logger;        
        public BlazorRepoPageService(IMapper mapper, ILogger<BlazorRepoPageService> logger)
        {           
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));          
        }
        public async Task<IEnumerable<ReportViewModel>> GetOrgRegistrationReportData(ReportViewModel resportViewmodel)
        {
            IEnumerable<ReportViewModel> reportViewModel = new List<ReportViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pOrgId = new MySqlParameter("p_OrgId", MySqlDbType.Int32);
                        pOrgId.Value = 0;
                        parameter.Add(pOrgId);
                        MySqlParameter DateFrom = new MySqlParameter("p_DateFrom", MySqlDbType.DateTime);
                    DateFrom.Value = resportViewmodel.CreatedAt;
                    parameter.Add(DateFrom);
                        MySqlParameter DateTo = new MySqlParameter("p_DateTo", MySqlDbType.DateTime);
                    DateTo.Value = resportViewmodel.LastUpdatedAt;
                    parameter.Add(DateTo);                   
                        command.CommandText = "spOrgRegistrationReportData";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());
                       
                        using (DbDataReader reader = command.ExecuteReader())
                        {

                            DataTable dt = new DataTable();
                            dt.Load(reader);
                            var stats = from sts in dt.AsEnumerable()                                       
                                        select new ReportViewModel
                                            {
                                               OrgName = sts["OrgName"].ToString(),
                                               StatusStr = sts["OrgStatus"].ToString(),
                                            Status = Convert.ToInt16(sts["Status"]),
                                            RegistrationTime = Convert.ToDateTime(sts["CreatedAt"]),
                                                budget = Math.Round(Convert.ToDouble(sts["budget"]),2),
                                                ExpiryTime = Convert.ToDateTime(""+sts["ExpiryTime"]),
                                            };
                            
                            if (stats != null)
                                reportViewModel = _mapper.Map<IEnumerable<ReportViewModel>>(stats);
                        }
                    }
                }                
            }
            catch (Exception ex) {
                _logger.LogError(ex.StackTrace);
                throw ex;                
            }
            return reportViewModel.OrderBy(x=>x.OrgId).AsQueryable();
           
        }

        public async Task<IEnumerable<AuditLogViewModel>> GetAuditLogDetailsData(AuditLogViewModel viewModel) {
            List<AuditLogViewModel> vList = new List<AuditLogViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();

                        MySqlParameter pOrganizationId = new MySqlParameter("p_OrgId", MySqlDbType.Int32);
                        pOrganizationId.Value = viewModel.OrgId;
                        parameter.Add(pOrganizationId);
                        MySqlParameter pEntityid = new MySqlParameter("p_entityid", MySqlDbType.Int32);
                        pEntityid.Value = viewModel.AuditEntityId == null ? 0 : viewModel.AuditEntityId;
                        parameter.Add(pEntityid);
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar);
                        pKeyword.Value = ""+viewModel.KeyValue;
                        parameter.Add(pKeyword);
                        MySqlParameter DateFrom = new MySqlParameter("p_DateFrom", MySqlDbType.DateTime);
                        DateFrom.Value = viewModel.CreatedAt;
                        parameter.Add(DateFrom);
                        MySqlParameter pDateT0 = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateT0.Value = GlobalUTIL.CurrentDateTime;
                        parameter.Add(pDateT0);
                        command.CommandText = "spGetAuditLogData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                vList.Add(new AuditLogViewModel
                                {
                                    Id = Convert.ToInt64(dr["Id"]),
                                    AuditEntityId = Convert.ToInt32(dr["AuditEntityId"]),
                                    KeyValue = ""+dr["KeyValue"],
                                    OldValue =""+ dr["OldValue"],
                                    NewValue = "" + dr["NewValue"],
                                    Username = "" + dr["LastName"] + " " + dr["MiddleName"],
                                    entityName = "" + dr["EntityName"],
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    AttributeName = "" + dr["AttributeName"]
                                });

                            }
                        }


                    }
                }



            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return vList.AsQueryable();
        }
        public async Task<IEnumerable<ReportCompaignsViewModel>> GetOrgCompaignsReportData(ReportCompaignsViewModel resportViewmodel)
        {
            IEnumerable<ReportCompaignsViewModel> reportViewModel = new List<ReportCompaignsViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();

                        MySqlParameter pOrganizationId = new MySqlParameter("p_OrgId", MySqlDbType.Int32);
                        pOrganizationId.Value = resportViewmodel.OrganizationId;
                        parameter.Add(pOrganizationId);
                        MySqlParameter pStatusId = new MySqlParameter("p_Status", MySqlDbType.Int32);
                        pStatusId.Value = resportViewmodel.Status==null?0: resportViewmodel.Status;
                        parameter.Add(pStatusId);
                        MySqlParameter DateFrom = new MySqlParameter("p_DateFrom", MySqlDbType.DateTime);
                        DateFrom.Value = resportViewmodel.CreatedAt;
                        parameter.Add(DateFrom);
                        MySqlParameter DateTo = new MySqlParameter("p_DateTo", MySqlDbType.DateTime);
                        DateTo.Value = resportViewmodel.LastUpdatedAt;
                        parameter.Add(DateTo);
                        command.CommandText = "spCompaignsReportData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            DataTable dt = new DataTable();
                            dt.Load(reader);
                            var stats = from sts in dt.AsEnumerable()
                                        select new ReportCompaignsViewModel
                                        {
                                            OrganizationName = sts["OrgName"].ToString(),
                                            StatusStr = sts["OrgStatus"].ToString(),
                                            CreatedAt = Convert.ToDateTime(sts["CreatedAt"]),
                                            TotalCompaigns = Convert.ToInt32(sts["TotalCompaigns"]),
                                            CompletedCompaigns = Convert.ToInt32(sts["CompletedCompaigns"]),
                                            InprogressCompaigns = Convert.ToInt32(sts["InprogressCompaigns"]),                                       
                                            Budget = Math.Round(Convert.ToDouble(sts["budget"]), 2),
                                            ExpiryTime = Convert.ToDateTime("" + sts["ExpireTime"]),
                                        };

                            if (stats != null)
                                reportViewModel = _mapper.Map<IEnumerable<ReportCompaignsViewModel>>(stats);
                        }


                    }
                }



            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return reportViewModel.OrderByDescending(x => x.ExpiryTime).AsQueryable();

        }
        public async Task<IEnumerable<ReportStatsViewModel>> GetStatsReportData(ReportStatsViewModel stats)
        {
            List<ReportStatsViewModel> dList = new List<ReportStatsViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter SubscriberStatus = new MySqlParameter("p_OrgId", MySqlDbType.Int32);
                        SubscriberStatus.Value = stats.OrgId;
                        parameter.Add(SubscriberStatus);
                        MySqlParameter DateFrom = new MySqlParameter("p_DateFrom", MySqlDbType.DateTime);
                        DateFrom.Value = stats.CreatedAt;
                        parameter.Add(DateFrom);

                        MySqlParameter DateTo = new MySqlParameter("p_DateTo", MySqlDbType.DateTime);
                        DateTo.Value = stats.LastUpdatedAt;
                        parameter.Add(DateTo);
                        command.CommandText = "spStatsReportData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                dList.Add(new ReportStatsViewModel
                                {

                                    MonthName = dr["MName"].ToString(),
                                    TotalCompaigns = Convert.ToInt32(dr["TotalCompaigns"]),
                                    CompletedCompaigns = Convert.ToInt32(dr["CompletedCompaigns"]),
                                    InprogressCompaigns = Convert.ToInt32(dr["InprogressCompaigns"]),
                                    budget = Math.Round(Convert.ToDouble(dr["budget"]), 2),
                                    MonthNo = Convert.ToInt32(dr["MNo"])

                                });
                            }


                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return dList.OrderByDescending(x => x.CreatedAt).AsQueryable();

        }
        public async Task<BlazorResponseViewModel> postCompaignContactData(List<CompaignrecipientModel> lst)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            List<CompaignrecipientModel> ls = new List<CompaignrecipientModel>();
            try
            {
                string StoreCompaignContactModelJSON = string.Empty;

                // Networks
                if (lst != null && lst.Any())
                {
                    //List<CompaignNetworkViewModel> ls = lst.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                    StoreCompaignContactModelJSON = JsonSerializer.Serialize<List<CompaignrecipientModel>>(lst, options);
                }

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pCompaignContentsJSON = new MySqlParameter("p_json", MySqlDbType.JSON);
                        pCompaignContentsJSON.Value = StoreCompaignContactModelJSON;
                        parameter.Add(pCompaignContentsJSON);

                        command.CommandText = "SpMaintainCompaignContacts";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());
                        //var result = await command.ExecuteReaderAsync();

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                CompaignrecipientModel contact = new CompaignrecipientModel();
                                contact.NetworkId = Convert.ToInt32(dr["NetworkId"]);
                                contact.ContentId = "" + dr["ContentId"];
                                //contact.NetworkName = "" + dr["Name"];
                                ls.Add(contact);
                            }//while (dr.Read())
                        }// using (DbDataReader dr = command.ExecuteReader())
                        response.data = ls;
                        response.status = true;
                        response.message = string.Format("Data process is completed, new contacts {0} are saved successfully", ls.Count.ToString());
                    }
                }
            }// Try
            catch (Exception ex)
            {
                response.status = false;
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return response;

        }
        public async Task<IEnumerable<CampaignNotificationViewModel>> GetCampaignNotificationData(CampaignNotificationViewModel cModel)
        {
            List<CampaignNotificationViewModel> dList = new List<CampaignNotificationViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        command.Parameters.Add(new MySqlParameter("@p_OrgId", MySqlDbType.Int32) { Value = cModel.OrgId });
						command.Parameters.Add(new MySqlParameter("@p_CampaignId", MySqlDbType.Int64) { Value = cModel.Id });
						command.Parameters.Add(new MySqlParameter("@p_DeliveryStatus", MySqlDbType.Int32) { Value = cModel.DeliveryStatus });
                        command.Parameters.Add(new MySqlParameter("@p_DateFrom", MySqlDbType.DateTime) { Value = cModel.CreatedAt });
                        command.Parameters.Add(new MySqlParameter("@p_DateTo", MySqlDbType.DateTime) { Value = cModel.LastUpdatedAt });
                        command.Parameters.Add(new MySqlParameter("@p_Recipient", MySqlDbType.VarChar) { Value = cModel.recipient ?? string.Empty });

                        command.CommandText = @"
SELECT 
    c.Id,
    c.Name,
    c.Description,
    c.Title,
    IFNULL(n.readCount, 0) AS readCount,
    IFNULL(n.commentsCount, 0) AS commentsCount,
    IFNULL(n.clicksCount, 0) AS clicksCount,
    IFNULL(n.sharesCount, 0) AS sharesCount,
    IFNULL(n.likesCount, 0) AS likesCount,
    c.Remarks,
    c.HashTags,
    c.TotalBudget,
    c.CreatedAt,
    c.FinishTime,
    c.StartTime,
    c.Status,
    n.id AS notificationid,
    n.deliveryStatus,
    nt.Name AS networkname
FROM compaigns c
INNER JOIN notification n ON c.id = n.comaignId
LEFT OUTER JOIN networks nt ON nt.id = n.NetworkId
WHERE c.OrgId = @p_OrgId
AND (c.Id = @p_CampaignId OR ifnull(@p_CampaignId,0)=0)
  AND (n.deliveryStatus = @p_DeliveryStatus OR ifnull(@p_DeliveryStatus,0)=0)
  AND c.CreatedAt >= @p_DateFrom
  AND c.CreatedAt <= @p_DateTo
 AND n.Recipient LIKE CONCAT('%', @p_Recipient, '%')

";


                        command.CommandType = CommandType.Text;

                        
                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (await dr.ReadAsync())
                            {
                                dList.Add(new CampaignNotificationViewModel
                                {
                                    Id = Convert.ToInt64(dr["Id"]),
                                    Name = dr["Name"]?.ToString(),
                                    Description = dr["Description"]?.ToString(),
                                    Title = dr["Title"]?.ToString(),
                                    Remarks = dr["Remarks"]?.ToString(),
                                    HashTags = dr["HashTags"]?.ToString(),
                                    TotalBudget = Convert.ToDouble(dr["TotalBudget"]),
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    StartTime = Convert.ToDateTime(dr["StartTime"]),
                                    FinishTime = Convert.ToDateTime(dr["FinishTime"]),

                                    Status = Convert.ToInt32(dr["Status"]),
                                    readCount = Convert.ToInt32(dr["readCount"]),
                                    commentsCount = Convert.ToInt32(dr["commentsCount"]),
                                    clicksCount = Convert.ToInt32(dr["clicksCount"]),
                                    sharesCount = Convert.ToInt32(dr["sharesCount"]),
                                    likesCount = Convert.ToInt32(dr["likesCount"]),
                                    NotificationId = Convert.ToInt64(dr["notificationid"]),
                                    DeliveryStatus = dr["deliveryStatus"]?.ToString(),
                                    NetworkName = dr["networkname"]?.ToString()
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw;
            }

            return dList.OrderByDescending(x => x.CreatedAt).ToList();
        }

        public async Task<IEnumerable<CampaignRecipientsViewModel>> GetCampaignRecipientsData(CampaignRecipientsViewModel cModel) {
            List<CampaignRecipientsViewModel> dList = new List<CampaignRecipientsViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();

                        MySqlParameter pOrgId = new MySqlParameter("@p_OrgId", MySqlDbType.Int32);
                        pOrgId.Value = cModel.OrgId;
                        parameter.Add(pOrgId);

                        MySqlParameter pNetworkId = new MySqlParameter("@p_NetworkId", MySqlDbType.Int32);
                        pNetworkId.Value = cModel.NetworkId;
                        parameter.Add(pNetworkId); // ✅ Fix: Add this line

                        MySqlParameter pContentId = new MySqlParameter("@p_ContentId", MySqlDbType.VarChar,200);
                        pContentId.Value = cModel.ContentId;
                        parameter.Add(pContentId);

                        // Optional — this parameter is declared but not used in the query:
                        MySqlParameter DateFrom = new MySqlParameter("@p_DateFrom", MySqlDbType.DateTime);
                        DateFrom.Value = cModel.CreatedAt;
                        parameter.Add(DateFrom);
                        // ❌ You can ignore adding this unless the query uses it.

                        command.CommandText = @"
  SELECT 
    `Id`, `networkId`, `ContentId`, `SourceId`, `Desc`, `OrgId`, 
    `CreatedBy`, `CreatedAt`, `LastUpdatedBy`, `LastUpdatedAt`, `RowVer`, `Status` 
  FROM `compaignrecipients` 
  WHERE orgid = @p_OrgId AND (NetworkId = @p_NetworkId OR ifnull(@p_NetworkId,0) =0) AND CreatedAt >= @p_DateFrom AND (ContentId like CONCAT('%', @p_ContentId, '%')  OR length(@p_ContentId) <=0)  AND Status = 1;
";
                        command.CommandType = System.Data.CommandType.Text;
                        command.Parameters.AddRange(parameter.ToArray());


                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                dList.Add(new CampaignRecipientsViewModel
                                {
                                    Id = Convert.ToInt64(dr["id"]),
                                    NetworkId = Convert.ToInt32(dr["networkId"]),
                                    SourceId = Convert.ToInt32(dr["SourceId"]),
                                    ContentId = ""+ dr["ContentId"]  ,                                 
                                    Status = Convert.ToInt32(dr["Status"]),
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"])
                                });
                            }


                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return dList.OrderByDescending(x => x.CreatedAt).AsQueryable();
        }
        public async Task<LoginViewModel> GetUserVerificationData(UserViewModel model)
        {
            LoginViewModel login = new LoginViewModel();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    List<LoginViewModel> dList = new List<LoginViewModel>();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> paras = new List<MySqlParameter>();
                        
                        MySqlParameter email = new MySqlParameter("p_email", MySqlDbType.VarChar);
                        email.Value = "" + model.Email;
                        paras.Add(email);
                        MySqlParameter cred = new MySqlParameter("p_password", model.Password);
                        paras.Add(cred);
                        MySqlParameter pRoleId = new MySqlParameter("p_RoleId", MySqlDbType.Int32);
                        pRoleId.Value = model.RoleId;
                        paras.Add(pRoleId);
                        MySqlParameter pRegistrationSource = new MySqlParameter("p_RegistrationSource", MySqlDbType.Int32);
                        pRegistrationSource.Value = model.RegistrationSource;
                        paras.Add(pRegistrationSource);
                        command.CommandText = "spPerformUserValidaton";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(paras.ToArray());                    
                        using (DbDataReader dr = command.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                dList.Add(new LoginViewModel
                                {

                                    Id = Convert.ToInt32(dr["ID"]),
                                    OrgId = Convert.ToInt32(dr["OrgId"] == null ? GlobalBasicConfigurationsViewModel.DefaultOrgid : dr["OrgId"]),
                                    FullName = "" + dr["FullName"],
                                    Email = "" + dr["Email"],
                                    Avatar = "" + dr["Avatar"],                                    
                                    LoginTime = Convert.ToDateTime(dr["LoginTime"]),
                                    UserStatus = Convert.ToInt32(dr["UserStatus"]),
                                    AlreadyLoginStatus = Convert.ToInt32(dr["AlreadyLoginStatus"]),
                                    LoginMachineIp = "" + dr["MachineIP"],
                                    UserRole = "" + dr["UserRole"],
                                    RoleId = Convert.ToInt32(dr["RoleID"])
                                });
                            }

                            //DataTable dt = new DataTable();
                            
                            
                            
                            //dt.Load(reader);

                            //var stats = from usr in dt.AsEnumerable()
                            //            select new LoginViewModel
                            //            {
                            //                Id = Convert.ToInt32(usr["ID"]),
                            //                OrgId = Convert.ToInt32(usr["OrgId"]==null?GlobalBasicConfigurationsViewModel.DefaultOrgid: usr["OrgId"]),
                            //                FullName = "" + usr["FullName"],
                            //                Email = "" + usr["Email"],
                            //                LoginTime = Convert.ToDateTime(usr["LoginTime"]),
                            //                UserStatus = Convert.ToInt32(usr["UserStatus"]),
                            //                AlreadyLoginStatus = Convert.ToInt32(usr["AlreadyLoginStatus"]),
                            //                LoginMachineIp = "" + usr["MachineIP"],
                            //                UserRole = "" + usr["UserRole"],                                            
                            //                RoleId = Convert.ToInt32(usr["RoleID"])
                            //            };

                            login= dList.FirstOrDefault();


                        }


                    }
                }



            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return login;

        }
        //@keyword varchar(100), @PlanUserId int=0,@SchoolId int=0, @RoleId int=0,  @DateFrom Date , @DateTo Date
        //public async Task<IEnumerable<UsersViewModel>> GetBMTUsersListAsync(int UserId,int orgId, int roleId, string name, int status, DateTime dtFrom, DateTime dtTo) {
        //    List<UsersViewModel> uvm = new List<UsersViewModel>();
        //    try
        //    {
        //        using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
        //        {
        //            connection.Open();
        //            using (var command = connection.CreateCommand())
        //            {
        //                //************************  PARAMETERS*******************************//
        //                List<SqlParameter> parameter = new List<SqlParameter>();
        //                SqlParameter pkeyword = new MySqlParameter("p_keyword", "" + name);
        //                parameter.Add(pkeyword);                  
        //                SqlParameter pStatus = new MySqlParameter("p_status", SqlDbType.Int);
        //                pStatus.Value = status;
        //                parameter.Add(pStatus);
        //                SqlParameter pOrgId = new MySqlParameter("p_OrgId", SqlDbType.Int);
        //                pOrgId.Value = orgId;
        //                parameter.Add(pOrgId);
        //                SqlParameter pRoleid = new MySqlParameter("p_RoleId", SqlDbType.Int);
        //                pRoleid.Value = roleId;
        //                parameter.Add(pRoleid);

        //                SqlParameter pUserId = new MySqlParameter("p_UserId", SqlDbType.Int);
        //                pUserId.Value = UserId;
        //                parameter.Add(pUserId);

        //                //(@keyword varchar(100), @MerchantId int= 0, @SchoolId int= 0, @CategoryId int= 0, @DateFrom Date , @DateTo Date)
        //                SqlParameter pDateFrom = new MySqlParameter("p_DateFrom", System.Data.SqlDbType.DateTime);
        //                pDateFrom.Value = dtFrom.Year <= 1900?new DateTime(UTIL.GlobalApp.CurrentDateTime.Year,1,1): dtFrom;
        //                parameter.Add(pDateFrom);
        //                SqlParameter pDateTo = new MySqlParameter("p_DateTo", System.Data.SqlDbType.DateTime);
        //                pDateTo.Value = dtTo.Year <= 1900 ? UTIL.GlobalApp.CurrentDateTime : dtTo;
        //                parameter.Add(pDateTo);
        //                command.Parameters.AddRange(parameter.ToArray());
        //                command.CommandText = "spGetBMTUsersList";
        //                command.CommandType = System.Data.CommandType.StoredProcedure;
        //                using (DbDataReader reader = command.ExecuteReader())
        //                {
        //                    while (reader.Read())
        //                    {
        //                        UsersViewModel uvmi = new UsersViewModel();                              
        //                        uvmi.id = Convert.ToInt32(reader["Id"]);
        //                        //uvmi.SchoolId = Convert.ToInt32(reader["SchoolId"]);
        //                        uvmi.UserCode = "" + reader["Id"];
        //                        uvmi.CompleteName = "" + reader["CompleteName"];
        //                       // uvmi.SchoolName = "" + reader["SchoolName"];
        //                        uvmi.RoleName = "" + reader["RoleName"];
        //                        uvmi.FirstName = "" + reader["FirstName"];
        //                        uvmi.LastName = "" + reader["LastName"];
        //                        uvmi.MiddleName = "" + reader["MiddleName"];
        //                        uvmi.Password = "" + reader["Password"];
        //                        uvmi.RoleId = Convert.ToInt32(reader["RoleID"]);
        //                        uvmi.Email = "" + reader["Email"];
        //                        //uvmi.RoleId = (int)UTIL.USERROLES.MERCHANT;
        //                        uvmi.Gpslocation = "";
        //                        uvmi.Title = "" + reader["Title"];
        //                        uvmi.Ims = "";
        //                        uvmi.GenderId = Convert.ToInt32(reader["GenderID"]);
        //                        uvmi.Status = Convert.ToInt32(reader["Status"]);                            
        //                        //uvmi.CreditCardExpiryDate = Convert.ToDateTime(reader["CreditCardExpiryDate"]);
        //                        uvmi.RegistrationTime = Convert.ToDateTime(reader["CreatedAt"]);                              
        //                       // uvmi.DOB = Convert.ToDateTime(reader["DOB"]);                             
        //                       // uvmi.GPA = Convert.ToDouble(reader["GPA"]);
        //                       // uvmi.Grade = Convert.ToInt32(reader["Grade"]);
        //                       // uvmi.LastPublicationDate = null;
        //                       //uvmi.PaymentRemarks = null;
        //                        uvmi.ProfileImage = (byte[])reader["ProfileImage"];
        //                       // uvmi.ZipPostalCode = "" + reader["ZipPostalCode"];
        //                        uvmi.AddressId = Convert.ToInt32(reader["AddressId"]);
        //                        //uvmi.IntroVideoURL = "" + reader["IntroVideoURL"];
        //                        //uvmi.IntroVideoReferenceId = Convert.ToInt64(reader["IntroVideoReferenceId"]);
        //                        //uvmi.IntroVideoStatusId = Convert.ToInt32(reader["ApprovalStatus"]);
        //                        //uvmi.Address = "" + reader["Address1"];
        //                        //uvmi.Address2 = "" + reader["Address1"];
        //                        uvmi.Contact = "" + reader["PhoneNumber"];
        //                        //uvmi.FileUniqueId = "" + reader["FileUniqueId"];                                
        //                        uvmi.LastUpdatedBy = Convert.ToInt32(reader["LastUpdatedBy"]);
        //                        uvmi.CreatedAt = Convert.ToDateTime(reader["CreatedAt"]);
        //                        uvmi.LastUpdatedAt = Convert.ToDateTime(reader["LastUpdatedAt"]);
        //                        //uvmi.FaxNumber = "" + reader["FaxNumber"];
        //                       // uvmi.SubscriberStatus = Convert.ToInt32(reader["PaymentStatus"]);
        //                        //uvmi.CityName = "" + reader["CityName"];
        //                        uvmi.StateName = "" + reader["StateName"];
        //                       // uvmi.StateId = Convert.ToInt32(reader["StateId"]);
        //                       // uvmi.CityId = Convert.ToInt32(reader["CityId"]);
        //                        uvm.Add(uvmi);
        //                    }
        //                    reader.Close();
        //                }

        //            }

        //        }// Using
        //    }// Try
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.StackTrace);
        //        throw ex;
        //    }
        //    return uvm.AsQueryable();
        //}
        public async Task<IEnumerable<UserViewModel>> GetBMTUsersListAsync(int userId, int OrgId, int roleId, string name, int status, DateTime dtFrom, DateTime dtTo)
        {
            List<UserViewModel> uvm = new List<UserViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pkeyword = new MySqlParameter("p_keyword", "" + name);
                        parameter.Add(pkeyword);
                        MySqlParameter pUserId = new MySqlParameter("p_UserId", MySqlDbType.Int32);
                        pUserId.Value = Convert.ToInt32(userId);
                        parameter.Add(pUserId);
                        MySqlParameter pStatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pStatus.Value = status;
                        parameter.Add(pStatus);
                        MySqlParameter pOrgId = new MySqlParameter("p_OrgId", MySqlDbType.Int32);
                        pOrgId.Value = OrgId;
                        parameter.Add(pOrgId);
                        MySqlParameter pRoleId = new MySqlParameter("p_RoleId", MySqlDbType.Int32);
                        pRoleId.Value = roleId;
                        parameter.Add(pRoleId);
                        //(@keyword varchar(100), @MerchantId int= 0, @SchoolId int= 0, @CategoryId int= 0, @DateFrom Date , @DateTo Date)
                        MySqlParameter pDateFrom = new MySqlParameter("p_DateFrom", MySqlDbType.DateTime);
                        pDateFrom.Value = dtFrom.Year <= 1900 ? new DateTime(GlobalUTIL.CurrentDateTime.Year, 1, 1) : dtFrom;
                        parameter.Add(pDateFrom);
                        MySqlParameter pDateTo = new MySqlParameter("p_DateTo", MySqlDbType.DateTime);
                        pDateTo.Value = dtTo.Year <= 1900 ? GlobalUTIL.CurrentDateTime : dtTo;
                        parameter.Add(pDateTo);
                        command.Parameters.AddRange(parameter.ToArray());
                        command.CommandText = "spGetBMTUsersList";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                UserViewModel uvmi = new UserViewModel();
                                uvmi.Id = Convert.ToInt32(reader["Id"]);
                                // uvmi.SchoolId = Convert.ToInt32(reader["SchoolId"]);
                                uvmi.UserCode = "" + reader["Id"];
                                uvmi.CompleteName = "" + reader["CompleteName"];
                                uvmi.OrgId = Convert.ToInt32(reader["OrgId"]);
                                uvmi.CityId = Convert.ToInt32(reader["AddCity"]);// CityId

                                // uvmi.SchoolName = "" + reader["SchoolName"];
                                uvmi.RoleName = "" + reader["RoleName"];
                                uvmi.FirstName = "" + reader["FirstName"];
                                uvmi.LastName = "" + reader["LastName"];
                                uvmi.MiddleName = "" + reader["MiddleName"];
                                uvmi.Contact = "" + reader["Contact"];
                                uvmi.Password = "" + reader["Password"];
                                uvmi.RoleId = Convert.ToInt32(reader["RoleID"]);
                                uvmi.Email = "" + reader["Email"];
                                //uvmi.RoleId = (int)UTIL.USERROLES.MERCHANT;
                                uvmi.Gpslocation = "";
                                uvmi.Title = "" + reader["Title"];
                                uvmi.Ims = "";
                                uvmi.GenderId = Convert.ToInt32(reader["GenderID"]);
                                uvmi.Status = Convert.ToInt32(reader["Status"]);
                                //uvmi.CreditCardExpiryDate = Convert.ToDateTime(reader["CreditCardExpiryDate"]);
                                uvmi.RegistrationTime = Convert.ToDateTime(reader["CreatedAt"]);
                                uvmi.OrgName = "" + reader["OrgName"];
                                uvmi.Avatar = "" + reader["Avatar"];
                                //uvmi.ZipPostalCode = "" + reader["ZipPostalCode"];
                                uvmi.AddressId = Convert.ToInt32(reader["AddressId"]);
                                uvmi.UserName = "" + reader["UserName"];
                                //uvmi.Contact = "" + reader["PhoneNumber"];
                                //uvmi.FileUniqueId = "" + reader["FileUniqueId"];
                                uvmi.LastUpdatedBy = Convert.ToInt32(reader["LastUpdatedBy"]);
                                uvmi.CreatedAt = Convert.ToDateTime(reader["CreatedAt"]);
                                uvmi.LastUpdatedAt = Convert.ToDateTime(reader["LastUpdatedAt"]);
                                uvmi.StateName = "" + reader["StateName"];
                                uvm.Add(uvmi);
                            }
                            reader.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return uvm.AsQueryable();
        }
        public async Task<IEnumerable<OrganizationViewModel>> GetOrganizationListReport(int OrgId, string keyword,int status, DateTime dtFrom, DateTime dtTo)
        {
            List<OrganizationViewModel> uvm = new List<OrganizationViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pkeyword = new MySqlParameter("p_keyword", "" + keyword);
                        parameter.Add(pkeyword);                     
                        MySqlParameter pStatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pStatus.Value = status;
                        parameter.Add(pStatus);
                        MySqlParameter pOrgId = new MySqlParameter("p_orgid", MySqlDbType.Int32);
                        pOrgId.Value = OrgId;
                        parameter.Add(pOrgId);                    
                        MySqlParameter pDateFrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pDateFrom.Value = dtFrom.Year <= 1900 ? new DateTime(GlobalUTIL.CurrentDateTime.Year, 1, 1) : dtFrom;
                        parameter.Add(pDateFrom);
                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = dtTo.Year <= 1900 ? GlobalUTIL.CurrentDateTime : dtTo;
                        parameter.Add(pDateTo);
                        command.Parameters.AddRange(parameter.ToArray());
                        command.CommandText = "spGetOrganizationUsersListReport";
                        command.CommandType = CommandType.StoredProcedure;
                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                OrganizationViewModel ovm = new OrganizationViewModel();
                                ovm.Id = Convert.ToInt32(reader["Id"]);
                                // uvmi.SchoolId = Convert.ToInt32(reader["SchoolId"]); Name, Email, Contact logoavatar, strength, StateName, PackageName, CreatedAt, ExpiryTime
                                ovm.Name = "" + reader["Name"];                              
                                ovm.Email = "" + reader["Email"];
                                ovm.Contact = "" + reader["Contact"];                              
                                ovm.LogoAvatar = ""+reader["logoavatar"];                             
                                ovm.Strength = Convert.ToInt32(reader["strength"]);
                                ovm.StateName = ""+ reader["StateName"];
                                ovm.PackageName = "" + reader["PackageName"];
                                ovm.CreatedAt = Convert.ToDateTime(reader["CreatedAt"]);
                                ovm.ExpiryTime = Convert.ToDateTime(reader["ExpiryTime"]);
                                uvm.Add(ovm);
                            }
                            reader.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return uvm.AsQueryable();
        }
        public async Task<IEnumerable<NetworkViewModel>>  GetNetworkData(int status=1) {
            List<NetworkViewModel> ls = new List<NetworkViewModel>();
            try {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand()) {
                        //************************  PARAMETERS*******************************//

                        command.CommandText = string.Format("Select Id ,Name,Description,CategoryId,Status,CreatedBy,CreatedAt,LastUpdatedBy,LastUpdatedAt,RowVer from networks  where  0= {0} OR Status= {0} ", status) ;
                        command.CommandType = System.Data.CommandType.Text;
                        using (DbDataReader reader = command.ExecuteReader()) {
                            while (reader.Read()) {
                                NetworkViewModel network = new NetworkViewModel();
                                network.Id = Convert.ToInt32(reader["Id"]);                                
                                network.Name = "" + reader["Name"];                              
                                network.Description = "" + reader["Description"];
                                network.CategoryId = Convert.ToInt32(reader["CategoryId"]);
                                network.Status = Convert.ToInt32(reader["Status"]);
                                network.CreatedBy = Convert.ToInt32(reader["CreatedBy"]);
                                network.LastUpdatedBy = Convert.ToInt32(reader["LastUpdatedBy"]);
                                network.LastUpdatedBy = Convert.ToInt32(reader["LastUpdatedBy"]);
                                network.CreatedAt = Convert.ToDateTime(reader["CreatedAt"]);
                                network.LastUpdatedAt = Convert.ToDateTime(reader["LastUpdatedAt"]);                               
                                ls.Add(network);
                            }
                            reader.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex) {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return ls.AsQueryable();

        }
        public async Task<IEnumerable<DashboardViewModel>> GetDashboardData(DashboardViewModel viewModel)
        {
            IEnumerable<DashboardViewModel> DashViewModel = new List<DashboardViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameters = new List<MySqlParameter>();
                        MySqlParameter pOrganizationId = new MySqlParameter("p_OrgId", MySqlDbType.Int32);
                        pOrganizationId.Value = Convert.ToInt32(viewModel.OrganizationId);
                        parameters.Add(pOrganizationId);
                        command.Parameters.AddRange(parameters.ToArray());
                        command.CommandText = "spDashboardData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            DataTable dt = new DataTable();
                            dt.Load(reader);
                            var stats = from sts in dt.AsEnumerable()
                                        select new DashboardViewModel
                                        {
                                            DataOfMonth = Convert.ToString(sts["DataOfMonth"]),
                                            TotalCompaigns = Convert.ToInt32(sts["TotalCompaigns"]),
                                            NewCompaigns = Convert.ToInt32(sts["NewCompaigns"]),
                                            MonthNumber = Convert.ToInt32(sts["MonthNumber"]),
                                            FundsAmount = Math.Round(Convert.ToDouble(sts["FundsAmount"]), 2),
                                            PercentageIncrease = Math.Round(Convert.ToDouble(sts["PercentageIncrease"]), 2),

                                        };

                            if (stats != null)
                                DashViewModel = _mapper.Map<IEnumerable<DashboardViewModel>>(stats);
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return DashViewModel.AsQueryable();

        }
        public async Task<IEnumerable<OrganizationViewModel>> GetOrganizationsData(OrganizationViewModel model) { 
        
            List<OrganizationViewModel> organizations = new List<OrganizationViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameters = new List<MySqlParameter>();
                        MySqlParameter pOrganizationId = new MySqlParameter("p_OrganizationId", MySqlDbType.Int32);
                        pOrganizationId.Value = Convert.ToInt32(model.Id);
                        parameters.Add(pOrganizationId);
                        MySqlParameter pNetworkId = new MySqlParameter("p_NetworkId", MySqlDbType.Int32);
                        pNetworkId.Value = (model.NetworkId == null ?0: model.NetworkId)  ;
                        parameters.Add(pNetworkId);
                        MySqlParameter pRegistrationDate = new MySqlParameter("p_RegistrationDate", MySqlDbType.Date);
                        pRegistrationDate.Value = model.CreatedAt.Year<=1900?System.DateTime.UtcNow.AddYears(-5): model.CreatedAt;
                        parameters.Add(pRegistrationDate);
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = model.Name;
                        parameters.Add(pKeyword);
                        MySqlParameter pCityId = new MySqlParameter("p_cityId", MySqlDbType.Int32);
                        pCityId.Value = (model.CityId == null ? 0 : model.CityId);
                        parameters.Add(pCityId);
                        MySqlParameter pStatus = new MySqlParameter("p_Status", MySqlDbType.Int32);
                        pStatus.Value = model.Status;
                        parameters.Add(pStatus);
                        command.Parameters.AddRange(parameters.ToArray());
                        command.CommandText = "spGetOrganizations";
                        command.CommandType = CommandType.StoredProcedure;
                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                //orgs.CityId, Instagram,WhatsApp,FB,IBANOrWireTransferId
                                OrganizationViewModel org = new OrganizationViewModel();
                                org.Id = Convert.ToInt32(reader["Id"]);
                                org.Name = "" + reader["Name"];
                                org.Description = "" + reader["Description"];
                                org.Strength = Convert.ToInt32(reader["strength"]);
                                org.CompaignsCount = Convert.ToInt32(reader["CompaignsCount"]);  
                                org.Status = Convert.ToInt32(reader["Status"]);
                                org.CurrencyId = Convert.ToInt32(reader["CurrencyId"]);
                                org.CityId = Convert.ToInt32(reader["CityId"]);
                                org.StateId = Convert.ToInt32(reader["StateId"]); 
                                org.Instagram = ""+ (reader["Instagram"]);
                                org.WhatsApp = "" + (reader["WhatsApp"]);
                                org.Fb = "" + (reader["FB"]);
								org.CountryCode = "" + (reader["code"]);
								org.LogoAvatar = "" + (reader["logoAvatar"]);
                                org.IbanorWireTransferId = "" + (reader["IBANOrWireTransferId"]);
                                org.Address = "" + (reader["Address"]);
                                org.Email = "" + (reader["Email"]);
                                org.CurrencyName = Convert.ToString(reader["currencyName"]);
                                org.CityName = ""+reader["CityName"];
                                org.Contact = ""+ reader["Contact"];
                                org.UserName = "" + reader["userName"];
                                org.CountryId = Convert.ToInt32(reader["countryid"]);
								org.CreatedBy = Convert.ToInt32(reader["CreatedBy"]);
                                org.CreatedAt = Convert.ToDateTime(reader["CreatedAt"]);
                                org.ExpiryTime = Convert.ToDateTime(reader["ExpiryTime"]);
                                org.LastUpdatedAt = Convert.ToDateTime(reader["LastUpdatedAt"]);
                                organizations.Add(org);
                            }
                            reader.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return organizations.AsQueryable();

        }
        public async Task<IEnumerable<OrgpackagedetailViewModel>> GetOrganizationBundlingData(OrganizationViewModel model)
        {
            List<OrgpackagedetailViewModel> organizations = new List<OrgpackagedetailViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameters = new List<MySqlParameter>();
                        MySqlParameter pOrganizationId = new MySqlParameter("p_OrganizationId", MySqlDbType.Int32);
                        pOrganizationId.Value = Convert.ToInt32(model.Id);
                        parameters.Add(pOrganizationId);
                        command.Parameters.AddRange(parameters.ToArray());
                        command.CommandText = "spGetOrganizationBundlingDetails";
                        command.CommandType = CommandType.StoredProcedure;
                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                //ntwk.CategoryId, ntwk.Name networkName, ntwk.Description networkDesc 
                                OrgpackagedetailViewModel pkg = new OrgpackagedetailViewModel();
                                pkg.Id = Convert.ToInt32(reader["Id"]);
                                pkg.Name = "" + reader["Name"];
                               // pkg.Description = "" + reader["Description"];
                                pkg.BusinessId = ""+ (reader["BusinessId"]);
                                pkg.NetworkId = Convert.ToInt32(reader["NetworkId"]);
                                pkg.PostTypeId = Convert.ToInt16(reader["PostTypeId"]);
                                pkg.BufferQuota = Convert.ToInt32(reader["BufferQuota"]);
                                pkg.PurchasedQouta = Convert.ToInt32(reader["PurchasedQouta"]);
                                pkg.UnitPriceInclTax = Convert.ToDouble(reader["UnitPriceInclTax"]);  
                                pkg.UsedQuota = Convert.ToInt32(reader["UsedQuota"]);
                                pkg.Status = Convert.ToInt32(reader["Status"]);
                                pkg.OrgId = Convert.ToInt32(reader["OrgId"]);
                                pkg.AutoReplyAllowed = Convert.ToInt16(reader["AutoReplyAllowed"]);
                                pkg.CategoryId = Convert.ToInt16(reader["CategoryId"]);
                                pkg.networkName = ""+ (reader["networkName"]);
                                pkg.networkDesc = "" + (reader["networkDesc"]);
                                pkg.VirtualAccount = Convert.ToInt16(reader["VirtualAccount"]);  
                                pkg.UnitId = Convert.ToInt32(reader["UnitId"]);
                                pkg.ApikeySecret = "" + (reader["APIKeySecret"]);
                                pkg.Apikey = "" + (reader["APIKey"]);
                                pkg.Apiuri = "" + (reader["APIURI"]);
                                pkg.FinishTime = Convert.ToDateTime(reader["FinishTime"]);
                                organizations.Add(pkg);
                            }
                            reader.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return organizations.AsQueryable();

        }
        public async Task<IEnumerable<CompaignsViewModel>> GetCompaignsData(CompaignsViewModel model)
        {
            List<CompaignsViewModel> compaigns = new List<CompaignsViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameters = new List<MySqlParameter>();
                        MySqlParameter pstore = new MySqlParameter("p_orgId", MySqlDbType.Int32);
                        pstore.Value = model.OrgId;
                        parameters.Add(pstore);
                        MySqlParameter pStatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pStatus.Value = model.Status;
                        parameters.Add(pStatus);
                        MySqlParameter pName = new MySqlParameter("p_name", MySqlDbType.VarChar);
                        pName.Value = model.Name;
                        parameters.Add(pName);
                        MySqlParameter pNetworkId = new MySqlParameter("p_networkId", MySqlDbType.Int32);
                        pNetworkId.Value = model.NetworkId;
                        parameters.Add(pNetworkId);
                        MySqlParameter pFromDate = new MySqlParameter("p_DateFrom", MySqlDbType.DateTime);
                        pFromDate.Value = model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddMonths(-12) : model.CreatedAt;
                        parameters.Add(pFromDate);
                        MySqlParameter pToDate = new MySqlParameter("p_DateTo", MySqlDbType.DateTime);
                        pToDate.Value = model.LastUpdatedAt == null || model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameters.Add(pToDate);
                        MySqlParameter pId = new MySqlParameter("p_Id", SqlDbType.BigInt);
                        pId.Value = Convert.ToInt64(model.Id);
                        parameters.Add(pId);
                        MySqlParameter pUserId = new MySqlParameter("p_userid", MySqlDbType.Int32);
                        pUserId.Value = Convert.ToInt32(model.LastUpdatedBy);
                        parameters.Add(pUserId);
                        command.CommandText = "spWebApiPOSGetCompaigns";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());
                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                var compaign = new CompaignsViewModel
                                {
                                    Id = Convert.ToInt64(dr["id"]),
                                    NetworkId = Convert.ToInt32(dr["NetworkId"]),
                                    OrgId = Convert.ToInt32(dr["OrgId"]),
                                    Name = "" + (dr["CompaignName"]),
                                    OrgName = "" + (dr["orgName"]),                                    
                                    //  ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]),                                            
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    CreatedBy = Convert.ToInt32(dr["CreatedBy"]),
                                    Title = "" + (dr["Compaigntitle"]),
                                    NetworkName = "" + (dr["NetworkName"]),
                                    Description = "" + (dr["CompaignDesc"]),
                                    targetaudiance = "" + (dr["targetaudiance"]),
                                    Contact = "" + (dr["Contact"]),
                                    logoAvatar = "" + (dr["logoAvatar"]),
                                    compaignsdetails = "" + (dr["compaignsdetails"]),
                                    compaignschedules = "" + (dr["compaignschedules"]),
                                    attachments = "" + (dr["attachments"]),
                                    HashTags = "" + (dr["HashTags"]),                                  
                                    StartTime = Convert.ToDateTime(dr["StartTime"]),
                                    // remarks = "" + (dr["remarks"]),
                                    TaxApplicable = Convert.ToDouble(dr["TaxApplicable"]),
                                    Discount = Convert.ToDouble(dr["Discount"]),                                    
                                    TotalBudget = Convert.ToDouble(dr["TotalBudget"]),
                                    FinishTime = Convert.ToDateTime(dr["FinishTime"]),
                                    Status = Convert.ToInt16(dr["Status"]),
                                   
                            };
                                compaigns.Add(compaign);
                            }//while (dr.Read())



                        }// using (DbDataReader dr = command.ExecuteReader())
                    }
                }
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return compaigns.AsQueryable();

        }

        public async Task<IEnumerable<BundlingpackagedetailViewModel>> LoadCustomBundlingPackagesData(int networkId=0) {
            List<BundlingpackagedetailViewModel> ls = new List<BundlingpackagedetailViewModel>();
            try
            {

                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameters = new List<MySqlParameter>();
                        MySqlParameter pNetworkId = new MySqlParameter("p_networkId", MySqlDbType.Int32);
                        pNetworkId.Value = networkId;
                        parameters.Add(pNetworkId);
                        command.CommandText = "spGetPricingGlobalList";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());
                        using (DbDataReader sts = command.ExecuteReader())
                        {
                            while (sts.Read())
                            {
                                //bndl.FreeAllowed, bndl.LastUpdatedAt, bndl.NetworkId, bndl.StartTime, bndl.Tax, bndl.UnitId,bndl.UnitPrice
                                //,ntwrks.Name networkName, unts.Name unitName, bndl.[Status]
                                BundlingpackagedetailViewModel mdl = new BundlingpackagedetailViewModel();
                                mdl.Id = Convert.ToInt32(sts["Id"]);                               
                                mdl.Name = "" + sts["networkName"];
                                mdl.unitName = "" + sts["unitName"];
                                mdl.CurrentApplied = Convert.ToInt32(sts["CurrentApplied"]);
                                mdl.FreeAllowed = Convert.ToInt32(sts["FreeAllowed"]);
                                mdl.UnitPrice = Convert.ToDouble(sts["UnitPrice"]);
                                mdl.purchasedQouta = Convert.ToDouble(sts["purchasedQouta"]);
                                mdl.usedQuota = Convert.ToDouble(sts["usedQuota"]);
                                mdl.UnitId = Convert.ToInt32(sts["UnitId"]);
                                mdl.Status = Convert.ToInt32(sts["Status"]);
                                mdl.BundlingAllowed = Convert.ToInt32(sts["BundlingAllowed"]);
                                mdl.Status = Convert.ToInt32(sts["Status"]);
                                mdl.Discount = Convert.ToDouble(sts["Discount"]);
                                mdl.NetworkId = Convert.ToInt32(sts["NetworkId"]);
                                mdl.Tax = Convert.ToDouble(sts["Tax"]);
                                mdl.FinishTime = Convert.ToDateTime(sts["FinishTime"]);
                                mdl.StartTime = Convert.ToDateTime(sts["StartTime"]);
                                mdl.ApprovalTime = Convert.ToDateTime(sts["ApprovalTime"]);                            
                                mdl.LastUpdatedAt = Convert.ToDateTime(sts["LastUpdatedAt"]);
                                ls.Add(mdl);
                            }
                            sts.Close();
                        }

                    }
                    connection.Close();
                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return ls;
        }
        public async Task<IEnumerable<BundlingpackagedetailViewModel>> LoadOrgBundlingPackagesData(int orgid = 0, int networkId = 0)
        {
            List<BundlingpackagedetailViewModel> ls = new List<BundlingpackagedetailViewModel>();
            try
            {

                using (MySqlConnection connection = new MySqlConnection((BlazorConstant.CONNECTION_STRING)))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameters = new List<MySqlParameter>();
                        MySqlParameter pNetworkId = new MySqlParameter("p_networkId", MySqlDbType.Int32);
                        pNetworkId.Value = networkId;
                        parameters.Add(pNetworkId);
                        MySqlParameter pOrgId = new MySqlParameter("p_orgid", MySqlDbType.Int32);
                        pOrgId.Value = orgid;
                        parameters.Add(pOrgId);
                        command.CommandText = "spGetOrgBundlingNetworks";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());
                        using (DbDataReader sts = command.ExecuteReader())
                        {
                            while (sts.Read())
                            {
                                //bndl.FreeAllowed, bndl.LastUpdatedAt, bndl.NetworkId, bndl.StartTime, bndl.Tax, bndl.UnitId,bndl.UnitPrice
                                //,ntwrks.Name networkName, unts.Name unitName, bndl.[Status]
                                BundlingpackagedetailViewModel mdl = new BundlingpackagedetailViewModel();
                               
                                mdl.Name = "" + sts["networkName"];                              
  
                                mdl.purchasedQouta = Convert.ToDouble(sts["purchasedQouta"]);
                                mdl.UnitPrice = Convert.ToDouble(sts["unitprice"]); 
                                mdl.usedQuota = Convert.ToDouble(sts["usedQuota"]);
                                mdl.Discount = Convert.ToDouble(sts["Discount"]);
                                mdl.Discount = Convert.ToDouble(sts["Discount"]);
                                mdl.FreeAllowed = Convert.ToInt32(sts["FreeAllowed"]);
                                mdl.Status = Convert.ToInt32(sts["Status"]);                                
                                mdl.NetworkId = Convert.ToInt32(sts["NetworkId"]);
                                mdl.StartTime = Convert.ToDateTime(sts["StartTime"]);

                                ls.Add(mdl);
                            }
                            sts.Close();
                        }

                    }
                    connection.Close();
                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return ls;
        }
        //public async Task<VideoViewCountModel> UpdateVideoViewCount(VideoViewCountModel vvcm)
        //{
        //    try
        //    {
        //        using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
        //        {
        //            connection.Open();
        //            using (var command = connection.CreateCommand())
        //            {
        //                List<SqlParameter> parameter = new List<SqlParameter>();
        //                SqlParameter Key = new MySqlParameter("p_Key", "" + vvcm.videoKey);
        //                parameter.Add(Key);

        //                SqlParameter id = new MySqlParameter("p_Id", SqlDbType.Int);
        //                id.Value = vvcm.id;
        //                parameter.Add(id);

        //                SqlParameter Count = new MySqlParameter("p_Count", SqlDbType.Int);
        //                Count.Direction = ParameterDirection.Output;
        //                parameter.Add(Count);
        //                SqlParameter ViewCount = new MySqlParameter("p_ViewCount", SqlDbType.Int);
        //                ViewCount.Value = vvcm.viewsCount;
        //                parameter.Add(ViewCount);
        //                command.Parameters.AddRange(parameter.ToArray());
        //                command.CommandText = "spUpdateVideoCount";
        //                command.CommandType = System.Data.CommandType.StoredProcedure;
        //                await command.ExecuteNonQueryAsync();

        //                vvcm.viewsCount = (int)command.Parameters["@Count"].Value;                     

        //            }
        //            connection.Close();
        //        }// Using
        //    }// Try
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.StackTrace);
        //        throw ex;
        //    }
        //    return vvcm;

        //}
        public async Task<IEnumerable<Configration>> LoadOrgConfigurationsData(int orgId) {
            List<Configration> cvmls = new List<Configration>();
            try
            {

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "spLoadConfigurationsList";
                        MySqlParameter pOrgId = new MySqlParameter("p_orgId", SqlDbType.Int);
                        pOrgId.Value = orgId;                     
                        command.Parameters.Add(pOrgId);
                        command.CommandType = CommandType.StoredProcedure;
                        using (DbDataReader sts = command.ExecuteReader())
                        {
                            while (sts.Read())
                            {
                                Configration cvm = new Configration();
                                cvm.Id = Convert.ToInt32(sts["Id"]);                              
                                cvm.Key = "" + sts["Key"];
                                cvm.Value = "" + sts["Value"];
                                cvm.Status = Convert.ToInt32(sts["Status"]);
                                //cvm.row = Convert.ToInt32(sts["RowVer"]);

                                cvmls.Add(cvm);
                            }
                            sts.Close();
                        }

                    }
                    connection.Close();
                }// Using
            }// Try
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return cvmls;
        }
        //public async Task<IEnumerable<BasicConfigurationViewModel>> LoadBasicConfigurationsData()
        //{
        //   // List<ConfigurationsViewModel> cvmls = new List<ConfigurationsViewModel>();
        //    try
        //    {

        //        using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
        //        {
        //            connection.Open();
        //            using (var command = connection.CreateCommand())
        //            {
        //                command.CommandText = "spLoadConfigurationsList";
        //                command.CommandType = System.Data.CommandType.StoredProcedure;
        //                using (DbDataReader sts = command.ExecuteReader())
        //                {
        //                    while (sts.Read())
        //                    {
        //                        ConfigurationsViewModel cvm = new ConfigurationsViewModel();
        //                        cvm.id = Convert.ToInt32(sts["Id"]);
        //                        //cvm.CreatedBy = Convert.ToInt32(sts["categoryId"]);
        //                        //cvm.LastUpdatedAt = Convert.ToInt32(sts["AuthorId"]);
        //                        cvm.Key = "" + sts["Key"];
        //                        cvm.Value = "" + sts["Value"];
        //                        cvm.Status = Convert.ToInt32(sts["Status"]);
        //                        cvm.RowVer = Convert.ToInt32(sts["RowVer"]);

        //                        cvmls.Add(cvm);
        //                    }
        //                    sts.Close();
        //                }

        //            }
        //            connection.Close();
        //        }// Using
        //    }// Try
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.StackTrace);
        //        throw ex;
        //    }
        //    return cvmls;

        //}
        public async Task<IEnumerable<MenuViewModel>> loadRoleMenus(int roleid)
        {
            List<MenuViewModel> mls = new List<MenuViewModel>();
            try
            {

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pRoleid = new MySqlParameter("p_Roleid", MySqlDbType.Int32);
                        pRoleid.Value = roleid;
                        parameter.Add(pRoleid);
                        command.CommandText = "spGetMenuesByRoleId";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());
                        ConfigurationsViewModel viewModel = new ConfigurationsViewModel();
                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                mls.Add(new MenuViewModel
                                {
                                    Id = Convert.ToInt32(dr["MenuID"]),
                                    AssignmentId = Convert.ToInt32(dr["assignmentId"]),
                                    Name = "" + dr["MenuName"],
                                    ActionName = "" + dr["ActionName"],
                                    ParentId = Convert.ToInt32(dr["ParentId"]),
                                    Description = "" + dr["Description"],                                    
                                    SortOrder = Convert.ToInt32(dr["SortOrder"]),
                                    ParentMSortOrder = Convert.ToInt32(dr["ParentMSortOrder"]),
                                    submenuId = Convert.ToInt32(dr["SubMenuId"]),
                                    MenueIcon = "" + (dr["MenueIcon"]),
                                    IsVisible = Convert.ToSByte(dr["IsVisible"]),
                                    CanUpdate = Convert.ToByte(dr["CanUpdate"]),
                                    CanView = Convert.ToByte(dr["CanView"]),
                                    CanAdd = Convert.ToByte(dr["CanAdd"]),
                                    Full = Convert.ToByte(dr["full"]),
                                    CanDelete = Convert.ToByte(dr["CanDelete"]),
                                    CanPrint = Convert.ToByte(dr["CanPrint"]),
                                    CanExport = Convert.ToByte(dr["CanExport"]),
                                    ComponentName = "" + (dr["componentname"])
                                });
                            }//while (dr.Read())

                        }// using (DbDataReader dr = command.ExecuteReader())                        
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return mls.AsQueryable();

        }
        [HttpPost]
        public async Task<BlazorResponseViewModel> AddUpdateRoleRights([FromBody] List<RolerightViewModel> vLst)
        {

            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {

                try
                {
                    var opt = new JsonSerializerOptions() { WriteIndented = true };
                    string vRightsSON = JsonSerializer.Serialize<IList<RolerightViewModel>>(vLst, opt);
                    //if (uvmr != null) {
                    using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                    {
                        await connection.OpenAsync();
                        using (var command = connection.CreateCommand())
                        {
                            List<MySqlParameter> parameter = new List<MySqlParameter>();
                            //MySqlParameter pRoleId = new MySqlParameter("p_roleid", SqlDbType.Int);
                            //pRoleId.Value = roleId;
                            //parameter.Add(pRoleId);
                            MySqlParameter pJson = new MySqlParameter("p_vrightsjson", MySqlDbType.JSON);
                            pJson.Value = vRightsSON;
                            parameter.Add(pJson);
                            command.CommandText = "spAddUpdateRoleRights";
                            command.CommandType = System.Data.CommandType.StoredProcedure;
                            command.Parameters.AddRange(parameter.ToArray());
                            var result = await command.ExecuteScalarAsync();
                            blazorApiResponse.data = result.ToString();
                            blazorApiResponse.status = true;
                            blazorApiResponse.message = string.Format(result.ToString());

                        }
                    }

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.StackTrace);
                    throw ex;
                }
                //_cache.Set(this.User.Identity.Name + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));

            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
            // .ToArray();
        }

        public async Task<BlazorResponseViewModel> AddUpdateNetworkSettingsFormData(List<OrgpackagedetailViewModel> lst, int UserId)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
                string NetworkJSON = string.Empty;
                // Networks
                if (lst != null && lst.Any())
                {
                    //List<CompaignNetworkDetailViewModel> ls = model.CompaignNetworkDetails.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true };
                    NetworkJSON = JsonSerializer.Serialize<List<OrgpackagedetailViewModel>>(lst, options);
                
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                            //@orgId int=0,@NetworksJSON as nvarchar(2000) ='', @UserId int=0
                            MySqlParameter pUserId = new MySqlParameter("p_UserId", SqlDbType.Int);
                        pUserId.Value = UserId;
                        command.Parameters.Add(pUserId);
                            MySqlParameter pNetworkSettingsJSON = new MySqlParameter("p_NetworkSettingsJSON", MySqlDbType.JSON);
                        pNetworkSettingsJSON.Value = NetworkJSON;
                        command.Parameters.Add(pNetworkSettingsJSON);                        
                        command.CommandText = "spUpdateNetworkSettingData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        response.data = await command.ExecuteScalarAsync();
                        response.status = true;
                        // response.message = string.Format()
                        response.message = string.Format(BlazorConstant.UPDATED_SUCCESS, "Networks", System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));

                    }
                    connection.Close();
                    }
                }// Using
            }// Try
            catch (Exception ex)
            {
                response.status = false;

                response.message = string.Format(BlazorConstant.UPDATE_FAILED, "", (ex.InnerException == null ? ex.Message : ex.InnerException.Message));
                _logger.LogError(ex.StackTrace);
                // throw ex;
            }
            return response;

        }
        public async Task<BlazorApiResponse> UpdateNetworksData(List<networkidvalues> lst, int UserId)
        {
            BlazorApiResponse response = new BlazorApiResponse();
            try
            {
                string NetworkJSON = string.Empty;
                // Networks
                if (lst != null && lst.Any())
                {
                    //List<CompaignNetworkDetailViewModel> ls = model.CompaignNetworkDetails.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true }; 
                    NetworkJSON = JsonSerializer.Serialize<List<networkidvalues>>(lst, options);
                }
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //@orgId int=0,@NetworksJSON as nvarchar(2000) ='', @UserId int=0
                        MySqlParameter pOrgId = new MySqlParameter("p_orgId", SqlDbType.Int);
                        pOrgId.Value = 0;
                        command.Parameters.Add(pOrgId);
                        MySqlParameter pNetworksJSON = new MySqlParameter("p_NetworksJSON", MySqlDbType.VarChar,4000);
                        pNetworksJSON.Value = NetworkJSON;
                        command.Parameters.Add(pNetworksJSON);
                        MySqlParameter pUserId = new MySqlParameter("p_UserId", SqlDbType.Int);
                        pUserId.Value = UserId;
                        command.Parameters.Add(pUserId);
                        command.CommandText = "spUpdateNetworkStatusAndQoutas";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        response.data= await command.ExecuteScalarAsync();
                        response.status = true;
                       // response.message = string.Format()
                        response.message = string.Format(BlazorConstant.UPDATED_SUCCESS, "Networks", System.DateTime.Now.ToString("MM/dd/yyy hh:mm:ss"));

                    }
                    connection.Close();
                }// Using
            }// Try
            catch (Exception ex)
            {
                response.status = false;
                
                response.message = string.Format(BlazorConstant.UPDATE_FAILED, "", (ex.InnerException == null ? ex.Message : ex.InnerException.Message)); 
                _logger.LogError(ex.StackTrace);
               // throw ex;
            }
            return response;

        }
        public async Task<BlazorResponseViewModel> SocialMediaCreateLogin(UserViewModel model)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pId = new MySqlParameter("p_id", SqlDbType.Int);
                        pId.Value = model.Id; //model.id;
                        parameter.Add(pId);
                        MySqlParameter pStoreId = new MySqlParameter("p_OrgId", SqlDbType.Int);
                        pStoreId.Value = model.OrgId; //model.storeid;
                        parameter.Add(pStoreId);
                        //  @regsource int=0, @RegistrationType int=0
                        MySqlParameter pUsername = new MySqlParameter("p_username", SqlDbType.NVarChar);
                        pUsername.Value = ""+ model.UserName;  //Contact model.username;
                        parameter.Add(pUsername);
                        MySqlParameter pFirstName = new MySqlParameter("p_firstname", SqlDbType.NVarChar);
                        pFirstName.Value = "" + model.FirstName;  //Contact model.username;
                        parameter.Add(pFirstName);
                        MySqlParameter pLastName = new MySqlParameter("p_lastname", SqlDbType.NVarChar);
                        pLastName.Value = "" + model.LastName;   //Contact model.username;
                        parameter.Add(pLastName);
                        MySqlParameter pAuthToken = new MySqlParameter("p_SecurityToken", SqlDbType.NVarChar);
                        pAuthToken.Value = "" + model.SecurityToken;  //Contact model.username;
                        parameter.Add(pAuthToken);
                        MySqlParameter pcontact = new MySqlParameter("p_Contact", SqlDbType.NVarChar);
                        pcontact.Value = "" + model.Contact;  // model.Contact;
                        parameter.Add(pcontact);
                        MySqlParameter pPassword = new MySqlParameter("p_Password", SqlDbType.NVarChar);
                        pPassword.Value = string.IsNullOrWhiteSpace(model.Password) ? string.Empty : GlobalUTIL.Encrypt(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String("" + model.Password)), true, BlazorConstant.SECKEY);
                        parameter.Add(pPassword);
                        MySqlParameter pemail = new MySqlParameter("p_email", SqlDbType.NVarChar);
                        pemail.Value = "" + model.Email; // "" + model.email;
                        parameter.Add(pemail);

                        MySqlParameter pCityId = new MySqlParameter("p_CityId", SqlDbType.Int);
                        pCityId.Value = 0;
                        parameter.Add(pCityId);
                        MySqlParameter pStateId = new MySqlParameter("p_stateId", SqlDbType.Int);
                        pStateId.Value = 0;// Convert.ToInt32(string.IsNullOrWhiteSpace(HttpContext.Request.Form["stateid"]) ? "0" : HttpContext.Request.Form["stateid"]); //model.StateId == null ? 0 : model.StateId;
                        parameter.Add(pStateId);
                        MySqlParameter pCityName = new MySqlParameter("p_cityName", SqlDbType.NVarChar);
                        pCityName.Value = "" + model.CityName;
                        parameter.Add(pCityName);

                        MySqlParameter prole = new MySqlParameter("p_roleId", SqlDbType.Int);
                        prole.Value = Convert.ToInt32(model.RoleId);  //"" + model.roleid;
                        parameter.Add(prole);
                        MySqlParameter pImageName = new MySqlParameter("p_logoimageName", SqlDbType.NVarChar);
                        pImageName.Value = string.IsNullOrWhiteSpace(model.Avatar) ? "" : model.Avatar;
                        parameter.Add(pImageName);

                        MySqlParameter pFMCToken = new MySqlParameter("p_FMCToken", SqlDbType.NVarChar);
                        pFMCToken.Value = "" ;  //"" + model.fmctoken;
                        parameter.Add(pFMCToken);
                        MySqlParameter pIMEI = new MySqlParameter("p_IMEI", SqlDbType.NVarChar);
                        pIMEI.Value = "" + model.UserCode; // "" + model.IM;
                        parameter.Add(pIMEI);
                        MySqlParameter pRegSource = new MySqlParameter("p_regsource", SqlDbType.Int);
                        pRegSource.Value = model.RegistrationSource;//  model.regsource;
                        parameter.Add(pRegSource);

                        MySqlParameter pStatus = new MySqlParameter("p_status", SqlDbType.Int);
                        pStatus.Value = model.Status; // model.status;
                        parameter.Add(pStatus);
                        MySqlParameter pRegistrationType = new MySqlParameter("p_RegistrationType", SqlDbType.Int);
                        pRegistrationType.Value = model.RegistrationSource; // register & login;
                        parameter.Add(pRegistrationType);
                        command.CommandText = "spAddUpdateUser";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        var result = command.ExecuteScalar();
                        model.Id = Convert.ToInt32(result);
                        response.data = model;
                        response.status = true;
                        // response.message = string.Format(result.ToString());

                        response.message = string.Format("{0} user registered / updated successfully", string.IsNullOrWhiteSpace(model.UserName)? model.Email: model.UserName);
                    }
                }
            }// Try
            catch (Exception ex)
            {
                response.status = false;

                response.message = string.Format(BlazorConstant.UPDATE_FAILED, "", (ex.InnerException == null ? ex.Message : ex.InnerException.Message));
                _logger.LogError(ex.StackTrace);
                // throw ex;
            }
            return response;

        }
        public async Task<BlazorResponseViewModel> UpdateCompaignStatus(CompaignsViewModel model)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pId = new MySqlParameter("p_id", MySqlDbType.Int64);
                        pId.Value = model.Id;
                        parameter.Add(pId);

                        MySqlParameter pRemarks = new MySqlParameter("p_Remarks", MySqlDbType.VarChar);
                        pRemarks.Value = "" + model.Remarks;
                        parameter.Add(pRemarks);

                        MySqlParameter pStatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pStatus.Value = model.Status;
                        parameter.Add(pStatus);

                        MySqlParameter pUserId = new MySqlParameter("p_UserId", MySqlDbType.Int32);
                        pUserId.Value = model.LastUpdatedBy;
                        parameter.Add(pUserId);

                        command.CommandText = "spUpdateCompaignStatus";
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());
                        var result = command.ExecuteScalar();
                        response.effectedRows = Convert.ToInt32(result);
                        response.status = true;
                        response.message = string.Format(result.ToString());                       
                        response.data = model;                       
                        // response.message = string.Format(result.ToString());

                        response.message = string.Format("{0} updated successfully", string.IsNullOrWhiteSpace(Convert.ToString(model.Id)) ? model.Title : Convert.ToString(model.Id));
                    }
                }
            }// Try
            catch (Exception ex)
            {
                response.status = false;

                response.message = string.Format(BlazorConstant.UPDATE_FAILED, "", (ex.InnerException == null ? ex.Message : ex.InnerException.Message));
                _logger.LogError(ex.StackTrace);
                // throw ex;
            }
            return response;

        }
        public async Task<BlazorResponseViewModel> postCompaignData(CompaignsViewModel model, int UserId)
        {
            BlazorResponseViewModel response = new BlazorResponseViewModel();
            try
            {
                string networks = string.Empty;
                string campaignschedules = string.Empty;
                // Networks
                if (model.CompaignNetworks != null && model.CompaignNetworks.Any())
                {
                    List<CompaignNetworkViewModel> ls = model.CompaignNetworks.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                    networks = JsonSerializer.Serialize<List<CompaignNetworkViewModel>>(ls, options);
                }
                if (model.CompaignExecutionSchedules != null && model.CompaignExecutionSchedules.Any())
                {
                    List<CompaignexecutionscheduleViewModel> cdtl = model.CompaignExecutionSchedules.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                    campaignschedules = JsonSerializer.Serialize<List<CompaignexecutionscheduleViewModel>>(cdtl, options);
                }

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //  @id,networkId,orgId,Desc,Name,title,HashTags,startTime,finishTime,userId,status @Name nvarchar(100),@title nvarchar(100),@hashtag nvarchar(100),@startTime datetime,@finishTime datetime,@Desc nvarchar(4000), @status int=0
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pId = new MySqlParameter("p_id", MySqlDbType.Int32);
                        pId.Value = model.Id;
                        parameter.Add(pId);
                        //MySqlParameter pTotalBudget = new MySqlParameter("p_TotalBudget", SqlDbType.Float);
                        //pTotalBudget.Value = model.TotalBudget;
                        //parameter.Add(pTotalBudget);
                        MySqlParameter pmakedetailid = new MySqlParameter("p_orgId", MySqlDbType.Int32);
                        pmakedetailid.Value = model.OrgId;
                        parameter.Add(pmakedetailid);
                        MySqlParameter pAutoGenerateLeads = new MySqlParameter("p_AutoGenerateLeads", MySqlDbType.Int32);
                        pAutoGenerateLeads.Value = Convert.ToByte(model.AutoGenerateLeads);
                        parameter.Add(pAutoGenerateLeads);
                        MySqlParameter pDescription = new MySqlParameter("p_Desc", MySqlDbType.VarChar,2000);
                        pDescription.Value = "" + model.Description;
                        parameter.Add(pDescription);
                        MySqlParameter pName = new MySqlParameter("p_Name", MySqlDbType.VarChar,200);
                        pName.Value = "" + model.Name;
                        parameter.Add(pName);
                        MySqlParameter pTitle = new MySqlParameter("p_title", MySqlDbType.VarChar,200);
                        pTitle.Value = model.Title;
                        parameter.Add(pTitle);
                        MySqlParameter pHashtagt = new MySqlParameter("p_HashTags", MySqlDbType.VarChar, 200);
                        pHashtagt.Value = model.HashTags;
                        parameter.Add(pHashtagt);
                        MySqlParameter ptargetaudiance = new MySqlParameter("p_targetaudiance", MySqlDbType.VarChar, 4000);
                        ptargetaudiance.Value = model.targetaudiance;
                        parameter.Add(ptargetaudiance);
                        MySqlParameter pNetworkJSON = new MySqlParameter("p_networks", MySqlDbType.LongText,4000);
                        pNetworkJSON.Value = networks;
                        parameter.Add(pNetworkJSON);
                        MySqlParameter pTotalBudget = new MySqlParameter("p_TotalBudget", MySqlDbType.Float);
                        pTotalBudget.Value = (model.TotalBudget == null ? 0 : model.TotalBudget);//.TotalBudget;
                        parameter.Add(pTotalBudget);
                        MySqlParameter pDiscount = new MySqlParameter("p_Discount", MySqlDbType.Float);
                        pDiscount.Value = (model.Discount == null ? 0 : model.Discount);
                        parameter.Add(pDiscount);
                        //@HashTags nvarchar(2000)= '',@startTime DATE = GETDATE, @finishTime DATE = GETutcDATE,@userId int= 0, @status  int= 1
                        MySqlParameter pCampaignschedules = new MySqlParameter("p_campaignschedules", MySqlDbType.LongText, 4000);
                        pCampaignschedules.Value = campaignschedules;
                        parameter.Add(pCampaignschedules);
                        MySqlParameter pPaymentRef = new MySqlParameter("p_paymentRef", MySqlDbType.LongText, 1000);
                        pPaymentRef.Value = model.paymentRef;
                        parameter.Add(pPaymentRef);
                        MySqlParameter pStartTime = new MySqlParameter("p_startTime", MySqlDbType.DateTime);
                        pStartTime.Value = (model.StartTime == null ? GlobalUTIL.CurrentDateTime : model.StartTime);
                        parameter.Add(pStartTime);
                        MySqlParameter pFinishTime = new MySqlParameter("p_finishTime", MySqlDbType.DateTime);
                        pFinishTime.Value = GlobalUTIL.CurrentDateTime.AddDays(10);// (model.FinishTime == null ? GlobalUTIL.CurrentDateTime.AddMonths(1) : model.FinishTime);
                        parameter.Add(pFinishTime);
                        MySqlParameter pUserid = new MySqlParameter("p_userId", MySqlDbType.Int32);
                        pUserid.Value = model.CreatedBy <= 0 ? model.LastUpdatedBy : model.CreatedBy;
                        parameter.Add(pUserid);
                        MySqlParameter pStatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pStatus.Value = model.Status;
                        parameter.Add(pStatus);
                        command.CommandText = "spWebApiCreateCompaignWithNetworkDetails";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());
                        var result = command.ExecuteScalar();
                        response.data = result.ToString();
                        response.status = true;
                        response.message = string.Format(result.ToString());
                        try
                        {
                            if (model.Id > 0 && response.status)
                            {
                                var usrs = GlobalUTIL.getMobileUsers(Convert.ToInt32(model.OrgId), 0);

                                if (usrs != null && usrs.Any())
                                {
                                    string[] tokens = usrs.Select(x => x.Fmctoken).Distinct().ToArray();
                                    await GlobalUTIL.SendFcmNotificationAsync(string.Format("{0}", model.Name), string.Format("Compaign :{0} created,  start time :{1}, expire time : {2} - Blazor Services", model.Name, model.StartTime, model.FinishTime), tokens);
                                }
                                // string[] arrUsrs = { "ewega2gpKkjajKuYdIUUsi:APA91bGxG1iP0KS8CXd8bWf3RRmi-sLeZ4rAsQBIWrmO2dNMxMdFW6CVeZPiE5z0ELJvhQbjj7-9082XdQ6818hpZ74YJnJwkSxeePMZvxaPZG_lf52S14ky0doS_rB9orKl9PD_xYDm", "e4gSmA_WS1O5OrpZIh-nkl:APA91bEG3EgZcLKRdi1uiQfQSZR-B2qRZaa36FNf6qPS47fu31ELlDzS9D-pfNyAezuTDub6xMG4RdT6srKSjjOvMK-Y7gs2GNZZg94q6itZrRHCra1RXRsakYgz2d_iBgshr5WuQtl4" };
                            }//(model.storeid > 0 && blazorApiResponse.status)
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex.Message);
                        }
                    }
                }
            }// Try
            catch (Exception ex)
            {
                response.status = false;
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return response;

        }

    }
}
