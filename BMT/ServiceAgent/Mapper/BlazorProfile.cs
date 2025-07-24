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
            CreateMap<StateModel, StatesViewModel>();
           
            CreateMap<CountryModel, CountryViewModel>();
          CreateMap<BundlingpackagedetailModel, Bundlingpackagedetail>();
            CreateMap<PackageModel, Package>();
            CreateMap<CityModel, CityViewModel>();
            CreateMap<CompaignModel, CompaignsViewModel>();
            CreateMap<CompaignnetworkModel, CompaignNetworkViewModel>();
            CreateMap<CompaignexecutionscheduleModel, CompaignexecutionscheduleViewModel>();
            CreateMap<CompaignscheduledayModel, CompaignscheduledayViewModel>();
            CreateMap<ConfigurationModel, ConfigurationsViewModel>();
            CreateMap<GlobalnetworkdetailModel, GlobalnetworkdetailViewModel>();
            CreateMap<ApplogModel, AppLogViewModel>();
            CreateMap<OrganizationModel, OrganizationViewModel>();
            CreateMap<AuditLogModel, AuditLogViewModel>();
            CreateMap<NotificationModel, NotificationViewModel>();          
            CreateMap<ConfigurationsViewModel, ConfigurationModel>();
            CreateMap<OrganizationViewModel, OrganizationModel>();
            CreateMap<AppLogViewModel, ApplogModel>();
            CreateMap<AuditLogViewModel, AuditLogModel>();
            CreateMap<UserViewModel, UserModel>();           
            CreateMap<MediacontentModel, MediacontentViewModel>();
            CreateMap<BundlingpackagedetailModel, BundlingpackagedetailViewModel>();
            CreateMap<PackageModel, PackageViewModel>();
            CreateMap<MediacontentViewModel, MediacontentModel>();
            CreateMap<NotificationViewModel, NotificationModel>();
            // CreateMap<DspViewModel, DspModel>();
        }

    }
    public class BlazorServiceProfile : Profile
    {
        public BlazorServiceProfile()
        {
            CreateMap<User, UserModel>().ReverseMap();
            CreateMap<Applog, ApplogModel>().ReverseMap();
            CreateMap<Auditlog, AuditLogModel>().ReverseMap();
            CreateMap<Globalnetworkdetail, GlobalnetworkdetailModel>().ReverseMap();
            CreateMap<Organization, OrganizationModel>().ReverseMap(); //;           
            CreateMap<Onlineuser, OnlineuserModel>().ReverseMap();
            CreateMap<UserModel, UserViewModel>().ReverseMap();
            CreateMap<Country, CountryModel>().ReverseMap();
            CreateMap<State, StateModel>().ReverseMap();
            CreateMap<City, CityModel>().ReverseMap();

            CreateMap<Configuration, ConfigurationModel>().ReverseMap();
            // Compaign
            CreateMap<Compaign, CompaignModel>().ReverseMap();
            CreateMap<Compaignnetwork, CompaignnetworkModel>().ReverseMap();
            CreateMap<Compaignexecutionschedule, CompaignexecutionscheduleModel>();
            CreateMap<Compaignscheduleday, CompaignscheduledayModel>();
           CreateMap<Bundlingpackagedetail, BundlingpackagedetailModel>().ReverseMap();
            CreateMap<Package, PackageModel>().ReverseMap();

            CreateMap<Mediacontent, MediacontentModel>().ReverseMap();
            CreateMap<Notification, NotificationModel>().ReverseMap();                    

            CreateMap<Auditentity, AuditentityModel>().ReverseMap();
            CreateMap<Menu, MenuModel>().ReverseMap();
            CreateMap<Rolemenu, RolemenuModel>().ReverseMap();
           // CreateMap<Notification, RolemenuModel>().ReverseMap();

        }
    }
}
