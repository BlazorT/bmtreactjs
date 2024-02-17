
using AutoMapper;
using Blazor.Web.Infrastructure.Repository;
using Blazor.Web.UI.Services;
using com.blazor.dsps.application.interfaces;
using com.blazor.dsps.application.services;
using com.blazor.dsps.authentication;
using com.blazor.dsps.core.interfaces;
using com.blazor.dsps.core.repositories;
using com.blazor.dsps.core.repositries;
using com.blazor.dsps.infrastructure.Logging;
using com.blazor.dsps.infrastructure.repositories;
using com.blazor.dsps.ui.interfaces;
using com.blazor.dsps.ui.services;
using com.blazor.dsps.util;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
//using System.Configuration.ConfigurationManager;

namespace com.blazor.dsps.ui
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            try
            {
                Configuration = configuration;             
             //   logger = logger;
            BlazorConstant.CONNECTION_STRING = GlobalUTIL.Decrypt(Configuration["ConnectionStrings:BlazorDBConnection"], true, BlazorConstant.SECKEY).Replace(@"\\",@"\");
            BlazorConstant.REQUEST_INTERVAL_SECONDS = Convert.ToInt32(Configuration["ReqestIntervalMinSeconds"]);
            BlazorConstant.API_AUTH_KEY = ""+Configuration["APIAUTHKEY"];
            GlobalSettings.DateTimeFormat = string.IsNullOrWhiteSpace("" + Configuration["datetimeformat"]) ? GlobalSettings.DateTimeFormat : "" + Configuration["datetimeformat"];

               // GlobalUTIL.loadGlobalSettings();
               // GlobalUTIL.loadConfigurations();
                //    logger.LogInformation("Service Started succfully at -" + System.DateTime.UtcNow); 
            }
            catch (Exception ex)
            {
              //  logger.LogError(ex.StackTrace);
                
            }
        }

        public IConfiguration Configuration { get; }      

        // This method gets called by the runtime. Use this method to add services to the container.&&65##
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddMemoryCache();
            //services.AddAuthentication("BlazorAuthentication").AddScheme<AuthenticationSchemeOptions, BlazorBasicAuthentication>
            //("BlazorAuthentication", null);
            //services.AddSession(options =>
            //{
            //    options.IdleTimeout = TimeSpan.FromMinutes(90);
            //    options.Cookie.HttpOnly = true;
            //    options.Cookie.IsEssential = true;
            //});

            services.AddAuthentication(BlazorConstant.COOKIES_AUTHENTICATION_KEY)
               .AddCookie(BlazorConstant.COOKIES_AUTHENTICATION_KEY, config =>
               {
                   config.Cookie.Name = "ShowRoomCookieToken"; // Name of cookie   
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

            services.AddControllers().AddXmlSerializerFormatters();
            services.AddControllers()
             .AddJsonOptions(options => {options.JsonSerializerOptions.PropertyNamingPolicy = null;});
            services.AddControllers(options =>
            {
                options.RespectBrowserAcceptHeader = true; // false by default
            });
            services.AddMemoryCache();
            services.AddDistributedMemoryCache();

           
            services.Configure<FormOptions>(options =>
            {
                // Set the limit to 256 MB
                options.MultipartBodyLengthLimit = 268435456;
            });
            services.AddMvc().AddJsonOptions(o =>
            {
                o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase; // ("JSON");// System.Text.Serialization.DefaultNamingStrategy;// Json.Converters.KeyValuePairConverter;
                o.JsonSerializerOptions.DictionaryKeyPolicy = null;
            });
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
           // services.AddMvc(option => option.EnableEndpointRouting = false);
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Latest);

            services.AddDbContext<infrastructure._4dspsContext>(options => options.UseMySQL(BlazorConstant.CONNECTION_STRING).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking), ServiceLifetime.Transient);  //Cannot find UseMysql*
                                                                                                                                                                                                                       // services.AddDbContext<infrastructure._4dspsContext>(options => options.UseMySQL(BlazorConstant.CONNECTION_STRING).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking), ServiceLifetime.Transient);

            ConfigureMVCRunServices(services);// services.AddScoped<IUserService, UserService>();
           // services.AddControllers();
            services.AddHttpContextAccessor();
        }
        private void ConfigureMVCRunServices(IServiceCollection services)
        {
            // Add Core Layer
            services.Configure<core.configurations.BlazorSettings>(Configuration);

            services.AddControllers()
             .AddJsonOptions(options =>
             {
                 options.JsonSerializerOptions
.PropertyNamingPolicy = null;
             });
            services.AddControllers(options =>
            {
                options.RespectBrowserAcceptHeader = true; // false by default
            });
            
            // Add Infrastructure Layer
            //  ConfigureDatabases(services);
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            //services.AddScoped(typeof(IAppLogRepository), typeof(AppLogRepository));
            services.AddScoped(typeof(IStatesRepository), typeof(StatesRepository));
            services.AddScoped(typeof(IUsersRepository), typeof(UsersRepository));
            //services.AddScoped(typeof(ICitiesRepository), typeof(CitiesRepository));
            services.AddScoped(typeof(IOnlineUsersRepository), typeof(OnlineUsersRepository));
            services.AddScoped(typeof(INotificationsRepository), typeof(NotificationsRepository));
            services.AddScoped(typeof(IMediaContentRepository), typeof(MediaContentRepository));
            // Repositry
            services.AddScoped<IVehiclesRepository, VehiclesRepository>();
            //services.AddScoped<IStatesRepository, StatesRepository>();
            //services.AddScoped<IConfigurationsRepository, ConfigurationsRepository>();
            services.AddScoped<IDspRepository, DspRepository>();
            //services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
           
            // services.AddScoped<IOnlineUsersRepository, OnlineUsersRepository>();
            //services.AddScoped(typeof(IAppLogger<>), typeof(LoggerAdapter<>));
            //services.AddScoped(typeof(IVehicleComparisionRepository), typeof(VehicleComparisionRepository));
            //services.AddScoped(typeof(IVehicleAutoTransactionRepository), typeof(VehicleAutoTransactionRepository));
            //services.AddScoped(typeof(IAutoSellPurchaseRequestRepository), typeof(AutoSellPurchaseRequestRepository));
            //services.AddScoped(typeof(IMediaContentRepository), typeof(MediaContentRepository));
            //services.AddScoped(typeof(ICurrenciesRepository), typeof(CurrenciesRepository));
            // Add Application Layer
            //services.AddScoped(typeof(IAppLogService), typeof(AppLogService));
            services.AddScoped(typeof(IStatesService), typeof(StatesService));
            //services.AddScoped(typeof(ICountryService), typeof(CitiesService));
            services.AddScoped(typeof(INotificationService), typeof(NotificationService));
            services.AddScoped(typeof(IOnlineUsersService), typeof(OnlineUsersService));
            //services.AddScoped(typeof(IConfigurationsService), ConfigurationsService);// typeof(ConfigurationService));
            services.AddScoped<IConfigurationsService, ConfigurationsService>();
            services.AddScoped<IVehiclesService, VehiclesService>();
            services.AddScoped<IMediaContentService, MediaContentService>();
            services.AddScoped<IDspService, DspService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IUsersService, UsersService>();
            //services.AddScoped<ICommentReviewService, CommentsReviewService>();
            //services.AddScoped<IVehicleOfferService, VehicleOfferService>();
            //services.AddScoped<IInspectionRequestsService, InspectionRequestsService>();
            //services.AddScoped<IInspectionReportService, InspectionReportService>();
            //services.AddScoped<IVehicleComparisonService, VehicleComparisonService>();
            //services.AddScoped(typeof(IVehicleAutoTransactionService), typeof(VehicleAutoTransactionService));
            //services.AddScoped(typeof(IAutoSellPurchaseRequestService), typeof(AutoSellPurchaseRequestService));
           // s/*ervices.AddScoped(typeof(IMediaContentService), typeof(MediaContentService));*/
            //services.AddScoped(typeof(ICurrenciesService), typeof(CurrenciesService));
            // Add Web Layer
            //services.AddAutoMapper(); // Add AutoMapper
            //services.AddScoped<IAppLogPageService, AppLogPageService>();
            //services.AddScoped<IIndexPageService, IndexPageService>();
            services.AddScoped<IVehiclesPageService, VehiclesPageService>();
            services.AddScoped<IUsersPageService, UsersPageService>();
            services.AddScoped<ICategoryPageService, CategoryPageService>();
            services.AddScoped<IBlazorRepoPageService, BlazorRepoPageService>();
            services.AddScoped<INotificationPageService, NotificationPageService>();
            services.AddScoped<IBlazorUtilPageService, BlazorUtilPageService>();
            services.AddScoped<IEnumPageService, EnumPageService>();
            //services.AddScoped<IUserPageService, UserService>();
            services.AddScoped<IDspPageService, DspPageService>();
            //services.AddScoped<IReviewCommentsPageService, ReviewCommentsPageService>();

            //services.AddScoped<IInspectionReportPageService, InspectionReportPageService>();
            //services.AddScoped<IVehicleComparisonPageService, VehicleComparisonPageService>();
            services.AddScoped<IAuthorizationHandler, RolesAuthorizationHandler>();
            //Response
            services.AddResponseCompression();
            // Add Miscellaneous
            services.AddHttpContextAccessor();

        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //else
            //{
            //    app.UseExceptionHandler("/Home/Error");
            //    app.UseHsts();
            //}
            //app.UseStatusCodePages();
            //app.UseHttpsRedirection();
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()); // allow credentials
           
            
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                //Stores
                
                endpoints.MapControllerRoute(name: "MobileAppUser",
                pattern: "BlazorApi/{*mobileappuser}",
                defaults: new { controller = "BlazorApi", action = "MobileAppUser" });

                endpoints.MapControllerRoute(name: "GetStores",
             pattern: "BlazorApi/{*MyStores}",
             defaults: new { controller = "BlazorApi", action = "GetStores" });

                endpoints.MapControllerRoute(name: "GetDAUsers",
             pattern: "BlazorApi/{*das}",
             defaults: new { controller = "BlazorApi", action = "GetDAUsers" });

                endpoints.MapControllerRoute(name: "UpdateDAUser",
             pattern: "BlazorApi/{*updateda}",
             defaults: new { controller = "BlazorApi", action = "UpdateDAUser" });

                endpoints.MapControllerRoute(name: "GetDspsListAsync",
                pattern: "BlazorApi/{*dsps}",
                defaults: new { controller = "BlazorApi", action = "GetDspsListAsync" });

                //     endpoints.MapControllerRoute(name: "getBusinessAgentBalance",
                // pattern: "BlazorApi/{*businessagentbalance}",
                // defaults: new { controller = "BlazorApi", action = "getBusinessAgentBalance" });

                //     endpoints.MapControllerRoute(name: "GetPOSDashboardStats",
                //  pattern: "BlazorApi/{*posdashboard}",
                //  defaults: new { controller = "BlazorApi", action = "GetPOSDashboardStats" });

                //  endpoints.MapControllerRoute(name: "placePayment",
                //  pattern: "BlazorApi/{*payment}",
                //  defaults: new { controller = "BlazorApi", action = "placePayment" });

                //  endpoints.MapControllerRoute(name: "GetProductPriceDetails",
                // pattern: "BlazorApi/{*pricedetail}",
                // defaults: new { controller = "BlazorApi", action = "GetProductPriceDetails" });

                //     endpoints.MapControllerRoute(name: "GetPOSStoreStockStats",
                //  pattern: "BlazorApi/{*posstats}",
                //  defaults: new { controller = "BlazorApi", action = "GetPOSStoreStockStats" });

                //     endpoints.MapControllerRoute(name: "GetStoreLOVS",
                // pattern: "BlazorApi/{*storeLOVS}",
                // defaults: new { controller = "BlazorApi", action = "GetStoreLOVS" });

                //     endpoints.MapControllerRoute(name: "GetPOSBankPayments",
                //pattern: "BlazorApi/{*storepayments}",
                //defaults: new { controller = "BlazorApi", action = "GetPOSBankPayments" });
                //     // Mobile App User
                //     endpoints.MapControllerRoute(name: "beposstores",
                //     pattern: "BlazorApi/{*stores}",
                //     defaults: new { controller = "BlazorApi", action = "beposstores" });

                //     // GET App Users               
                //      endpoints.MapControllerRoute(name: "GetAppUsers",
                //     pattern: "BlazorApi/{*appusers}",
                //     defaults: new { controller = "BlazorApi", action = "GetAppUsers" });
                //     // SALES
                //     endpoints.MapControllerRoute(name: "GetPosDailySales",
                //     pattern: "BlazorApi/{*sales}",
                //     defaults: new { controller = "BlazorApi", action = "GetPosDailySales" });
                //     //
                //     endpoints.MapControllerRoute(name: "UpdateSaleOrder",
                //    pattern: "BlazorApi/{*updateorder}",
                //    defaults: new { controller = "BlazorApi", action = "UpdateSaleOrder" });
                //     // Order
                //     endpoints.MapControllerRoute(name: "placeOrder",
                //    pattern: "BlazorApi/{*order}",
                //    defaults: new { controller = "BlazorApi", action = "placeOrder" });
                //     // Voice Order
                //     endpoints.MapControllerRoute(name: "VoiceOrderUpload",
                //   pattern: "BlazorApi/{*voiceorder}",
                //   defaults: new { controller = "BlazorApi", action = "VoiceOrderUpload" });
                //     // Get Customers
                //     endpoints.MapControllerRoute(name: "GetStoreCustomers",
                //  pattern: "BlazorApi/{*storecustomers}",
                //  defaults: new { controller = "BlazorApi", action = "GetStoreCustomers" });

                //     // Customers
                //     endpoints.MapControllerRoute(name: "RegisterCustomer",
                //  pattern: "BlazorApi/{*storeregistercustomer}",
                //  defaults: new { controller = "BlazorApi", action = "RegisterCustomer" });
                //     // Products
                //     endpoints.MapControllerRoute(name: "GetPosProducts",
                //    pattern: "BlazorApi/{*products}",
                //    defaults: new { controller = "BlazorApi", action = "GetPosProducts" });
                //     endpoints.MapControllerRoute(name: "default",
                //                 pattern: "{controller=BlazorApi}/{action=GetUser}/{id?}");
                //     endpoints.MapControllerRoute(name: "BlazorDefault",
                //                pattern: "{controller=BlazorApi}/{action=authorize}/{UsersViewModel?}");
                //     // Store Products
                //     endpoints.MapControllerRoute(name: "GetStoreProducts",
                //      pattern: "BlazorApi/{*storeproducts}",
                //      defaults: new { controller = "BlazorApi", action = "GetStoreProducts" });

                //     // LOVs
                //     endpoints.MapControllerRoute(name: "GetPOSStoreProducts",
                //      pattern: "BlazorApi/{*posproducts}",
                //      defaults: new { controller = "BlazorApi", action = "GetPOSStoreProducts" });
                //     // Store Users
                //     endpoints.MapControllerRoute(name: "AuthenticateStoreUsers",
                //      pattern: "BlazorApi/{*storeusers}",
                //      defaults: new { controller = "BlazorApi", action = "AuthenticateStoreUsers" });
                //     // Store Preference
                //     endpoints.MapControllerRoute(name: "GetStorePreferences",
                //      pattern: "BlazorApi/{*storepreferences}",
                //      defaults: new { controller = "BlazorApi", action = "GetStorePreferences" });
                // forgot
                //endpoints.MapControllerRoute(name: "forgotPassword",
                // pattern: "BlazorApi/{*forgot}",
                // defaults: new { controller = "BlazorApi", action = "forgotPassword" });               

            });
            
        }
    }
}
