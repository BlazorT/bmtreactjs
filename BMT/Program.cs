using AutoMapper;
using Blazor.Web.Application.Interfaces;
using Blazor.Web.Core.Repositories;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.UI.Services;
using com.blazor.bmt;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.services;
using com.blazor.bmt.authentication;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure.repositories;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.ui.services;
using com.blazor.bmt.util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;
var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

BlazorConstant.CONNECTION_STRING = GlobalUTIL.Decrypt(builder.Configuration["ConnectionStrings:BlazorDBConnection"], true, BlazorConstant.SECKEY).Replace(@"\\", @"\");
BlazorConstant.REQUEST_INTERVAL_SECONDS = Convert.ToInt32(builder.Configuration["ReqestIntervalMinSeconds"]);
BlazorConstant.API_AUTH_KEY = Convert.ToString(builder.Configuration["APIAUTHKEY"]);
BlazorConstant.UPLOAD_WEB_ROOT_UPLOADFOLDER = Convert.ToString(builder.Configuration["UploadImagesPath"]);
GlobalSettings.DateTimeFormat = string.IsNullOrWhiteSpace("" + builder.Configuration["datetimeformat"]) ? GlobalSettings.DateTimeFormat : "" + builder.Configuration["datetimeformat"];
// Add services to the container
services.AddMemoryCache();
services.AddHttpContextAccessor();
services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
services.AddScoped(typeof(IAppLogRepository), typeof(AppLogRepository));
services.AddScoped(typeof(ICompaignRepository), typeof(CompaignRepository));
services.AddScoped(typeof(IStatesRepository), typeof(StatesRepository));
services.AddScoped(typeof(IUsersRepository), typeof(UsersRepository));

//services.AddScoped(typeof(ICitiesRepository), typeof(CitiesRepository));
services.AddScoped(typeof(IOnlineUsersRepository), typeof(OnlineUsersRepository));
services.AddScoped(typeof(INotificationsRepository), typeof(NotificationsRepository));
services.AddScoped(typeof(IMediaContentRepository), typeof(MediaContentRepository));
services.AddScoped(typeof(IOrglicensingRepository), typeof(OrglicensingRepository));
services.AddScoped(typeof(IApprovalRequestRepository), typeof(ApprovalRequestRepository));
services.AddScoped(typeof(IGlobalNetworkDetailsRepository), typeof(GlobalNetworkDetailsRepository));

// Repositry
services.AddScoped<IOrganizationRepository, OrganizationRepository>();
services.AddScoped<IAddressRepository, AddressRepository>();
services.AddScoped<IConfigurationsRepository, ConfigurationsRepository>();
services.AddScoped<ICitiesRepository, CitiesRepository>();
services.AddScoped<IAuditLogRepository, AuditLogRepository>();
services.AddScoped<IGlobalNetworkDetailService, GlobalNetworkDetailService>();
services.AddScoped<IBundlingPackageRepository, BundlingPackageRepository>();
services.AddScoped<IPackageRepository, PackageRepository>();
services.AddScoped<ICampaignTemplateRepository, CampaignTemplateRepository>();
services.AddScoped<ICampaignRecipientsRepository, CampaignRecipientsRepository>();
services.AddScoped<IOrgPackageDetailRepository, OrgPackageDetailRepository>();
services.AddScoped<IContactsAlbumRepository, ContactAlbumsRepository>();
services.AddScoped<IUnsubscriberRepository, UnsubscriberRepository>();
services.AddScoped<ITemplatevariablerRepository, TemplateVariableRepository>();

services.AddScoped(typeof(IAppLogger<>), typeof(com.blazor.bmt.infrastructure.Logging.LoggerAdapter<>));

// ServiceLayer
services.AddScoped(typeof(IAddressService), typeof(AddressService));
services.AddScoped(typeof(IStatesService), typeof(StatesService));
services.AddScoped(typeof(IConfigurationsService), typeof(ConfigurationsService));
//services.AddScoped(typeof(IDsppartnerService), typeof(DsppartnerService));
//services.AddScoped(typeof(IBasicConfigurationsService), typeof(BasicConfigurationsService));
services.AddScoped(typeof(IOnlineUsersService), typeof(OnlineUsersService));
//services.AddScoped(typeof(IMediaContentService), typeof(MediaContentService)); // MediaContentService);// typeof(ConfigurationService));
services.AddScoped<INotificationService, NotificationService>();
//services.AddScoped<IVehiclesService, VehiclesService>();
services.AddScoped<IMediaContentService, MediaContentService>();
services.AddScoped<IOrganizationService, OrganizationService>();
services.AddScoped<ICitiesService, CitiesService>();
services.AddScoped<IUsersService, UsersService>();
services.AddScoped<IAppLogService, AppLogService>();
services.AddScoped<IAuditLogService, AuditLogService>();
services.AddScoped<ICompaignService, CompaignService>();
services.AddScoped<ICampaignTemplateService, CampaignTemplateService>();
services.AddScoped<IPackageService, PackagesService>();
services.AddScoped<ICampaignRecipientService, CampaignRecipientService>();
services.AddScoped<IContactAlbumService, ContactAlbumsService>();
services.AddScoped<IUnsubscriberService, UnsubscriberService>();
services.AddScoped<ITemplatevariableService, TemplateVariablenService>();
services.AddScoped<IOrglicensingService, OrglicensingService>();
services.AddScoped<IApprovalRequestService, ApprovalRequestService>();
// Page Service Layer

services.AddScoped<IAppLogPageService, AppLogPageService>();
//services.AddScoped<IVehiclesPageService, VehiclesPageService>();
services.AddScoped<IUsersPageService, UsersPageService>();
////services.AddScoped<ICategoryPageService, CategoryPageService>();
services.AddScoped<IBlazorRepoPageService, BlazorRepoPageService>();
services.AddScoped<INotificationPageService, NotificationPageService>();
//services.AddScoped<IProductPageService, ProductsPageService>();
services.AddScoped<IBlazorUtilPageService, BlazorUtilPageService>();

services.AddScoped<IOrgPageService, OrgPageService>();
services.AddScoped<IBundlingPackageService, BundlingPackagesService>();
//services.AddScoped(typeof(IInspectionReportPageService), typeof(InspectionReportPageService));
services.AddScoped(typeof(IMediaContentPageService), typeof(MediaContentPageService));
//services.AddScoped(typeof(IPack), typeof(MediaContentPageService));

services.AddScoped<IAuthorizationHandler, RolesAuthorizationHandler>();
services.AddDbContext<com.blazor.bmt.infrastructure._bmtContext>(options => options.UseMySQL(BlazorConstant.CONNECTION_STRING).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking), ServiceLifetime.Transient);  //Cannot find UseMysql*

