using Blazor.Web.UI.Interfaces;
using AutoMapper;
using System.Data.Common;
using System.Data;
using System.Text.Json;
using com.blazor.bmt.viewmodels;
using System.Data.SqlClient;
using com.blazor.bmt.util;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;

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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameter = new List<SqlParameter>();
                    SqlParameter pOrgId = new SqlParameter("@OrgId", SqlDbType.Int);
                        pOrgId.Value = 0;
                        parameter.Add(pOrgId);               
                    SqlParameter DateFrom = new SqlParameter("@DateFrom", SqlDbType.DateTime);
                    DateFrom.Value = resportViewmodel.CreatedAt;
                    parameter.Add(DateFrom);
                    SqlParameter DateTo = new SqlParameter("@DateTo", SqlDbType.DateTime);
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
        public async Task<IEnumerable<ReportCompaignsViewModel>> GetOrgCompaignsReportData(ReportCompaignsViewModel resportViewmodel)
        {
            IEnumerable<ReportCompaignsViewModel> reportViewModel = new List<ReportCompaignsViewModel>();
            try
            {
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameter = new List<SqlParameter>();
                      
                        SqlParameter pOrganizationId = new SqlParameter("@OrgId", SqlDbType.Int);
                        pOrganizationId.Value = resportViewmodel.OrganizationId;
                        parameter.Add(pOrganizationId);
                        SqlParameter pStatusId = new SqlParameter("@Status", SqlDbType.Int);
                        pStatusId.Value = resportViewmodel.Status==null?0: resportViewmodel.Status;
                        parameter.Add(pStatusId);
                        SqlParameter DateFrom = new SqlParameter("@DateFrom", System.Data.SqlDbType.DateTime);
                        DateFrom.Value = resportViewmodel.CreatedAt;
                        parameter.Add(DateFrom);
                        SqlParameter DateTo = new SqlParameter("@DateTo", System.Data.SqlDbType.DateTime);
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
            IEnumerable<ReportStatsViewModel> reportViewModel = new List<ReportStatsViewModel>();
            try
            {
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameter = new List<SqlParameter>();                  
                        SqlParameter SubscriberStatus = new SqlParameter("@OrgId", SqlDbType.Int);
                        SubscriberStatus.Value = stats.OrgId;
                        parameter.Add(SubscriberStatus);
                        SqlParameter DateFrom = new SqlParameter("@DateFrom", System.Data.SqlDbType.DateTime);
                        DateFrom.Value = stats.CreatedAt;
                        parameter.Add(DateFrom);

                        SqlParameter DateTo = new SqlParameter("@DateTo", System.Data.SqlDbType.DateTime);
                        DateTo.Value = stats.LastUpdatedAt;
                        parameter.Add(DateTo);
                        command.CommandText = "spStatsReportData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            DataTable dt = new DataTable();
                            dt.Load(reader);
                            var statsrs = from sts in dt.AsEnumerable()
                                        select new ReportStatsViewModel
                                        {
                                            MonthName = sts["MName"].ToString(),
                                            TotalCompaigns = Convert.ToInt32(sts["TotalCompaigns"]),
                                            CompletedCompaigns = Convert.ToInt32(sts["CompletedCompaigns"]),
                                            InprogressCompaigns = Convert.ToInt32(sts["InprogressCompaigns"]),
                                            budget = Math.Round(Convert.ToDouble(sts["budget"]), 2),
                                            MonthNo = Convert.ToInt32(sts["MNo"])                                           
                                        };

                            if (stats != null)
                                reportViewModel = _mapper.Map<IEnumerable<ReportStatsViewModel>>(statsrs);
                        }


                    }
                }



            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return reportViewModel.OrderByDescending(x => x.CreatedAt).AsQueryable();

        }
        public async Task<LoginViewModel> GetUserVerificationData(UserViewModel model)
        {
            LoginViewModel login = new LoginViewModel();
            try
            {
             using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameters = new List<SqlParameter>();
                    SqlParameter email = new SqlParameter("@email", model.Email);
                        parameters.Add(email);
                    SqlParameter cred = new SqlParameter("@password", model.Password);
                        parameters.Add(cred);
                        SqlParameter pRoleId = new SqlParameter("@RoleId", SqlDbType.Int);
                        pRoleId.Value = model.RoleId;
                        parameters.Add(pRoleId);
                        SqlParameter pRegistrationSource = new SqlParameter("@RegistrationSource", SqlDbType.Int);
                        pRegistrationSource.Value = model.RegistrationSource;
                        parameters.Add(pRegistrationSource);
                        command.CommandText = "spPerformUserValidaton";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());                    
                        using (DbDataReader reader = command.ExecuteReader())
                        {

                            DataTable dt = new DataTable();
                            dt.Load(reader);

                            var stats = from usr in dt.AsEnumerable()
                                        select new LoginViewModel
                                        {
                                            Id = Convert.ToInt32(usr["ID"]),
                                            FullName = "" + usr["FullName"],
                                            Email = model.Email,
                                            LoginTime = Convert.ToDateTime(usr["LoginTime"]),
                                            UserStatus = Convert.ToInt32(usr["UserStatus"]),
                                            AlreadyLoginStatus = Convert.ToInt32(usr["AlreadyLoginStatus"]),
                                            LoginMachineIp = "" + usr["MachineIP"],
                                            UserRole = "" + usr["UserRole"],
                                            RoleId = Convert.ToInt32(usr["RoleID"])
                                        };

                            login= stats.FirstOrDefault();


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
        //                SqlParameter pkeyword = new SqlParameter("@keyword", "" + name);
        //                parameter.Add(pkeyword);                  
        //                SqlParameter pStatus = new SqlParameter("@status", SqlDbType.Int);
        //                pStatus.Value = status;
        //                parameter.Add(pStatus);
        //                SqlParameter pOrgId = new SqlParameter("@OrgId", SqlDbType.Int);
        //                pOrgId.Value = orgId;
        //                parameter.Add(pOrgId);
        //                SqlParameter pRoleid = new SqlParameter("@RoleId", SqlDbType.Int);
        //                pRoleid.Value = roleId;
        //                parameter.Add(pRoleid);

        //                SqlParameter pUserId = new SqlParameter("@UserId", SqlDbType.Int);
        //                pUserId.Value = UserId;
        //                parameter.Add(pUserId);

        //                //(@keyword varchar(100), @MerchantId int= 0, @SchoolId int= 0, @CategoryId int= 0, @DateFrom Date , @DateTo Date)
        //                SqlParameter pDateFrom = new SqlParameter("@DateFrom", System.Data.SqlDbType.DateTime);
        //                pDateFrom.Value = dtFrom.Year <= 1900?new DateTime(UTIL.GlobalApp.CurrentDateTime.Year,1,1): dtFrom;
        //                parameter.Add(pDateFrom);
        //                SqlParameter pDateTo = new SqlParameter("@DateTo", System.Data.SqlDbType.DateTime);
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //************************  PARAMETERS*******************************//
                        List<SqlParameter> parameter = new List<SqlParameter>();
                        SqlParameter pkeyword = new SqlParameter("@keyword", "" + name);
                        parameter.Add(pkeyword);
                        SqlParameter pUserId = new SqlParameter("@UserId", SqlDbType.Int);
                        pUserId.Value = Convert.ToInt32(userId);
                        parameter.Add(pUserId);
                        SqlParameter pStatus = new SqlParameter("@status", SqlDbType.Int);
                        pStatus.Value = status;
                        parameter.Add(pStatus);
                        SqlParameter pOrgId = new SqlParameter("@OrgId", SqlDbType.Int);
                        pOrgId.Value = OrgId;
                        parameter.Add(pOrgId);
                        SqlParameter pRoleId = new SqlParameter("@RoleId", SqlDbType.Int);
                        pRoleId.Value = roleId;
                        parameter.Add(pRoleId);
                        //(@keyword varchar(100), @MerchantId int= 0, @SchoolId int= 0, @CategoryId int= 0, @DateFrom Date , @DateTo Date)
                        SqlParameter pDateFrom = new SqlParameter("@DateFrom", System.Data.SqlDbType.DateTime);
                        pDateFrom.Value = dtFrom.Year <= 1900 ? new DateTime(GlobalUTIL.CurrentDateTime.Year, 1, 1) : dtFrom;
                        parameter.Add(pDateFrom);
                        SqlParameter pDateTo = new SqlParameter("@DateTo", System.Data.SqlDbType.DateTime);
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
                                uvmi.OrgId = Convert.ToInt32( reader["OrgId"]);
                                // uvmi.SchoolName = "" + reader["SchoolName"];
                                uvmi.RoleName = "" + reader["RoleName"];
                                uvmi.FirstName = "" + reader["FirstName"];
                                uvmi.LastName = "" + reader["LastName"];
                                uvmi.MiddleName = "" + reader["MiddleName"];
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
                                uvmi.Avatar = ""+reader["Avatar"];
                                //uvmi.ZipPostalCode = "" + reader["ZipPostalCode"];
                                uvmi.AddressId = Convert.ToInt32(reader["AddressId"]);
                                uvmi.UserName = ""+ reader["UserName"];                              
                                uvmi.Contact = "" + reader["PhoneNumber"];
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
        public async Task<IEnumerable<NetworkViewModel>>  GetNetworkData(int status=1) {
            List<NetworkViewModel> ls = new List<NetworkViewModel>();
            try {
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING)) {
                    connection.Open();
                    using (var command = connection.CreateCommand()) {
                        //************************  PARAMETERS*******************************//

                        command.CommandText = string.Format("Select [Id] ,[Name],[Description],[CategoryId],[Status],[CreatedBy],[CreatedAt],[LastUpdatedBy],[LastUpdatedAt],[RowVer] from [Networks] with(nolock) where  0= {0} OR Status= {0} ", status) ;
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameters = new List<SqlParameter>();
                        SqlParameter pOrganizationId = new SqlParameter("@OrgId", SqlDbType.Int);
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameters = new List<SqlParameter>();
                        SqlParameter pOrganizationId = new SqlParameter("@OrganizationId", SqlDbType.Int);
                        pOrganizationId.Value = Convert.ToInt32(model.Id);
                        parameters.Add(pOrganizationId);                      
                        SqlParameter pNetworkId = new SqlParameter("@NetworkId", SqlDbType.Int);
                        pNetworkId.Value = (model.NetworkId == null ?0: model.NetworkId)  ;
                        parameters.Add(pNetworkId);
                        SqlParameter pRegistrationDate = new SqlParameter("@RegistrationDate", SqlDbType.Date);
                        pRegistrationDate.Value = model.CreatedAt.Year<=1900?System.DateTime.UtcNow.AddYears(-5): model.CreatedAt;
                        parameters.Add(pRegistrationDate);
                        SqlParameter pStatus = new SqlParameter("@Status", SqlDbType.Int);
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
                                org.IbanorWireTransferId = "" + (reader["IBANOrWireTransferId"]);
                                org.Address = "" + (reader["Address"]);
                                org.Email = "" + (reader["Email"]);
                                org.CurrencyName = Convert.ToString(reader["currencyName"]);
                                org.CityName = Convert.ToString(reader["CityName"]);
                                org.Contact = ""+ reader["Contact"];
                                org.UserName = "" + reader["userName"];  
                                org.CreatedBy = Convert.ToInt32(reader["CreatedBy"]);                         
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameters = new List<SqlParameter>();
                        SqlParameter pOrganizationId = new SqlParameter("@OrganizationId", SqlDbType.Int);
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
                                pkg.APIKeySecret = "" + (reader["APIKeySecret"]);
                                pkg.APIKey = "" + (reader["APIKey"]);
                                pkg.APIURI = "" + (reader["APIURI"]);
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        //@userid int=0, @orgId int=0 ,@status int=0, @name nvarchar(200)='', @networkId int, @DateFrom date= getutcdate, @DateTo
                        List<SqlParameter> parameters = new List<SqlParameter>();
                        SqlParameter pstore = new SqlParameter("@orgId", SqlDbType.Int);
                        pstore.Value = model.OrgId;
                        parameters.Add(pstore);
                        SqlParameter pStatus = new SqlParameter("@status", SqlDbType.Int);
                        pStatus.Value = model.Status;
                        parameters.Add(pStatus);
                        SqlParameter pName = new SqlParameter("@name", SqlDbType.NVarChar);
                        pName.Value = model.Name;
                        parameters.Add(pName);
                        //SqlParameter pNetworkId = new SqlParameter("@networkId", SqlDbType.Int);
                        //pNetworkId.Value = model.NetworkId;
                        //parameters.Add(pNetworkId);
                        SqlParameter pFromDate = new SqlParameter("@DateFrom", SqlDbType.DateTime);
                        pFromDate.Value = model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddMonths(-12) : model.CreatedAt;
                        parameters.Add(pFromDate);
                        SqlParameter pToDate = new SqlParameter("@DateTo", SqlDbType.DateTime);
                        pToDate.Value = model.LastUpdatedAt == null || model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameters.Add(pToDate);

                        SqlParameter pId = new SqlParameter("@Id", SqlDbType.BigInt);
                        pId.Value = Convert.ToInt64(model.Id);
                        parameters.Add(pId);
                        SqlParameter pUserId = new SqlParameter("@userid", SqlDbType.Int);
                        pUserId.Value = Convert.ToInt32(model.LastUpdatedBy);
                        parameters.Add(pUserId);
                        command.CommandText = "spWebApiPOSGetCompaigns";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameters.ToArray());
                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                var compaign = new CompaignsViewModel
                                {
                                    Id = Convert.ToInt64(dr["id"]),
                                    //NetworkId = Convert.ToInt32(dr["NetworkId"]),
                                    OrgId = Convert.ToInt32(dr["OrgId"]),
                                    Name = "" + (dr["CompaignName"]),
                                    OrgName = "" + (dr["orgName"]),                                    
                                    //  ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]),                                            
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    CreatedBy = Convert.ToInt32(dr["CreatedBy"]),
                                    Title = "" + (dr["Compaigntitle"]),
                                    NetworkName = "" + (dr["NetworkName"]),
                                    Description = "" + (dr["CompaignDesc"]),
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
                                    Status = Convert.ToInt16(dr["Status"])
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

                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameters = new List<SqlParameter>();
                        SqlParameter pNetworkId = new SqlParameter("@networkId", SqlDbType.Int);
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
                                mdl.UnitPrice = Convert.ToInt32(sts["UnitPrice"]);
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
        //                SqlParameter Key = new SqlParameter("@Key", "" + vvcm.videoKey);
        //                parameter.Add(Key);

        //                SqlParameter id = new SqlParameter("@Id", SqlDbType.Int);
        //                id.Value = vvcm.id;
        //                parameter.Add(id);

        //                SqlParameter Count = new SqlParameter("@Count", SqlDbType.Int);
        //                Count.Direction = ParameterDirection.Output;
        //                parameter.Add(Count);
        //                SqlParameter ViewCount = new SqlParameter("@ViewCount", SqlDbType.Int);
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

                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "spLoadConfigurationsList";                      
                        SqlParameter pShowRoomId = new SqlParameter("@orgId", SqlDbType.Int);
                        pShowRoomId.Value = orgId;                     
                        command.Parameters.Add(pShowRoomId);
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
                        MySqlParameter pRoleid = new MySqlParameter("p_Roleid", SqlDbType.Int);
                        pRoleid.Value = roleid;
                        parameter.Add(pRoleid);
                        command.CommandText = "spGetMenuesByRoleId";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
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
                
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //@orgId int=0,@NetworksJSON as nvarchar(2000) ='', @UserId int=0
                        SqlParameter pUserId = new SqlParameter("@UserId", SqlDbType.Int);
                        pUserId.Value = UserId;
                        command.Parameters.Add(pUserId);
                        SqlParameter pNetworkSettingsJSON = new SqlParameter("@NetworkSettingsJSON", SqlDbType.NVarChar, 3000);
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
        public async Task<BlazorResponseViewModel> UpdateNetworksData(List<networkidvalues> lst, int UserId)
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
                    NetworkJSON = JsonSerializer.Serialize<List<networkidvalues>>(lst, options);
                }
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //@orgId int=0,@NetworksJSON as nvarchar(2000) ='', @UserId int=0
                        SqlParameter pOrgId = new SqlParameter("@orgId", SqlDbType.Int);
                        pOrgId.Value = 0;
                        command.Parameters.Add(pOrgId);
                        SqlParameter pNetworksJSON = new SqlParameter("@NetworksJSON", SqlDbType.NVarChar);
                        pNetworksJSON.Value = NetworkJSON;
                        command.Parameters.Add(pNetworksJSON);
                        SqlParameter pUserId = new SqlParameter("@UserId", SqlDbType.Int);
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameter = new List<SqlParameter>();
                        SqlParameter pId = new SqlParameter("@id", SqlDbType.Int);
                        pId.Value = model.Id; //model.id;
                        parameter.Add(pId);
                        SqlParameter pStoreId = new SqlParameter("@OrgId", SqlDbType.Int);
                        pStoreId.Value = model.OrgId; //model.storeid;
                        parameter.Add(pStoreId);
                        //  @regsource int=0, @RegistrationType int=0
                        SqlParameter pUsername = new SqlParameter("@username", SqlDbType.NVarChar);
                        pUsername.Value = ""+ model.UserName;  //Contact model.username;
                        parameter.Add(pUsername);
                        SqlParameter pFirstName = new SqlParameter("@firstName", SqlDbType.NVarChar);
                        pFirstName.Value = "" + model.FirstName;  //Contact model.username;
                        parameter.Add(pFirstName);
                        SqlParameter pLastName = new SqlParameter("@lastName", SqlDbType.NVarChar);
                        pLastName.Value = "" + model.LastName;   //Contact model.username;
                        parameter.Add(pLastName);
                        SqlParameter pAuthToken = new SqlParameter("@SecurityToken", SqlDbType.NVarChar);
                        pAuthToken.Value = "" + model.SecurityToken;  //Contact model.username;
                        parameter.Add(pAuthToken);
                        SqlParameter pcontact = new SqlParameter("@contact", SqlDbType.NVarChar);
                        pcontact.Value = "" + model.Contact;  // model.Contact;
                        parameter.Add(pcontact);
                        SqlParameter pPassword = new SqlParameter("@Password", SqlDbType.NVarChar);
                        pPassword.Value = string.IsNullOrWhiteSpace(model.Password) ? string.Empty : GlobalUTIL.Encrypt(System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String("" + model.Password)), true, BlazorConstant.SECKEY);
                        parameter.Add(pPassword);
                        SqlParameter pemail = new SqlParameter("@email", SqlDbType.NVarChar);
                        pemail.Value = "" + model.Email; // "" + model.email;
                        parameter.Add(pemail);

                        SqlParameter pCityId = new SqlParameter("@CityId", SqlDbType.Int);
                        pCityId.Value = 0;
                        parameter.Add(pCityId);
                        SqlParameter pStateId = new SqlParameter("@stateId", SqlDbType.Int);
                        pStateId.Value = 0;// Convert.ToInt32(string.IsNullOrWhiteSpace(HttpContext.Request.Form["stateid"]) ? "0" : HttpContext.Request.Form["stateid"]); //model.StateId == null ? 0 : model.StateId;
                        parameter.Add(pStateId);
                        SqlParameter pCityName = new SqlParameter("@cityName", SqlDbType.NVarChar);
                        pCityName.Value = "" + model.CityName;
                        parameter.Add(pCityName);

                        SqlParameter prole = new SqlParameter("@roleId", SqlDbType.NVarChar);
                        prole.Value = Convert.ToInt32(model.RoleId);  //"" + model.roleid;
                        parameter.Add(prole);
                        SqlParameter pImageName = new SqlParameter("@logoimageName", SqlDbType.NVarChar);
                        pImageName.Value = string.IsNullOrWhiteSpace(model.Avatar) ? "" : model.Avatar;
                        parameter.Add(pImageName);

                        SqlParameter pFMCToken = new SqlParameter("@FMCToken", SqlDbType.NVarChar);
                        pFMCToken.Value = "" ;  //"" + model.fmctoken;
                        parameter.Add(pFMCToken);
                        SqlParameter pIMEI = new SqlParameter("@IMEI", SqlDbType.NVarChar);
                        pIMEI.Value = "" + model.UserCode; // "" + model.IM;
                        parameter.Add(pIMEI);
                        SqlParameter pRegSource = new SqlParameter("@regsource", SqlDbType.Int);
                        pRegSource.Value = model.RegistrationSource;//  model.regsource;
                        parameter.Add(pRegSource);

                        SqlParameter pStatus = new SqlParameter("@status", SqlDbType.Int);
                        pStatus.Value = model.Status; // model.status;
                        parameter.Add(pStatus);
                        SqlParameter pRegistrationType = new SqlParameter("@RegistrationType", SqlDbType.Int);
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
                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<SqlParameter> parameter = new List<SqlParameter>();
                        SqlParameter pId = new SqlParameter("@id", SqlDbType.Int);
                        pId.Value = model.Id;
                        parameter.Add(pId);

                        SqlParameter pRemarks = new SqlParameter("@Remarks", SqlDbType.NVarChar);
                        pRemarks.Value = "" + model.Remarks;
                        parameter.Add(pRemarks);

                        SqlParameter pStatus = new SqlParameter("@status", SqlDbType.Int);
                        pStatus.Value = model.Status;
                        parameter.Add(pStatus);

                        SqlParameter pUserId = new SqlParameter("@UserId", SqlDbType.Int);
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
                string NetworkDetailsJSON = string.Empty;
                string NetworkSchedulesJSON = string.Empty;
                // Networks
                if (model.CompaignNetworks != null && model.CompaignNetworks.Any())
                {
                    List<CompaignNetworkViewModel> ls = model.CompaignNetworks.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                    NetworkDetailsJSON = JsonSerializer.Serialize<List<CompaignNetworkViewModel>>(ls, options);
                }
                if (model.CompaignExecutionSchedules != null && model.CompaignExecutionSchedules.Any())
                {
                    List<CompaignexecutionscheduleViewModel> cdtl = model.CompaignExecutionSchedules.ToList();
                    var options = new JsonSerializerOptions() { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                    NetworkSchedulesJSON = JsonSerializer.Serialize<List<CompaignexecutionscheduleViewModel>>(cdtl, options);
                }

                using (SqlConnection connection = new SqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //  @id,networkId,orgId,Desc,Name,title,HashTags,startTime,finishTime,userId,status @Name nvarchar(100),@title nvarchar(100),@hashtag nvarchar(100),@startTime datetime,@finishTime datetime,@Desc nvarchar(4000), @status int=0
                        List<SqlParameter> parameter = new List<SqlParameter>();
                        SqlParameter pId = new SqlParameter("@id", SqlDbType.Int);
                        pId.Value = model.Id;
                        parameter.Add(pId);
                        //SqlParameter pstore = new SqlParameter("@networkId", SqlDbType.Int);
                        //pstore.Value = model.NetworkId;
                        //parameter.Add(pstore);
                        SqlParameter pmakedetailid = new SqlParameter("@orgId", SqlDbType.Int);
                        pmakedetailid.Value = model.OrgId;
                        parameter.Add(pmakedetailid);
                        SqlParameter pDescription = new SqlParameter("@Desc", SqlDbType.NVarChar);
                        pDescription.Value = "" + model.Description;
                        parameter.Add(pDescription);
                        SqlParameter pName = new SqlParameter("@Name", SqlDbType.NVarChar);
                        pName.Value = "" + model.Name;
                        parameter.Add(pName);
                        SqlParameter pTitle = new SqlParameter("@title", SqlDbType.NVarChar);
                        pTitle.Value = model.Title;
                        parameter.Add(pTitle);
                        SqlParameter pHashtagt = new SqlParameter("@HashTags", SqlDbType.NVarChar);
                        pHashtagt.Value = model.HashTags;
                        parameter.Add(pHashtagt);
                        SqlParameter pNetworkJSON = new SqlParameter("@networksSchedulesJSON", SqlDbType.VarChar);
                        pNetworkJSON.Value = NetworkSchedulesJSON;
                        parameter.Add(pNetworkJSON);
                        SqlParameter pTotalBudget = new SqlParameter("@TotalBudget", SqlDbType.Float);
                        pTotalBudget.Value = (model.TotalBudget == null ? 0 : model.TotalBudget);//.TotalBudget;
                        parameter.Add(pTotalBudget);
                        SqlParameter pDiscount = new SqlParameter("@Discount", SqlDbType.Float);
                        pDiscount.Value = (model.Discount == null ? 0 : model.Discount);
                        parameter.Add(pDiscount);
                        //@HashTags nvarchar(2000)= '',@startTime DATE = GETDATE, @finishTime DATE = GETutcDATE,@userId int= 0, @status  int= 1
                        SqlParameter pCompaignDetails = new SqlParameter("@CompaignDetails", SqlDbType.NVarChar);
                        pCompaignDetails.Value = NetworkDetailsJSON;
                        parameter.Add(pCompaignDetails);
                        SqlParameter pStartTime = new SqlParameter("@startTime", SqlDbType.DateTime);
                        pStartTime.Value = (model.StartTime == null ? GlobalUTIL.CurrentDateTime : model.StartTime);
                        parameter.Add(pStartTime);
                        SqlParameter pFinishTime = new SqlParameter("@finishTime", SqlDbType.DateTime);
                        pFinishTime.Value = (model.FinishTime == null ? GlobalUTIL.CurrentDateTime.AddMonths(1) : model.FinishTime);
                        parameter.Add(pFinishTime);
                        SqlParameter pUserid = new SqlParameter("@userId", SqlDbType.Int);
                        pUserid.Value = model.CreatedBy <= 0 ? model.LastUpdatedBy : model.CreatedBy;
                        parameter.Add(pUserid);
                        SqlParameter pStatus = new SqlParameter("@status", SqlDbType.Int);
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
