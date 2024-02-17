using AutoMapper;
using System.Data.Common;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Http.HttpResults;
using com.blazor.bmt.core;
using Microsoft.AspNetCore.Components.Routing;
using System.Security.Cryptography.X509Certificates;
using Org.BouncyCastle.Ocsp;

namespace com.blazor.bmt.ui.services
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
        public async Task<IEnumerable<MenuViewModel>> loadRoleMenus(int roleid) {
            List<MenuViewModel> mls = new List<MenuViewModel>();
            try {
               
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
       
        public async Task<IEnumerable<ReportViewModel>> GetUsersReportData(ReportViewModel resportViewmodel)
        {
            List<ReportViewModel> lst = new List<ReportViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pSubscriberName = new MySqlParameter("@UserName", ""+resportViewmodel.UserName);
                        parameter.Add(pSubscriberName);
                        MySqlParameter SubscriberStatus = new MySqlParameter("@Status ", SqlDbType.Int);
                        SubscriberStatus.Value = resportViewmodel.UserStatus;
                        parameter.Add(SubscriberStatus);
                        MySqlParameter DateFrom = new MySqlParameter("@DateFrom", SqlDbType.DateTime);
                        DateFrom.Value = resportViewmodel.RegistrationTime;
                        parameter.Add(DateFrom);

                        MySqlParameter DateTo = new MySqlParameter("@DateTo", SqlDbType.DateTime);
                        DateTo.Value = resportViewmodel.RegistrationTimeTo;
                        parameter.Add(DateTo);
                        command.CommandText = "spStatsReportData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (System.Data.Common.DbDataReader dr = command.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                //  VehiclesViewModel uvmi = new VehiclesViewModel();
                                // uvmi.id = Convert.ToInt32(dr["Id"]);
                                var sUser = new ReportViewModel
                                {
                                   // Id = Convert.ToInt64(dr["id"]),
                                    NoOfRequest = Convert.ToInt32(dr["TotalRequests"]),
                                    RegistrationTime = Convert.ToDateTime(dr["RegistrationTime"]),
                                    ExpireTime = Convert.ToDateTime(dr["ExpireTime"]),
                                    UserName = "" + (dr["UserName"]),
                                    UserStatusStr = Convert.ToString(dr["UserStatus"]),
                                    UserStatus = Convert.ToInt16(dr["Status"])
                                };
                                lst.Add(sUser);
                            }
                            dr.Close();
                        }


                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst.OrderBy(x => x.UserName).AsQueryable();

        }
        public async Task<IEnumerable<ReportViewModel>> GetVehiclesReportData(ReportViewModel resportViewmodel)
        {
            List<ReportViewModel> lst = new List<ReportViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pKeyword = new MySqlParameter("@keyword", resportViewmodel.keyword);
                        parameter.Add(pKeyword);
                        MySqlParameter SubscriberStatus = new MySqlParameter("@Status ", SqlDbType.Int);
                        SubscriberStatus.Value = resportViewmodel.UserStatus;
                        parameter.Add(SubscriberStatus);
                        MySqlParameter DateFrom = new MySqlParameter("@DateFrom", SqlDbType.DateTime);
                        DateFrom.Value = resportViewmodel.RegistrationTime;
                        parameter.Add(DateFrom);

                        MySqlParameter DateTo = new MySqlParameter("@DateTo", SqlDbType.DateTime);
                        DateTo.Value = resportViewmodel.RegistrationTimeTo;
                        parameter.Add(DateTo);
                        command.CommandText = "spVehiclesStatsReportData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (System.Data.Common.DbDataReader dr = command.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                //  VehiclesViewModel uvmi = new VehiclesViewModel();
                                // uvmi.id = Convert.ToInt32(dr["Id"]);
                                var sUser = new ReportViewModel
                                {
                                    // Id = Convert.ToInt64(dr["id"]),
                                    totalVehicles = Convert.ToInt32(dr["totalVehicles"]),
                                    //RegistrationTime = Convert.ToDateTime(dr["RegistrationTime"]),
                                    availableVehicles = Convert.ToInt32(dr["AvailableVehicles"]),
                                    soldVehicles = Convert.ToInt32(dr["SoldVehicles"]),
                                    head = "" + (dr["showRoomName"]),
                                    //UserStatusStr = Convert.ToString(dr["UserStatus"]),
                                    //UserStatus = Convert.ToInt16(dr["Status"])
                                };
                                lst.Add(sUser);
                            }
                            dr.Close();
                        }


                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst.OrderBy(x => x.head).AsQueryable();

        }
         public async Task<IEnumerable<VehicleViewModel>> GetVehiclesAllAsync(VehicleViewModel vModel)
        {
            List<VehicleViewModel> lst = new List<VehicleViewModel>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        var opt = new JsonSerializerOptions() { WriteIndented = true };
                        string vehiclesFiltersJSON = JsonSerializer.Serialize<VehicleViewModel>(vModel, opt);
                        //  JSON
                        //************************  PARAMETERS*******************************//
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pShowRoomId = new MySqlParameter("@showroomid", SqlDbType.Int);
                        pShowRoomId.Value = vModel.Dspid;
                        parameter.Add(pShowRoomId);
                        //JSON
                        MySqlParameter pFilterJson = new MySqlParameter("@filtersJSON", SqlDbType.NVarChar);
                        pFilterJson.Value = vehiclesFiltersJSON;
                        parameter.Add(pFilterJson);                       
                        command.Parameters.AddRange(parameter.ToArray());
                        command.CommandText = "spGetShowRoomVehicles";
                        command.CommandType = CommandType.StoredProcedure;

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while ( dr.Read())
                            {
                                //  VehiclesViewModel uvmi = new VehiclesViewModel();                            
                               // uvmi.id = Convert.ToInt32(dr["Id"]);
                                var vehicle = new VehicleViewModel
                                {
                                    Id = Convert.ToInt64(dr["id"]),
                                    CategoryId = Convert.ToInt32(dr["categoryId"]),
                                    //showRoomName = ""+dr["showRoomName"],
                                    //currency = "" + dr["currency"],
                                    //MakeDetailId = Convert.ToInt16(dr["make"]),
                                    //CurrencyId = Convert.ToInt16(dr["CurrencyId"]),
                                    //ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]),
                                    //CreatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    //LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    //CreatedBy = Convert.ToInt32(dr["CreatedBy"]),                                    
                                    //Name = "" + (dr["name"]),
                                    //Contact1 = "" + (dr["contact#1"]),
                                    //Color = "" + (dr["color"]),
                                    //images = "" + (dr["Images"]),
                                    //storeimageurl = "" + (dr["storeLogo"]),
                                    //imageurl = "" + (dr["imageurl"]),
                                    //EngineType = "" + (dr["EngineType"]),
                                    //AdType= Convert.ToInt16(dr["AdType"]),
                                    //RatingScore = Convert.ToInt16(dr["RatingScore"]),
                                    //AssembyTypeId = Convert.ToInt16(dr["Assembly_Type"]),
                                    //EngineTypeId = Convert.ToInt16(dr["EngineTypeId"]),
                                    //EngineCapacity = Math.Round(Convert.ToDouble(dr["EngineCapacity"]),1),
                                    //DocChecked = Convert.ToInt16(dr["DocChecked"]),
                                    //IsFixedPrice = Convert.ToInt16(dr["isFixedPrice"]),
                                    //CurrencyName = "" + (dr["CurrencyName"]),
                                    //CityName = "" + (dr["CityName"]),                                   
                                    //CurrencySymbol = "" + (dr["CurrencySymbol"]),
                                    //IsInsured = Convert.ToInt16(dr["IsInsured"]),
                                    //Featured = Convert.ToInt16(dr["Featured"]),
                                    //Transmission = Convert.ToInt16(dr["Transmission"]),
                                    //UploadSource = (Byte)Convert.ToInt16(dr["UploadSource"]),
                                    //InspectionReportId = Convert.ToInt64(dr["InspectionReportId"]),
                                    //InspectionScore = Convert.ToInt32(dr["InspectionScore"]),
                                    //Odo = Convert.ToDouble(dr["ODO"]),
                                    //TypeId = Convert.ToInt16(dr["typeId"]),
                                    //Email = "" + (dr["Email"]),
                                    //AdAllowed = Convert.ToInt16(dr["AdAllowed"]),                                  
                                    //Address = "" + (dr["address"]),
                                    //ViewsCount = Convert.ToInt32(dr["ViewsCount"]),
                                    //LikesCount = Convert.ToInt32(dr["LikesCount"]),
                                    //offersCount = Convert.ToInt32(dr["offersCount"]),
                                    //offers = "" + (dr["vehicleOffers"]),                                    
                                    //Desc = "" + (dr["desc"]),
                                    //PassCode = "" + (dr["passcode"]),
                                    //NumberPlate = "" + (dr["numberplate"]),
                                    //remarks = "" + (dr["remarks"]),
                                    //SoldDate = Convert.ToDateTime(dr["soldDate"]),
                                    //Model = Convert.ToInt32(dr["model"]),
                                    //Condition = Convert.ToInt32(dr["condition"]),
                                    //Demand = Convert.ToDouble(dr["demand"]),
                                    //makename = "" + dr["makename"],
                                    Status = Convert.ToInt16(dr["status"])
                                };
                                lst.Add(vehicle);
                            }
                            dr.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                throw ex;
            }
            return lst.AsQueryable();

        }
        public async Task<VehicleViewModel> GetVehicleDetailsByIDAync(Int64 Id)
        {
            VehicleViewModel vehicle = new VehicleViewModel();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        //************************  PARAMETERS*******************************//
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pVehicleId = new MySqlParameter("@vehicleId", SqlDbType.BigInt);
                        pVehicleId.Value = Id;
                        parameter.Add(pVehicleId);                       
                        command.Parameters.AddRange(parameter.ToArray());
                        command.CommandText = "spWebApiGetVehicleDetail";
                        command.CommandType = CommandType.StoredProcedure;

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                vehicle.Id = Convert.ToInt64(dr["id"]);
                                //vehicle.CategoryId = Convert.ToInt32(dr["categoryId"]);
                                //vehicle.ShowRoomId = Convert.ToInt32(dr["ShowRoomId"]);
                                //vehicle.EngineTypeId = Convert.ToInt32(dr["EngineTypeId"]);
                                //vehicle.TypeId = Convert.ToInt32(dr["typeId"]);
                                //vehicle.make = Convert.ToInt16(dr["make"]);
                                //vehicle.CurrencyId = Convert.ToInt16(dr["CurrencyId"]);
                                //vehicle.MakeDetailId = Convert.ToInt16(dr["makedetailid"]);
                                //vehicle.ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]);
                                //vehicle.CreatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]);
                                //vehicle.LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]);
                                //vehicle.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                                //vehicle.storeimageurl = "" + (dr["storeLogo"]);
                                //vehicle.images = "" + (dr["Images"]);
                                //vehicle.CurrencyName = ""+ (dr["CurrencyName"]);
                                //vehicle.CurrencySymbol = "" + (dr["CurrencySymbol"]);
                                //vehicle.InspectionReportId = Convert.ToInt64(dr["InspectionReportId"]);
                                //vehicle.InspectionScore = Convert.ToInt32(dr["InspectionScore"]);
                                //vehicle.Name = "" + (dr["name"]);
                                //vehicle.Contact1 = "" + (dr["contact#1"]);
                                //vehicle.Color = "" + (dr["color"]);
                                //vehicle.images = "" + (dr["Images"]);
                                vehicle.Address = "" + (dr["address"]);
                                vehicle.Desc = "" + (dr["desc"]);
                                //vehicle.PassCode = "" + (dr["passcode"]);
                                //vehicle.NumberPlate = "" + (dr["numberplate"]);
                                //vehicle.AdType = Convert.ToInt32(dr["AdType"]);
                                //vehicle.remarks = "" + (dr["remarks"]);
                                //vehicle.Email = "" + (dr["email"]);
                                //vehicle.SoldDate = Convert.ToDateTime(dr["soldDate"]);
                                //vehicle.Model = Convert.ToInt32(dr["model"]);
                                //vehicle.Condition = Convert.ToInt32(dr["condition"]);
                                //vehicle.Demand = Convert.ToDouble(dr["demand"]);
                                //vehicle.makename = "" + dr["makename"];
                                //vehicle.Status = Convert.ToInt16(dr["status"]);
                                ////sts.Name stateName,cti.Name cityName ,cti.StateId StateId
                                //vehicle.StateName = "" + dr["stateName"];
                                //vehicle.showRoomName = "" + dr["showRoomName"];
                                //vehicle.CityName = ""+ (dr["cityName"]);
                                //vehicle.StateId = Convert.ToInt16(dr["StateId"]);
                                //vehicle.CityId = Convert.ToInt16(dr["CityId"]);                                
                                //vehicle.DocChecked = Convert.ToInt16(dr["DocChecked"]);
                                //vehicle.AdType = Convert.ToInt16(dr["AdType"]);
                                //vehicle.EngineCapacity = Convert.ToInt16(dr["EngineCapacity"]);                                                         
                                //vehicle.InsuranceExpiry = string.IsNullOrEmpty("" + dr["InsuranceExpiry"])? null: Convert.ToDateTime(dr["InsuranceExpiry"]);
                                //vehicle.Odo = Convert.ToDouble(dr["ODO"]);
                                //vehicle.Transmission = Convert.ToInt32(dr["Transmission"]);
                                //vehicle.IsInsured = Convert.ToInt32(dr["IsInsured"]);
                                //vehicle.IsFixedPrice = Convert.ToInt32(dr["isFixedPrice"]);
                                //vehicle.IsPriceNegotiatale = Convert.ToInt32(dr["isFixedPrice"])==1?0:2;
                                vehicle.WhatsApp = "" + (dr["WhatsApp"]);
                            }
                            dr.Close();
                        }

                    }

                }// Using
            }// Try
            catch (Exception ex)
            {
                throw ex;
            }
            return vehicle;

        }
        [HttpPost]
        public async Task<BlazorApiResponse> UpdateGlobalSettings(BasicConfigurationViewModel model) {
            BlazorApiResponse blazorApiResponse = new BlazorApiResponse();
            try {
                try {
                    //if (uvmr != null) {
                    using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING)) {
                        connection.Open();
                        using (var command = connection.CreateCommand()) {
                            List<MySqlParameter> parameter = new List<MySqlParameter>();
                           //Genral Global Info                            
                            MySqlParameter pDefault_public_user_id = new MySqlParameter("p_DefaultPublicUserId", SqlDbType.Int);
                            pDefault_public_user_id.Value = model.DefaultPublicUserId;
                            parameter.Add(pDefault_public_user_id);
                            MySqlParameter pDefault_ShowRoom_id = new MySqlParameter("p_DefaultShowRoomId", SqlDbType.Int);
                            pDefault_ShowRoom_id.Value = model.DefaultDspid;
                            parameter.Add(pDefault_ShowRoom_id);                            
                            MySqlParameter pLastUpdatedAt = new MySqlParameter("p_UpdatedAt", SqlDbType.DateTime2);
                            pLastUpdatedAt.Value = GlobalUTIL.CurrentDateTime;
                            parameter.Add(pLastUpdatedAt);
                            MySqlParameter pLastUpdatedBy = new MySqlParameter("p_updatedBy", SqlDbType.Int);
                            pLastUpdatedBy.Value = model.LastUpdatedBy;
                            parameter.Add(pLastUpdatedBy);                       
                            MySqlParameter pDefaultShowRoomName = new MySqlParameter("p_DefaultDspName", SqlDbType.NVarChar);
                            pDefaultShowRoomName.Value = "" + model.DefaultDspname;
                            parameter.Add(pDefaultShowRoomName);
                            // EMTP / EMAILS
                            MySqlParameter pSmtpServer = new MySqlParameter("p_SmtpServer", SqlDbType.NVarChar);
                            pSmtpServer.Value = "" + model.SmtpServer;
                            parameter.Add(pSmtpServer);
                            MySqlParameter pSmtpUser = new MySqlParameter("p_SmtpUser", SqlDbType.NVarChar);
                            pSmtpUser.Value = model.SmtpUser;
                            parameter.Add(pSmtpUser);
                            MySqlParameter pSmtpUserPwd = new MySqlParameter("p_SmtpUserPwd", SqlDbType.NVarChar);
                            pSmtpUserPwd.Value = model.SmtpUserPwd;
                            parameter.Add(pSmtpUserPwd);
                            MySqlParameter pSmtpPort = new MySqlParameter("p_SmtpPort", SqlDbType.Int);
                            pSmtpPort.Value = model.Smtpport;
                            parameter.Add(pSmtpPort);
                            MySqlParameter pSSLEnabled = new MySqlParameter("p_SSLEnabled", SqlDbType.TinyInt);
                            pSSLEnabled.Value = model.Sslenabled;
                            parameter.Add(pSSLEnabled);
                            //Proxy
                            MySqlParameter pisProxyEnabled = new MySqlParameter("p_isProxyEnabled", SqlDbType.TinyInt);
                            pisProxyEnabled.Value = model.IsProxyEnabled;
                            parameter.Add(pisProxyEnabled);
                            MySqlParameter pProxy_server = new MySqlParameter("p_proxy_server", SqlDbType.NVarChar);
                            pProxy_server.Value = "" + model.ProxyServer;
                            parameter.Add(pProxy_server);
                            MySqlParameter PProxy_user_pwd = new MySqlParameter("p_proxy_user_pwd", SqlDbType.NVarChar);
                            PProxy_user_pwd.Value = "" + model.ProxyUserPwd;
                            parameter.Add(PProxy_user_pwd);
                            MySqlParameter pProxy_user_name = new MySqlParameter("p_proxy_user_name", SqlDbType.NVarChar);
                            pProxy_user_name.Value = "" + model.ProxyUserName;
                            parameter.Add(pProxy_user_name);
                            
                            //EMAIl
                            MySqlParameter pAdminEmail = new MySqlParameter("p_dsp_admin_email", SqlDbType.NVarChar);
                            pAdminEmail.Value = "" + model.DspAdminEmail;
                            parameter.Add(pAdminEmail);
                           //SMS
                            MySqlParameter pSMSUser = new MySqlParameter("p_sms_service_user", SqlDbType.NVarChar);
                            pSMSUser.Value = model.SmsServiceUser;
                            parameter.Add(pSMSUser);
                            MySqlParameter pSMSPassword = new MySqlParameter("p_sms_password", SqlDbType.NVarChar);
                            pSMSPassword.Value = model.SmsPassword;
                            parameter.Add(pSMSPassword);
                            MySqlParameter pSmsQouta = new MySqlParameter("p_sms_qouta", SqlDbType.BigInt);
                            pSmsQouta.Value = model.SmsQouta;
                            parameter.Add(pSmsQouta);
                            MySqlParameter pSMSServiceURI = new MySqlParameter("p_sms_service_url", SqlDbType.NVarChar);
                            pSMSServiceURI.Value = model.SmsServiceUrl;
                            parameter.Add(pSMSServiceURI);
                            //fcm
                            MySqlParameter pfcmSenderId = new MySqlParameter("p_fcmSenderId", SqlDbType.NVarChar);
                            pfcmSenderId.Value = model.FcmSenderId;
                            parameter.Add(pfcmSenderId);
                            MySqlParameter pfcmSenderKey = new MySqlParameter("p_fcmServerKey", SqlDbType.NVarChar);
                            pfcmSenderKey.Value = model.FcmServerKey;
                            parameter.Add(pfcmSenderKey);
                            //API Key
                            MySqlParameter pApiAuthKey = new MySqlParameter("p_ApiAuthKey", SqlDbType.NVarChar);
                            pApiAuthKey.Value = model.ApiAuthKey;
                            parameter.Add(pApiAuthKey);                          
                            command.CommandText = "spUpdateGlobalSettings";
                            command.CommandType = System.Data.CommandType.StoredProcedure;
                            command.Parameters.AddRange(parameter.ToArray());

                             command.ExecuteScalar();
                            //blazorApiResponse.data = result.ToString();
                            blazorApiResponse.status = true;
                            //blazorApiResponse.message = string.Format(result.ToString());
                           
                        }
                    }

                }
                catch (Exception ex) {
                    _logger.LogError(ex.StackTrace);
                    throw ex;
                }
                //_cache.Set(this.User.Identity.Name + Request.Path, blazorApiResponse.data, System.DateTime.Now.AddSeconds(BlazorConstant.REQUEST_INTERVAL_SECONDS));

            }
            catch (Exception ex) {
                blazorApiResponse.status = false;
                blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;

        }
        
        [HttpPost]
        public async Task<BlazorResponseViewModel> GetDSPDetailedData(DspViewModel model) {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<DspViewModel> ls = new List<DspViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        //  p_DspId int/* =0 */,p_status int/* =0 */,p_name nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */ 
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_DspId = new MySqlParameter("p_DspId", MySqlDbType.Int32);
                        p_DspId.Value = model.Id;
                        parameter.Add(p_DspId);
                        MySqlParameter pstatus = new MySqlParameter("p_stateid", MySqlDbType.Int32);
                        pstatus.Value = Convert.ToInt32(model.StateId);
                        parameter.Add(pstatus);
                        MySqlParameter pBusinessType = new MySqlParameter("p_businesstype", MySqlDbType.Int16);
                        pBusinessType.Value = Convert.ToInt32(model.BusinessTypeId);
                        parameter.Add(pBusinessType);//email, tradename, name, contact
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = ""+model.Name;
                        parameter.Add(pKeyword);                    
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = model.CreatedAt.Year<=1900?GlobalUTIL.CurrentDateTime.AddYears(-1): model.CreatedAt;
                        parameter.Add(pdatefrom);
                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = model.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameter.Add(pDateTo);
                        command.CommandText = "spGetDSPsData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                               
                                // 
                                var inventory = new DspViewModel
                                {
                                    Id = Convert.ToInt32(dr["id"]),
                                    BusinessTypeId = Convert.ToInt32(dr["BusinessTypeId"]),
                                    TradeName = "" + dr["TradeName"],
                                    Name = "" + dr["Name"],
                                    fleet = Convert.ToInt32(dr["fleet"]),                                 
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]),
                                    PartnersCount = Convert.ToInt32(dr["PartnersCount"]),
                                    CreatedBy = Convert.ToInt32(dr["createdBy"]),
                                    IsMainDsp = Convert.ToInt32(dr["isMainDSP"]),
                                    StateId = Convert.ToInt32(dr["stateId"]),
                                    Contact = "" + (dr["contact"]),
                                    businesstype = "" + (dr["BusinessType"]),
                                    Email = "" + (dr["email"]),
                                    WebAddress = "" + (dr["webaddress"]),
                                    Address = "" + (dr["webaddress"]),
                                    LogoPath = "" + (dr["logo"]),
                                    SurfaceAddress = "" + (dr["SurfaceAddress"]),
                                    RowVer = Convert.ToInt16(dr["RowVer"]),
                                    Status = Convert.ToInt32(dr["status"])
                                };
                                ls.Add(inventory);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }
        [HttpPost]
        public async Task<BlazorResponseViewModel> GetVehicleDetailedData(VehicleViewModel model)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<VehicleViewModel> ls = new List<VehicleViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        //  p_DspId int/* =0 */,p_status int/* =0 */,p_name nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */ 
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_Id = new MySqlParameter("p_Id", MySqlDbType.Int64);
                        p_Id.Value = model.Id;
                        parameter.Add(p_Id);
                        MySqlParameter p_DspId = new MySqlParameter("p_DspId", MySqlDbType.Int32);
                        p_DspId.Value = model.Dspid;
                        parameter.Add(p_DspId);
                        MySqlParameter pstateId = new MySqlParameter("p_stateid", MySqlDbType.Int32);
                        pstateId.Value = Convert.ToInt32(model.StateId);
                        parameter.Add(pstateId);
                        MySqlParameter pstatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pstatus.Value = Convert.ToInt32(model.Status);
                        parameter.Add(pstatus);
                        MySqlParameter pOwnerShipType = new MySqlParameter("p_OwnershipTypeId", MySqlDbType.Int16);
                        pOwnerShipType.Value = Convert.ToInt32(model.OwnershipTypeId);
                        parameter.Add(pOwnerShipType);//email, tradename, name, contact
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = "" + model.Name;
                        parameter.Add(pKeyword);
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt;
                        parameter.Add(pdatefrom);
                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = model.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameter.Add(pDateTo);
                        command.CommandText = "spGetVehiclesData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {

                                // 
                                var vhl = new VehicleViewModel
                                {

                                    Id = Convert.ToInt32(dr["id"]),                                   
                                    Address = "" + dr["Address"],
                                    Contact = "" + dr["Contact"],
                                    Name = "" + dr["Name"],
                                    DspName = "" + dr["DspName"],
                                    Remarks = "" + dr["Remarks"],
                                    Code = "" + dr["Code"],
                                    NumberPlate = "" + dr["NumberPlate"],
                                    FleetCode = "" + dr["FleetCode"],
                                    OwnershipTypeId = Convert.ToInt32(dr["OwnershipTypeId"]),
                                    ViolationsCount = Convert.ToInt32(dr["ViolationsCount"]),
                                    // what = "" + dr["Whatsapp"],

                                    CategoryId = Convert.ToInt32(dr["CategoryId"]),
                                    Dspid = Convert.ToInt32(dr["DspId"]),
                                    MakeDetailId = Convert.ToInt32(dr["MakeDetailId"]),
                                    ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"]),


                                    WhatsApp = "" + dr["Whatsapp"],
                                    Model = Convert.ToInt32(dr["Model"]),
                                    Desc = ""+(dr["Desc"]),                                                                  

                                    FleetJoiningDate = Convert.ToDateTime(dr["FleetJoiningDate"]),
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]),
                                    AssignedDaid = Convert.ToInt32(dr["AssignedDAId"]),
                                    HelperDriverId = Convert.ToInt32(dr["HelperDriverId"]),

                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    CreatedBy = Convert.ToInt32(dr["createdBy"]),                                  
                                    StateId = Convert.ToInt32(dr["stateId"]),
                                    stateName = "" + (dr["stateName"]),
                                    OwnershipName = "" + (dr["OwnershipName"]),
                                    RowVer = Convert.ToInt16(dr["RowVer"]),
                                    Status = Convert.ToInt32(dr["status"])
                                };
                                ls.Add(vhl);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }
        public async Task<BlazorResponseViewModel> GetDispatchmentofProductsAndVehiclesData(DispatchmentViewModel model)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<DispatchmentViewModel> ls = new List<DispatchmentViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        //  p_DspId int/* =0 */,p_status int/* =0 */,p_name nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */ 
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_Id = new MySqlParameter("p_Id", MySqlDbType.Int64);
                        p_Id.Value = model.Id;
                        parameter.Add(p_Id);
                        MySqlParameter p_DspId = new MySqlParameter("p_dspid", MySqlDbType.Int32);
                        p_DspId.Value = model.Dspid;
                        parameter.Add(p_DspId);                        
                        MySqlParameter pstatus = new MySqlParameter("p_assignedto", MySqlDbType.Int32);
                        pstatus.Value = Convert.ToInt32(model.AssignedTo);
                        parameter.Add(pstatus);

                        MySqlParameter pIsAssigned = new MySqlParameter("p_isAssigned", MySqlDbType.Int32);
                        pIsAssigned.Value = Convert.ToInt32(model.isAssigned);
                        parameter.Add(pIsAssigned);
                        MySqlParameter pAssignmentType = new MySqlParameter("p_assignmentTypeId", MySqlDbType.Int32);
                        pAssignmentType.Value = Convert.ToInt32(model.AssignmentType);
                        parameter.Add(pAssignmentType);
                        // Zero mean all, 29 Daily Assignment only, 30 Mean One Time Assignment
                        command.CommandText = "spGetDispatchmentDataUpdated";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {   // 
                                var vhl = new DispatchmentViewModel
                                {
                                    //temp.Id,temp.DSPId,temp.itemname,temp.shortcode , temp.AssignedTo ,temp.productDetailId ,temp.VehicleId,AvailableStock,temp.CreatedBy,temp.LastUpdatedBy, temp.LastUpdatedAt,temp.CreatedAt,temp.RowVer, temp.Status, temp.inventoryOf,temp.remarks, temp.AssignedQty,  CONCAT(u.FirstName, ' ', u.LastName, ' ' , UserName) assignedBy
                                    Id = Convert.ToInt32(dr["Id"]),
                                    ProductName = "" + dr["itemname"],
                                    shortcode = "" + dr["shortcode"],
                                    AssignedToName= "" +(dr["assignedBy"]),
                                    AssignedTo = Convert.ToInt32(dr["AssignedTo"]),
                                    Dspid = Convert.ToInt32(dr["DSPId"]),
                                    ProductDetailId = Convert.ToInt32(dr["productDetailId"]),
                                    VehicleId = Convert.ToInt32(dr["VehicleId"]),

                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]),

                                    InventoryOf = Convert.ToInt32(dr["inventoryOf"]),
                                    AvailableQty = Convert.ToInt32(dr["AvailableStock"]),
                                    BusinessEntityId = Convert.ToInt32(dr["BusinessEntityId"]),

                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    CreatedBy = Convert.ToInt32(dr["createdBy"]),                                 
                               
                                    RowVer = Convert.ToInt16(dr["RowVer"]),
                                    Status = Convert.ToInt32(dr["status"]),

                                    Remarks = "" + (dr["remarks"]),
                                    //shortcode = Convert.ToInt32(dr["shortcode"]),
                                    AssignedQty = Convert.ToInt32(dr["AssignedQty"]),
                                };
                                ls.Add(vhl);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }
        public async Task<BlazorResponseViewModel> GetRosterFleetsData(RosterplanViewModel model)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<FleetrosterplanViewModel> ls = new List<FleetrosterplanViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        //  p_Id bigint/* =1 */,p_DspId int/* =0 */,p_rosterid int/* =0 */,p_status int/* =0 */, p_datefrom datetime, p_dateto datetime/* =UTC_TIMESTAMP() */
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_Id = new MySqlParameter("p_Id", MySqlDbType.Int64);
                        p_Id.Value = model.Id;
                        parameter.Add(p_Id);
                        MySqlParameter p_DspId = new MySqlParameter("p_dspid", MySqlDbType.Int32);
                        p_DspId.Value = model.DspId;
                        parameter.Add(p_DspId);
                        MySqlParameter pstatus = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pstatus.Value = Convert.ToInt32(model.Status);
                        parameter.Add(pstatus);

                        MySqlParameter pRosterId = new MySqlParameter("p_rosterid", MySqlDbType.Int64);
                        pRosterId.Value = Convert.ToInt32(model.Id);
                        parameter.Add(pRosterId);

                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt;
                        parameter.Add(pdatefrom);
                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = model.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameter.Add(pDateTo);

                        command.CommandText = "spGetRosterPlanFleetData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {   // 
                                var vhl = new FleetrosterplanViewModel
                                {
                                    //  ifnull(v.stateId,0) stateId,   v.DspId,   ifnull( v.CategoryId,0) CategoryId,  ifnull( v.OwnershipTypeId,0) OwnershipTypeId
                                    Id = Convert.ToInt64(dr["id"]),
                                    RosterId = Convert.ToInt64(dr["RosterId"]),
                                    VehicleName = "" + dr["VehicleName"],
                                    DAUserName = "" + dr["DAUserName"],
                                    Wincode = "" + (dr["vincode"]),
                                    MakeDetailId = Convert.ToInt32(dr["MakeDetailId"]),
                                    RosteredDaid = Convert.ToInt32(dr["RosteredDAId"]),
                                    VehicleId = Convert.ToInt64(dr["VehicleId"]),

                                    Contact = "" + (dr["Contact"]),
                                    Code = "" + (dr["Code"]),
                                    NumberPlate = "" + (dr["NumberPlate"]),
                                    RosterRemarks = "" + (dr["RosterRemarks"]),

                                    stateId = Convert.ToInt32(dr["stateId"]),
                                    // DspId = Convert.ToInt32(dr["DspId"]),
                                    CategoryId = Convert.ToInt32(dr["CategoryId"]),
                                    OwnershipTypeId = Convert.ToInt32(dr["OwnershipTypeId"]),
                                    ScheduleDate = String.IsNullOrWhiteSpace("" + dr["ScheduleDate"]) ? null : Convert.ToDateTime(dr["ScheduleDate"]),
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]), 

                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    CreatedBy = Convert.ToInt32(dr["createdBy"]),

                                    RowVer = Convert.ToInt16(dr["RowVer"]),
                                    Status = Convert.ToInt32(dr["status"])
                                };
                                ls.Add(vhl);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }

        public async Task<BlazorResponseViewModel> GetVehicleInspectionsData(InspectionreportViewModel model) {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<InspectionreportViewModel> ls = new List<InspectionreportViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        //(*/,p_status int/* =0 */, p_datefrom datetime, p_dateto datetime/* =UTC_TIMESTAMP() */)
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_Id = new MySqlParameter("p_Id", MySqlDbType.Int64);
                        p_Id.Value = model.Id;
                        parameter.Add(p_Id);
                   
                        MySqlParameter p_DspId = new MySqlParameter("p_dspid", MySqlDbType.Int32);
                        p_DspId.Value = model.DspId;
                        parameter.Add(p_DspId);

                        MySqlParameter pVehicleId = new MySqlParameter("p_VehicleId", MySqlDbType.Int64);
                        pVehicleId.Value = Convert.ToInt32(model.VehicleId);
                        parameter.Add(pVehicleId);//email, tradename, name, contact

                        MySqlParameter pInspectionTypeId = new MySqlParameter("p_reportTypeId", MySqlDbType.Int32);
                        pInspectionTypeId.Value = Convert.ToInt32(model.reportTypeId);
                        parameter.Add(pInspectionTypeId);//email, tradename, name, contact
                        MySqlParameter pinsepctorId = new MySqlParameter("p_insepctorId", MySqlDbType.Int32);
                        pinsepctorId.Value = Convert.ToInt32(model.InspectedBy);
                        parameter.Add(pinsepctorId);//email, tradename, name, contact

                        MySqlParameter pStatusId = new MySqlParameter("p_status", MySqlDbType.Int32);
                        pStatusId.Value = Convert.ToInt32(model.Status);
                        parameter.Add(pStatusId);//email, tradename, name, contact                   
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt;
                        parameter.Add(pdatefrom);

                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = model.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameter.Add(pDateTo);
                        //p_DspId int/* =1 */,p_category int/* =0 */, p_keyword nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */)
                        command.CommandText = "spGetVehicleInspectionData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                // ifnull(v.ownershiptypeid,0) ownershiptypeid, ifnull(v.makedetailid,0) makedetailid, ot.Name ownershipname, ifnull(v.categoryId,0) categoryId, vt.name categoryname
                                var inventory = new InspectionreportViewModel
                                {
                                    Id = Convert.ToInt64(dr["id"]),
                                   
                                    DspId = Convert.ToInt32(dr["DSPId"]),
                                    InspectorName = "" + dr["InspectorName"],
                                    VehicleWinCode = "" + dr["wincode"],
                                    itemsJson = "" + dr["itemJson"],                                    
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]), 
                                    CreatedBy = Convert.ToInt32(dr["CreatedBy"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]),
                                    VehicleId = Convert.ToInt64(dr["vehicleId"]),
                                    inspectiontype = ""+(dr["reportType"]),
                                    reportTypeId = Convert.ToInt32(dr["reportTypeId"]),
                                    RowVer = Convert.ToInt16(dr["RowVer"]),
                                    Status = Convert.ToInt16(dr["status"]),

                                    categoryId = Convert.ToInt32(dr["categoryId"]),
                                    ownershipname = "" + (dr["ownershipname"]),
                                    categoryname = "" + (dr["categoryname"]),
                                    NumberPlate = "" + (dr["NumberPlate"]),
                                    ownershiptypeid = Convert.ToInt32(dr["ownershiptypeid"]),
                                    makedetailid = Convert.ToInt32(dr["makedetailid"]),
                                    makename = "" + (dr["makename"])

                                };
                                ls.Add(inventory);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }

        public async Task<BlazorResponseViewModel> GetUsersReportData(UserViewModel model)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
               List<UserViewModel> ls = new List<UserViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {                        
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_Id = new MySqlParameter("p_userId", MySqlDbType.Int64);
                        p_Id.Value = model.Id;
                        parameter.Add(p_Id);

                        MySqlParameter p_DspId = new MySqlParameter("p_dspid", MySqlDbType.Int32);
                        p_DspId.Value = model.Dspid;
                        parameter.Add(p_DspId);

                        MySqlParameter pStatusId= new MySqlParameter("p_statusid", MySqlDbType.Int32);
                        pStatusId.Value = Convert.ToInt32(model.Status);
                        parameter.Add(pStatusId);//email, tradename, name, contact

                        MySqlParameter pRoleId = new MySqlParameter("p_RoleId", MySqlDbType.Int32);
                        pRoleId.Value = Convert.ToInt32(model.RoleId);
                        parameter.Add(pRoleId);//email, tradename, name, contact

                        MySqlParameter pKeyWord = new MySqlParameter("p_keyword", MySqlDbType.VarChar);
                        pKeyWord.Value = ""+model.keyword;
                        parameter.Add(pKeyWord);//email, tradename, name, contact                       

                                         
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt;
                        parameter.Add(pdatefrom);

                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = model.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt;
                        parameter.Add(pDateTo);
                        //p_DspId int/* =1 */,p_category int/* =0 */, p_keyword nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */)
                        command.CommandText = "spGetDAUsersReportData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                // picture,idtl.SoldQty, PurchasedQty , LastUpdatedAt ,sss.TotalAvailableStock,sss.TotalSoldStock
                                var usr = new UserViewModel
                                {
                                    Id = Convert.ToInt32(dr["id"]),
                                    UserName = ""+ (dr["UserName"]),
                                    userRole = "" + dr["RoleName"],
                                    Email = "" + dr["Email"], 
                                    CreatedAt = Convert.ToDateTime(dr["doj"]),
                                    LicenseExpiryDate = Convert.ToDateTime(dr["licenseExpiryDate"]),                             
                                   
                                    PrimaryContact = "" + (dr["PrimaryContact"]),
                                
                                    Violations = Convert.ToInt32(dr["Violations"]),
                                    Performance = "" + (dr["performance"]),                                   
                                    Status = Convert.ToInt16(dr["status"])
                                };
                                ls.Add(usr);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }
        public async Task<BlazorResponseViewModel> GetInventoryDetailedDataData(Inventorydetailviewmodel vml) {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<Inventorydetailviewmodel> ls = new List<Inventorydetailviewmodel>();
                                      
                    using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                    {
                        await connection.OpenAsync();
                        using (var command = connection.CreateCommand())
                        {
                            List<MySqlParameter> parameter = new List<MySqlParameter>();                          
                            MySqlParameter p_DspId = new MySqlParameter("p_DspId", MySqlDbType.Int32);
                            p_DspId.Value = vml.Dspid;
                            parameter.Add(p_DspId);
                     
                          MySqlParameter pBusinessentityid = new MySqlParameter("p_businessentityid", MySqlDbType.Int32);
                        pBusinessentityid.Value = Convert.ToInt32(vml.BusinessEntityId);
                        parameter.Add(pBusinessentityid);//email, tradename, name, contact
                        MySqlParameter pCategoryId = new MySqlParameter("p_category", MySqlDbType.Int16);
                        pCategoryId.Value = Convert.ToInt32(vml.CategoryId);
                        parameter.Add(pCategoryId);//email, tradename, name, contact
                        MySqlParameter pProductdetailidd = new MySqlParameter("p_productdetailid", MySqlDbType.Int32);
                        pProductdetailidd.Value = Convert.ToInt32(vml.ProductDetailId);
                        parameter.Add(pProductdetailidd);//email, tradename, name, contact
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = "" + vml.keyword;
                        parameter.Add(pKeyword);
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = vml.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : vml.CreatedAt;
                        parameter.Add(pdatefrom);
                        
                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = vml.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : vml.LastUpdatedAt;
                        parameter.Add(pDateTo);
                        //p_DspId int/* =1 */,p_category int/* =0 */, p_keyword nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */)
                        command.CommandText = "spGetInventoryData";
                            command.CommandType = System.Data.CommandType.StoredProcedure;
                            command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                // picture,idtl.SoldQty, PurchasedQty , LastUpdatedAt ,sss.TotalAvailableStock,sss.TotalSoldStock
                                var inventory = new Inventorydetailviewmodel
                                {
                                    Id = Convert.ToInt64(dr["id"]),
                                    CategoryId = Convert.ToInt32(dr["CategoryId"]),
                                    Dspid = Convert.ToInt32(dr["DSPId"]),
                                    productName = "" + dr["ProductName"],
                                    shortCode = "" + dr["ShortCode"],
                                    manufactureCountryId = Convert.ToInt32(dr["ManufactureCountryId"]),
                                    ProductDetailId = Convert.ToInt32(dr["ProductDetailId"]),
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"]),
                                    SoldQty = Convert.ToInt32(dr["SoldQty"]),
                                    BusinessEntityId = Convert.ToInt32(dr["BusinessEntityId"]),
                                    PurchasedQty = Convert.ToInt32(dr["PurchasedQty"]),
                                    TotalAvailableStock = Convert.ToInt32(dr["TotalAvailableStock"]),

                                    AssignedQty = Convert.ToInt32(dr["AssignedQty"]),
                                    AssignedTo = Convert.ToInt32(dr["AssignedTo"]),

                                    CreatedBy = Convert.ToInt32(dr["CreatedBy"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]),

                                    TotalSoldStock = Convert.ToInt32(dr["TotalSoldStock"]),
                                    picture = "" + (dr["picture"]),
                                    countryName = "" + (dr["countryName"]),
                                    RowVer = Convert.ToInt16(dr["RowVer"]),
                                     Status = Convert.ToInt16(dr["status"])
                                };
                                ls.Add(inventory);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                       blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }
        [HttpPost]
        public async Task<BlazorResponseViewModel> GetDADetailsData(UserViewModel umdl)
        {
            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {
                List<UserViewModel> ls = new List<UserViewModel>();

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        // p_keyword nvarchar(200),p_datefrom datetime, p_dateto datetime/* =UTC_TIMESTAMP() */
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_DspId = new MySqlParameter("p_DspId", MySqlDbType.Int32);
                        p_DspId.Value = umdl.Dspid;
                        parameter.Add(p_DspId);
                        MySqlParameter pRoleId = new MySqlParameter("p_roleid", MySqlDbType.Int32);
                        pRoleId.Value = Convert.ToInt32(umdl.RoleId);
                        parameter.Add(pRoleId);//email, tradename, name, contact
                        MySqlParameter pStateId = new MySqlParameter("p_stateid", MySqlDbType.Int32);
                        pStateId.Value = Convert.ToInt32(umdl.StateId);
                        parameter.Add(pStateId);//email, tradename, name, contact
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = "" + umdl.keyword;
                        parameter.Add(pKeyword);
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = umdl.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : umdl.CreatedAt;
                        parameter.Add(pdatefrom);

                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = umdl.LastUpdatedAt == null ? GlobalUTIL.CurrentDateTime : umdl.LastUpdatedAt;
                        parameter.Add(pDateTo);
                        //p_DspId int/* =1 */,p_category int/* =0 */, p_keyword nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */)
                        command.CommandText = "spGetUsersData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {                          
                                var usr = new UserViewModel
                                {
                                   //  u.VerificationMethod, u.Remarks
                                    Id = Convert.ToInt32(dr["Id"]),                                   
                                    FirstName = "" + dr["FirstName"],
                                    RoleId = Convert.ToInt32(dr["RoleId"]),
                                    MiddleName = "" + dr["MiddleName"],
                                    DspName = "" + dr["DspName"],
                                    LastName = "" + dr["LastName"],
                                    Email = "" + dr["Email"],
                                    UserId = "" + dr["userId"],                                    
                                    PrimaryContact = "" + dr["PrimaryContact"],
                                    SecondaryContact = "" + dr["SecondaryContact"],
                                    IdentityId = "" + dr["IdentityID"],
                                    StateId = Convert.ToInt32(dr["StateId"]),
                                    Address = "" + dr["Address"],
                                    Avatar = "" + dr["Avatar"],
                                    Password = "" + dr["Password"],
                                    UserName = "" + dr["UserName"],                                   
                                    RegistrationSource = dr["RegistrationSource"] == null ? null : Convert.ToByte(dr["RegistrationSource"]),
                                    HasValidDrivingLicense = dr["HasValidDrivingLicense"] == null ? null : Convert.ToInt16(dr["HasValidDrivingLicense"]),
                                    Status = Convert.ToInt32(dr["Status"]),
                                    Dspid = Convert.ToInt32(dr["DSPID"]),                                 
                                    IssuingStateId = dr["IssuingStateId"] == null ? null : Convert.ToInt32(dr["IssuingStateId"]),                                  
                                    CreatedBy = Convert.ToInt32(dr["CreatedBy"]),
                                    LastUpdatedBy = Convert.ToInt32(dr["LastUpdatedBy"]),
                                    LastUpdatedAt = Convert.ToDateTime(dr["LastUpdatedAt"]),
                                    LicenseNo = "" + (dr["LicenseNo"]),
                                    Dob = dr["DOB"] == null ? null : Convert.ToDateTime(dr["DOB"]) ,//Convert.ToDateTime(dr["DOB"]),
                                    Token = "" + (dr["Token"]),
                                    userRole = "" + (dr["userRole"]),
                                    stateName = "" + (dr["stateName"]),
                                    issuingstate = "" + (dr["issuingstate"]),
                                    CreatedAt=  Convert.ToDateTime(dr["CreatedAt"]),
                                    LicenseIssueDate = dr["licenseIssueDate"] == null ? null : Convert.ToDateTime(dr["licenseIssueDate"]),// Convert.ToDateTime(dr["licenseIssueDate"]),
                                    LicenseExpiryDate = dr["licenseExpiryDate"]==null? null:Convert.ToDateTime(dr["licenseExpiryDate"]),                                   
                                    Ssn = "" + (dr["SSN"]),
                                    VerificationMethod = dr["VerificationMethod"] == null ? null : Convert.ToInt16(dr["VerificationMethod"]),
                                    Remarks = "" + (dr["Remarks"]),
                                    RowVer = Convert.ToInt16(dr["RowVer"])                                  
                                };
                                ls.Add(usr);
                            }
                            dr.Close();
                        }

                        blazorApiResponse.data = ls;
                        blazorApiResponse.status = true;
                        blazorApiResponse.message = string.Format(ls.Count.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                blazorApiResponse.status = false;
                // blazorApiResponse.errorCode = "408";
                blazorApiResponse.message = ex.Message;
                _logger.LogError(ex.StackTrace);
            }
            return blazorApiResponse;
        }
        [HttpPost]
        public async Task<IEnumerable<AppLogViewModel>> GetLogDetailsData(AppLogViewModel vmdl)
        {
            List<AppLogViewModel> ls = new List<AppLogViewModel>();
            try
            {
               

                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        // p_entityid int/* =0 */, p_keyword nvarchar(200),p_datefrom datetime, p_dateto datetime/* =UTC_TIMESTAMP() */
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_DspId = new MySqlParameter("p_DspId", MySqlDbType.Int32);
                        p_DspId.Value = vmdl.Dspid;
                        parameter.Add(p_DspId);
                        MySqlParameter pEnityId = new MySqlParameter("p_entityid", MySqlDbType.Int32);
                        pEnityId.Value = Convert.ToInt32(vmdl.MenuId);
                        parameter.Add(pEnityId);//email, tradename, name, contact
                     
                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = "" + vmdl.keyword;
                        parameter.Add(pKeyword);
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = Convert.ToDateTime(vmdl.LogTime).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : vmdl.LogTime;
                        parameter.Add(pdatefrom);

                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value = vmdl.LogTimeTo == null ? GlobalUTIL.CurrentDateTime : vmdl.LogTimeTo;
                        parameter.Add(pDateTo);
                        //p_DspId int/* =1 */,p_category int/* =0 */, p_keyword nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */)
                        command.CommandText = "spGetLogData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                var usr = new AppLogViewModel
                                {
                                    //  l.Id ,l.logDesc ,u.FirstName , u.LastName ,l.LogTime , b.Name EntityName
                                    Id = Convert.ToInt32(dr["Id"]),
                                    UserName = "" + dr["LastName"]  +  " " + dr["LastName"],
                                    EntityName = "" + dr["EntityName"] ,
                                    LogDesc = "" + dr["LogDesc"],
                                    LogTime = Convert.ToDateTime(dr["LogTime"]),
                                    MachineIp = "" + dr["MachineIP"],
                                    ActionType = Convert.ToByte(dr["ActionType"])    
                                 
                                };
                                ls.Add(usr);
                            }
                            dr.Close();
                        }       

                    }
                }
            }
            catch (Exception ex)
            {               
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return ls;
        }
        public async Task<IEnumerable<AuditLogViewModel>> GetAuditLogDetailsData(AuditLogViewModel vmdl)
        {
            List<AuditLogViewModel> ls = new List<AuditLogViewModel>();
            try
            {


                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        // p_entityid int/* =0 */, p_keyword nvarchar(200),p_datefrom datetime, p_dateto datetime/* =UTC_TIMESTAMP() */
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter p_DspId = new MySqlParameter("p_DspId", MySqlDbType.Int32);
                        p_DspId.Value = vmdl.DspId;
                        parameter.Add(p_DspId);
                        MySqlParameter pEnityId = new MySqlParameter("p_entityid", MySqlDbType.Int32);
                        pEnityId.Value = Convert.ToInt32(vmdl.AuditEntityId);
                        parameter.Add(pEnityId);//email, tradename, name, contact

                        MySqlParameter pKeyword = new MySqlParameter("p_keyword", MySqlDbType.VarChar, 200);
                        pKeyword.Value = "" + vmdl.keyword;
                        parameter.Add(pKeyword);
                        MySqlParameter pdatefrom = new MySqlParameter("p_datefrom", MySqlDbType.DateTime);
                        pdatefrom.Value = Convert.ToDateTime(vmdl.CreatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddDays(-1) : vmdl.CreatedAt;
                        parameter.Add(pdatefrom);

                        MySqlParameter pDateTo = new MySqlParameter("p_dateto", MySqlDbType.DateTime);
                        pDateTo.Value =  GlobalUTIL.CurrentDateTime;
                        parameter.Add(pDateTo);
                        //p_DspId int/* =1 */,p_category int/* =0 */, p_keyword nvarchar(200),p_datefrom date, p_dateto date/* =now(3) */)
                        command.CommandText = "spGetAuditLogData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());

                        using (DbDataReader dr = await command.ExecuteReaderAsync())
                        {
                            while (dr.Read())
                            {
                                var usr = new AuditLogViewModel
                                {
                                    //  al.Id ,al.KeyVallue ,al.OldValue ,al.NewValue ,u.MiddleName , u.LastName ,al.CreatedAt , b.Name EntityName, al.AttributeName, wfs.Name FieldName
                                    Id = Convert.ToInt32(dr["Id"]),
                                    userName = "" + dr["LastName"] + " " + dr["LastName"],
                                    entityName = "" + dr["EntityName"],
                                    AttributeName = "" + dr["AttributeName"],
                                    NewValue = "" + dr["NewValue"],
                                    OldValue = "" + dr["OldValue"],
                                    fieldName = "" + dr["FieldName"],
                                    CreatedAt = Convert.ToDateTime(dr["CreatedAt"])

                                };
                                ls.Add(usr);
                            }
                            dr.Close();
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace);
                throw ex;
            }
            return ls;
        }
        public async Task<LoginViewModel> GetUserVerificationData(LoginViewModel model)
        {
            LoginViewModel login = new LoginViewModel();
            try
            {


                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                        MySqlParameter pEmail = new MySqlParameter("p_email", ("" + model.Email).Contains("@") ? "" + model.Email : string.Empty);
                        parameter.Add(pEmail);
                        MySqlParameter pUserName = new MySqlParameter("p_userName", (string.IsNullOrWhiteSpace(model.userName) && !("" + model.Email).Contains("@") ? model.Email : "" + model.userName));
                        parameter.Add(pUserName);
                        MySqlParameter cred = new MySqlParameter("p_password", model.Password);
                        parameter.Add(cred);
                        command.CommandText = "spPerformUserValidaton";
                        command.CommandType = System.Data.CommandType.StoredProcedure;
                        command.Parameters.AddRange(parameter.ToArray());
                        using (System.Data.Common.DbDataReader reader = command.ExecuteReader())
                        {

                            DataTable dt = new DataTable();
                            dt.Load(reader);

                            var stats = from usr in dt.AsEnumerable()
                                        select new LoginViewModel
                                        {
                                            //u.StoreID, u.Avatar , u.CityId, store.CityId storeCityId, store.LogoPath, store.Contact,store.Email storeEmail,store.Address storeAddress,store.NTNNo,store.TradeName,
                                            Id = Convert.ToInt32(usr["Id"]),
                                            Avatar = "" + usr["Avatar"],
                                            Address = "" + usr["Address"],
                                            FullName = "" + usr["FullName"],
                                            Email = "" + usr["Email"] ,
                                            userName = "" + usr["userName"],
                                            LoginTime = Convert.ToDateTime(usr["LoginTime"]),
                                            UserStatus = Convert.ToInt32(usr["UserStatus"]),
                                            UserContact = "" + usr["Contact"],
                                            AlreadyLoginStatus = Convert.ToInt32(usr["AlreadyLoginStatus"]),
                                            LoginMachineIp = "" + usr["MachineIP"],
                                            UserRole = "" + usr["UserRole"],                                          
                                            DspName = "" + usr["Dspname"],                                          
                                            RoleId = Convert.ToInt32(usr["RoleID"]),
                                            DspId = Convert.ToInt32(usr["DspID"]),                                           
                                            DspLogo = "" + usr["LogoPath"],
                                           // UserCityId = Convert.ToInt32(usr["CityId"]),                                         
                                            DspContact = "" + (usr["Contact"]),                                  
                                            TradeName = "" + usr["TradeName"],                                          
                                            DspStateName = "" + usr["DspStateName"],
                                            DspStateId = Convert.ToInt32(usr["DspStateId"]),
                                            dob = string.IsNullOrWhiteSpace(""+(usr["DOB"]))?null:Convert.ToDateTime(usr["DOB"]),
                                            doj = string.IsNullOrWhiteSpace("" + (usr["doj"])) ? null : Convert.ToDateTime(usr["doj"]),
                                            UserStateName = "" + usr["UserStateName"],
                                            WhatsApp = "" + usr["WhatsApp"],                                      
                                            UserStateId = Convert.ToInt32(usr["UserStateId"]),

                                        };

                            login = stats.FirstOrDefault();


                        }


                    }
                }



            }
            catch (Exception ex)
            {
                throw ex;
            }
            return login;

        }
        [HttpPost]
        public async Task<List<object>> GetDashboardData(int dspId)
        {
            List<object> objLst = new List<object>();
            IEnumerable<DashboardViewModel> DashViewModel = new List<DashboardViewModel>();
            IEnumerable<DashboardTop7EventsViewModal> NewsView = new List<DashboardTop7EventsViewModal>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        List<MySqlParameter> parameter = new List<MySqlParameter>();
                       
                        MySqlParameter pDspId = new MySqlParameter("p_dspId", SqlDbType.Int);
                        pDspId.Value = dspId;
                        parameter.Add(pDspId);                      
                        command.Parameters.AddRange(parameter.ToArray());
                        command.CommandText = "spDashboardData";
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        using (System.Data.Common.DbDataReader reader = command.ExecuteReader())
                        {
                            do
                            {
                                if (reader.Read())
                                {
                                    DataTable dt = new DataTable();
                                    dt.Load(reader);
                                    var stats = from sts in dt.AsEnumerable()
                                                select new DashboardViewModel
                                                {
                                                    DataOfMonth = Convert.ToString(sts["DataOfMonth"]),
                                                    TotalUsers = Convert.ToInt32(sts["TotalSubscribers"]),
                                                    NewUsers = Convert.ToInt32(sts["NewSubscribers"]),
                                                    MonthVehicles = Convert.ToInt32(sts["MonthVehicles"]),
                                                    PercentageIncrease = Math.Round(Convert.ToDouble(sts["PercentageIncrease"]), 2),
                                                };
                                    if (stats != null)
                                        DashViewModel = _mapper.Map<IEnumerable<DashboardViewModel>>(stats);
                                    objLst.Add(DashViewModel);
                                }
                                //reader.NextResult();
                                if (reader.Read())
                                {
                                    DataTable dt = new DataTable();
                                    dt.Load(reader);
                                    var News = from sts in dt.AsEnumerable()
                                               select new DashboardTop7EventsViewModal
                                               {
                                                   id = Convert.ToInt32(sts["id"]),
                                                   dashboardText = Convert.ToString(sts["dashboardText"]),
                                                   CustomerName = Convert.ToString(sts["CustomerName"]),
                                                   date = Convert.ToDateTime(sts["date"])
                                                   //MonthVehicles = Convert.ToInt32(sts["MonthVehicles"]),
                                                   //PercentageIncrease = Math.Round(Convert.ToDouble(sts["PercentageIncrease"]), 2),
                                               };
                                    if (News != null)
                                        NewsView = _mapper.Map<IEnumerable<DashboardTop7EventsViewModal>>(News);
                                    objLst.Add(NewsView);
                                }
                            } while (1 != 1); //while (reader.NextResult());
                            //{
                            //    reader.Close();
                            //}

                        }

                }

                }// Using
            }// Try
            catch (Exception ex)
            {
                throw ex;
            }
            return objLst;

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

        public async Task<BlazorResponseViewModel> updateDispatchments([FromBody] List<DispatchmentCustomViewMode> dlst)
        {

            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {

                try
                {
                    var opt = new JsonSerializerOptions() { WriteIndented = true };
                    string vRightsSON = JsonSerializer.Serialize<IList<DispatchmentCustomViewMode>>(dlst, opt);
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
                            MySqlParameter pJson = new MySqlParameter("p_dispatchmentJSON", MySqlDbType.JSON);
                            pJson.Value = vRightsSON;
                            parameter.Add(pJson);

                            command.CommandText = "spAddUpdateDispatchments";
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
        public async Task<BlazorResponseViewModel> UpdateDADispatchments([FromBody] List<DispatchmentViewModel> dlst)
        {

            BlazorResponseViewModel blazorApiResponse = new BlazorResponseViewModel();
            try
            {

                try
                {
                    var opt = new JsonSerializerOptions() { WriteIndented = true };
                    string vRightsSON = JsonSerializer.Serialize<IList<DispatchmentViewModel>>(dlst, opt);
                    //if (uvmr != null) {
                    using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING))
                    {
                        await connection.OpenAsync();
                        using (var command = connection.CreateCommand())
                        {
                            List<MySqlParameter> parameter = new List<MySqlParameter>();                          
                            MySqlParameter pJson = new MySqlParameter("p_dispatchmentJSON", MySqlDbType.JSON);
                            pJson.Value = vRightsSON;
                            parameter.Add(pJson);

                            command.CommandText = "spAddUpdateDADispatchments";
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
    }
}