// Add Authentication
services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(90);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

services.AddAuthentication(BlazorConstant.COOKIES_AUTHENTICATION_KEY)
   .AddCookie(BlazorConstant.COOKIES_AUTHENTICATION_KEY, config =>
   {
       config.Cookie.Name = "DspCookieToken"; // Name of cookie   
       config.LoginPath = "/pages/login"; // Path for the redirect to user login page  
       config.AccessDeniedPath = "/pages/NotFoundError";
       config.ExpireTimeSpan = TimeSpan.FromMinutes(90);
       config.SlidingExpiration = true;
   });
services.AddAuthorization(config =>
{
    config.AddPolicy(BlazorConstant.CORS_POLICY_KEY, policyBuilder =>
    {
        policyBuilder.UserRequireCustomClaim(ClaimTypes.Email);
        policyBuilder.UserRequireCustomClaim(ClaimTypes.DateOfBirth);
    });
});
// Load Default Configurations
GlobalUTIL.loadGlobalSettings();
GlobalUTIL.loadConfigurations(1);
GlobalUTIL.LoadGlobalLookUpCollectionViewModel();
services.AddCors(o => o.AddPolicy("BlazorPolicy", builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
}));

var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfiles(new List<Profile>() { new BlazorProfile(), new BlazorServiceProfile() });
    // mc.AddProfiles(new BlazorProfile(),new BlazorProfile());
});
IMapper mapper = mappingConfig.CreateMapper();
services.AddSingleton(mapper);
builder.Services.AddControllersWithViews();


// BlazorConstant.VOICE_PATH_WITH_WWWROOT = "" + System.Configuration.ConfigurationManager.AppSettings["BlazorConnectionString"].ToString();// Configuration["ReqestIntervalMinSeconds"];
List<string> users = builder.Configuration.GetSection("AppSettings:users").Get<List<string>>();
//UTIL.loadAccounts(users);
//public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
//            WebHost.CreateDefaultBuilder(args)
//                .UseStartup<Startup>();
//UTIL.loadConfigurations();
var app = builder.Build();
//builder.
//com.blazor.bmt._bmtContext db= new com.blazor.bmt._bmtContext();
//var ls  = await db.bmt.ToListAsync();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
//4dspsContext cntxt= new spsContext
//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllers();

