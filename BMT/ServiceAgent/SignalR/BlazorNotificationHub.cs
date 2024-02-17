using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
using MySql.Data.MySqlClient;

namespace Blazor.Web.UI.SignalR
{
    public  class BlazorNotificationHub:Hub
    {
        
        public async Task BlazorServerMessage(string user, string message)
        {
            await Clients.All.SendAsync("BlazorServerMessage", user, message);
        }
        public BlazorNotificationHub()
        {

            var taskTimer = Task.Factory.StartNew(async () =>
            {
                 GlobalUTIL.benchmarktime = System.DateTime.Now.AddMinutes(-5);
                while (true && Clients != null)
                {
                    List<VehicleViewModel> prdts = new List<VehicleViewModel>();
                    try {
                        //@showroomid int, @status int=0
                        using (MySqlConnection connection = new MySqlConnection(BlazorConstant.CONNECTION_STRING)) {
                            connection.Open();
                            using (var command = connection.CreateCommand()) {
                                List<MySqlParameter> parameter = new List<MySqlParameter>();
                           
                                MySqlParameter pStatus = new MySqlParameter("@status", SqlDbType.Int);
                                pStatus.Value = (int)UTIL.COMMON_STATUS.ACTIVE;
                                parameter.Add(pStatus);

                                MySqlParameter pFromDate = new MySqlParameter("@DateFrom", SqlDbType.DateTime);
                                pFromDate.Value = GlobalUTIL.benchmarktime;
                                parameter.Add(pFromDate);
                           
                                command.CommandText = "spWebVehiclesNotification";
                                command.CommandType = System.Data.CommandType.StoredProcedure;
                                command.Parameters.AddRange(parameter.ToArray());

                                using (DbDataReader dr = await command.ExecuteReaderAsync()) {
                                    while (dr.Read()) {
                                        var vehicle = new VehicleViewModel {
                                            Id = Convert.ToInt64(dr["id"]),
                                           // CategoryId = Convert.ToInt32(dr["categoryId"]),
                                           // ShowRoomId = Convert.ToInt32(dr["ShowRoomId"]),
                                           // EngineTypeId = Convert.ToInt32(dr["EngineTypeId"]),
                                           // Odo = Convert.ToInt64(dr["Odo"]),
                                           // Transmission = Convert.ToInt16(dr["transmission"]),
                                           // make = Convert.ToInt16(dr["make"]),
                                           // MakeDetailId = Convert.ToInt16(dr["makedetailid"]),                                         
                                           //EngineType= "" + (dr["EngineType"]) ,
                                           // CreatedBy = Convert.ToInt32(dr["CreatedBy"]),
                                           // storeimageurl = "" + (dr["storeLogo"]),
                                           // ViewsCount = Convert.ToInt32(dr["ViewsCount"]),
                                           // LikesCount = Convert.ToInt32(dr["LikesCount"]),
                                           // offersCount = Convert.ToInt32(dr["offersCount"]),
                                           // imageurl = "" + (dr["imageurl"]),
                                           // Name = "" + (dr["name"]),
                                           // EngineCapacity = Convert.ToDouble(dr["EngineCapacity"]),
                                           // Contact1 = "" + (dr["contact#1"]),
                                           // Color = "" + (dr["color"]),
                                           // // images = "" + (dr["Images"]),
                                           // CreatedAt  =Convert.ToDateTime(dr["CreatedAt"]),
                                           // Address = "" + (dr["address"]),
                                           // CityName = "" + (dr["CityName"]),
                                           // Desc = "" + (dr["desc"]),
                                           // PassCode = "" + (dr["passcode"]),
                                           // NumberPlate = "" + (dr["numberplate"]),
                                           // remarks = "" + (dr["remarks"]),                                      
                                           // Model = Convert.ToInt32(dr["model"]),
                                           // Condition = Convert.ToInt32(dr["condition"]),
                                           // Demand = Convert.ToDouble(dr["demand"]),
                                           // AssembyTypeId = Convert.ToInt16(dr["Assembly_Type"]),
                                           // RatingScore = Convert.ToInt16(dr["RatingScore"]),
                                           // currency = "" + (dr["currency"]),
                                           // makename = "" + dr["makename"],
                                            Status = Convert.ToInt16(dr["status"])
                                        };
                                        prdts.Add(vehicle);
                                    }//while (dr.Read())

                                    // List<NotificationViewModel> objlist = NotificationDispatcher.GetNotficationInfo();                  
                                    if (prdts.Any()) {
                                        string vehicles = JsonSerializer.Serialize<List<VehicleViewModel>>(prdts);// new VehiclesViewModel { IsPriceNegotiatale = 1, Id = 29023, Name = "Corolla Vehicle", currency = "USD", makename = "Corolla Vehicle", Desc = "Note", EngineTypeId = 1, Color = "White", CityName = "Lahore", EngineType = "Hybrid", Demand = 2908809, Model = 2023, Condition = 4, Transmission = 1, Contact1 = "092422323232", imageurl = @"~/vehicleImages/defaultimage.jpg", Odo = 1290, EngineCapacity = 2700 });
                                       // Send to Users
                                        await Clients.All.SendAsync("BlazorServerMessage", "Blazor Message Hub", vehicles);
                                    }

                                }// using (DbDataReader dr = command.ExecuteReader())

                            }
                        }
                        GlobalUTIL.benchmarktime = System.DateTime.Now;
                    }
                    catch (Exception ex) {
                       // _logger.LogError(ex.StackTrace);
                        throw ex;
                    }
                   
                    //Clients.All.broadcastMessage("Blazor UI From Server");
                    //Delaying by 3 seconds.
                    await Task.Delay(50000);//(5000000);
                }
            },
            TaskCreationOptions.LongRunning);
            // );
        }

    }

    
}