using AutoMapper;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
namespace com.blazor.bmt
{
    public class BlazorProfile : Profile
    {
        public BlazorProfile()
        {
            CreateMap<UserModel, UserViewModel>();
            //CreateMap<DspModel, DspViewModel>();
            //CreateMap<DsppartnerModel, DsppartnerViewModel>();
            CreateMap<StateModel, StatesViewModel>();
            CreateMap<CountryModel, CountryViewModel>();
            //CreateMap<CategoryModel, CategoryViewModel>();
            //CreateMap<ProductModel, ProductViewModel>();
            //CreateMap<InventorydetailModel, Inventorydetailviewmodel>();
            CreateMap<ConfigurationModel, ConfigurationsViewModel>();
           // CreateMap<BasicConfigurationModel, BasicConfigurationViewModel>();
            CreateMap<ApplogModel, AppLogViewModel>();
            CreateMap<AuditLogModel, AuditLogViewModel>();
            CreateMap<NotificationModel, NotificationViewModel>();
            //CreateMap<IntegrationservicesettingModel, IntegrationservicesettingViewModel>();
            //CreateMap<VehicleModel, VehicleViewModel>();
            //CreateMap<VehicleinspectionModel, VehicleinspectionItemViewModel>();
            //CreateMap<InspectionitemModel, InspectionitemViewModel>();
            //CreateMap<InspectionreportModel, InspectionreportViewModel>();
            //CreateMap<WffieldModel, WffieldViewModel>();
            //CreateMap<WorkflowtaskModel, WorkflowtaskViewModel>();
            //CreateMap<DispatchmentModel, DispatchmentViewModel>();

            //CreateMap<FleetrosterplanModel, FleetrosterplanViewModel>();
            //CreateMap<RosterplanModel, RosterplanViewModel>();
            //CreateMap<DspstableModel, DspstableViewModel>();

           // CreateMap<VehicleViewModel, VehicleModel>();
          //  CreateMap<BasicConfigurationViewModel, BasicConfigurationModel>();
            CreateMap<ConfigurationsViewModel, ConfigurationModel>();
            CreateMap<AppLogViewModel, ApplogModel>();
            CreateMap<AuditLogViewModel, AuditLogModel>();
            CreateMap<UserViewModel, UserModel>();
            //CreateMap<ProductViewModel, ProductModel>();
            //CreateMap<Inventorydetailviewmodel, InventorydetailModel>();
            //CreateMap<DsppartnerViewModel, DsppartnerModel>();
            //CreateMap<IntegrationservicesettingViewModel, IntegrationservicesettingModel>();
            //CreateMap<VehicleinspectionItemViewModel, VehicleinspectionModel>();
            //CreateMap<InspectionitemViewModel, InspectionitemModel>();
            //CreateMap<InspectionreportViewModel, InspectionreportModel>();
            //CreateMap<WorkflowtaskViewModel, WorkflowtaskModel>();
            //CreateMap<WffieldViewModel, WffieldModel>();
            //CreateMap<DispatchmentViewModel, DispatchmentModel>();
            CreateMap<MediacontentModel, MediacontentViewModel>();
            CreateMap<MediacontentViewModel, MediacontentModel>();
           // CreateMap<DspViewModel, DspModel>();

            //CreateMap<FleetrosterplanViewModel, FleetrosterplanModel>();
            //CreateMap<RosterplanViewModel, RosterplanModel>();
            //CreateMap<DspstableViewModel, DspstableModel>();
        }

    }
    public class BlazorServiceProfile : Profile
    {
        public BlazorServiceProfile()
        {
            CreateMap<User, UserModel>().ReverseMap();
            CreateMap<Applog, ApplogModel>().ReverseMap();
            CreateMap<Auditlog, AuditLogModel>().ReverseMap();
            //   .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName)).ReverseMap();
           // CreateMap<Vehicle, VehicleModel>().ReverseMap();
            // cfg.CreateMap<VehicleModel, VehicleViewModel>().ReverseMap();
            //CreateMap<Dsppartner, DsppartnerModel>().ReverseMap(); //;
            //CreateMap<Dsp, DspModel>().ReverseMap(); //;
            //CreateMap<Product, ProductModel>().ReverseMap(); //;
            //CreateMap<Integrationservicesetting, IntegrationservicesettingModel>().ReverseMap(); //;
            //CreateMap<Inspectionitem, InspectionitemModel>().ReverseMap(); //;
            //CreateMap<Vehicleinspection, VehicleinspectionModel>().ReverseMap(); //;
            //CreateMap<Inspectionreport, InspectionreportModel>().ReverseMap(); //;
            //CreateMap<Workflowtask, WorkflowtaskModel>().ReverseMap(); //;
            //CreateMap<Wffield, WffieldModel>().ReverseMap(); //;
            //CreateMap<Dispatchment, DispatchmentModel>().ReverseMap(); //;
            CreateMap<Onlineuser, OnlineuserModel>().ReverseMap();
            CreateMap<UserModel, UserViewModel>().ReverseMap();
            CreateMap<Country, CountryModel>().ReverseMap();
            CreateMap<State, StateModel>().ReverseMap();

            CreateMap<Configuration, ConfigurationModel>().ReverseMap();
           // CreateMap<Basicconfiguration, BasicConfigurationModel>().ReverseMap();
            //CreateMap<Vehicle, AutoSellPurchaseRequestModel>().ReverseMap();
            CreateMap<Mediacontent, MediacontentModel>().ReverseMap();
            CreateMap<Notification, NotificationModel>().ReverseMap();
            //CreateMap<Daverification, DaverificationModel>().ReverseMap();
            //CreateMap<Inventorydetail, InventorydetailModel>().ReverseMap();
            ////CreateMap<Dsppartner, DsppartnerModel>().ReverseMap();
            //CreateMap<Category, CategoryModel>().ReverseMap();
            //CreateMap<Verificationmethod, VerificationmethodModel>().ReverseMap();
            //CreateMap<Vehicletype, VehicletypeModel>().ReverseMap();
            //CreateMap<Businesstype, BusinesstypeModel>().ReverseMap();
            //CreateMap<Businessentity, BusinessentityModel>().ReverseMap();
            CreateMap<Auditentity, AuditentityModel>().ReverseMap();
            CreateMap<Menu, MenuModel>().ReverseMap();
            CreateMap<Rolemenu, RolemenuModel>().ReverseMap();
            //CreateMap<Productgroup, ProductgroupModel>().ReverseMap();

            //CreateMap<Fleetrosterplan, FleetrosterplanModel>().ReverseMap();
            //CreateMap<Rosterplan, RosterplanModel>().ReverseMap();

            //CreateMap<Dspstable, DspstableModel>().ReverseMap();
            //CreateMap<Shift, ShiftModel>().ReverseMap();

        }
    }
}