//    //Stores

//    endpoints.MapControllerRoute(name: "MobileAppUser",
//    pattern: "BlazorApi/{*mobileappuser}",
//    defaults: new { controller = "BlazorApi", action = "MobileAppUser" });

//    endpoints.MapControllerRoute(name: "GetStores",
// pattern: "BlazorApi/{*MyStores}",
// defaults: new { controller = "BlazorApi", action = "GetStores" });


//    endpoints.MapControllerRoute(name: "GetStoreLOVS",
//pattern: "BlazorApi/{*storeLOVS}",
//defaults: new { controller = "BlazorApi", action = "GetStoreLOVS" });
//    // Mobile App User
//    endpoints.MapControllerRoute(name: "beposstores",
//    pattern: "BlazorApi/{*stores}",
//    defaults: new { controller = "BlazorApi", action = "beposstores" });

//    // GET App Users               
//    endpoints.MapControllerRoute(name: "GetAppUsers",
//   pattern: "BlazorApi/{*appusers}",
//   defaults: new { controller = "BlazorApi", action = "GetAppUsers" });
//    // SALES
//    endpoints.MapControllerRoute(name: "GetPosDailySales",
//    pattern: "BlazorApi/{*sales}",
//    defaults: new { controller = "BlazorApi", action = "GetPosDailySales" });
//    //
//    endpoints.MapControllerRoute(name: "UpdateSaleOrder",
//   pattern: "BlazorApi/{*updateorder}",
//   defaults: new { controller = "BlazorApi", action = "UpdateSaleOrder" });
//    // Order
//    endpoints.MapControllerRoute(name: "placeOrder",
//   pattern: "BlazorApi/{*order}",
//   defaults: new { controller = "BlazorApi", action = "placeOrder" });
//    // Voice Order
//    endpoints.MapControllerRoute(name: "VoiceOrderUpload",
//  pattern: "BlazorApi/{*voiceorder}",
//  defaults: new { controller = "BlazorApi", action = "VoiceOrderUpload" });
//    // Get Customers
//    endpoints.MapControllerRoute(name: "GetStoreCustomers",
// pattern: "BlazorApi/{*storecustomers}",
// defaults: new { controller = "BlazorApi", action = "GetStoreCustomers" });

//    // Customers
//    endpoints.MapControllerRoute(name: "RegisterCustomer",
// pattern: "BlazorApi/{*storeregistercustomer}",
// defaults: new { controller = "BlazorApi", action = "RegisterCustomer" });
//    // Products
//    endpoints.MapControllerRoute(name: "GetPosProducts",
//   pattern: "BlazorApi/{*products}",
//   defaults: new { controller = "BlazorApi", action = "GetPosProducts" });
//    endpoints.MapControllerRoute(name: "default",
//                pattern: "{controller=BlazorApi}/{action=GetUser}/{id?}");
//    endpoints.MapControllerRoute(name: "BlazorDefault",
//               pattern: "{controller=BlazorApi}/{action=authorize}/{UsersViewModel?}");
//    // Store Products
//    endpoints.MapControllerRoute(name: "GetStoreProducts",
//     pattern: "BlazorApi/{*storeproducts}",
//     defaults: new { controller = "BlazorApi", action = "GetStoreProducts" });

//    // LOVs
//    endpoints.MapControllerRoute(name: "GetPOSStoreProducts",
//     pattern: "BlazorApi/{*posproducts}",
//     defaults: new { controller = "BlazorApi", action = "GetPOSStoreProducts" });

//    // Store Users
//    endpoints.MapControllerRoute(name: "AuthenticateStoreUsers",
//     pattern: "BlazorApi/{*storeusers}",
//     defaults: new { controller = "BlazorApi", action = "AuthenticateStoreUsers" });
//    // Store Preference
//    endpoints.MapControllerRoute(name: "GetStorePreferences",
//     pattern: "BlazorApi/{*storepreferences}",
//     defaults: new { controller = "BlazorApi", action = "GetStorePreferences" });

//    // forgot
//    endpoints.MapControllerRoute(name: "forgotPassword",
//     pattern: "BlazorApi/{*forgot}",
//     defaults: new { controller = "BlazorApi", action = "forgotPassword" });
//});
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");


app.MapFallbackToFile("index.html");
app.Run();

