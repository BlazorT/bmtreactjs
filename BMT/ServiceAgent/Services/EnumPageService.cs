
// Microsoft Namespaces
using AutoMapper;
using System.ComponentModel;
using System.Linq;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;
using com.blazor.bmt.ui.interfaces;

namespace com.blazor.bmt.ui.services
{
    public class EnumPageService : IEnumPageService
    {
       // private readonly IAppLogService _appLogService;     
        private readonly IMapper _mapper;
        private readonly ILogger<EnumPageService> _logger;
        public EnumPageService( IMapper mapper, ILogger<EnumPageService> logger)
        {            
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        public async Task<IEnumerable<EnumViewModel>> GetEnumCollection(UTIL.PARENT_ENUMS enumOption, string IncludeAll)
        {
            List<EnumViewModel> enumList = new List<EnumViewModel>();

            switch (enumOption)
            {
                case UTIL.PARENT_ENUMS.STATUS_USERS:
                    var lst = Enum.GetValues(typeof(UTIL.STATUS_USERS)).Cast<UTIL.STATUS_USERS>().Select(x => x).ToList();
                    enumList = lst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.STATUS_USERS),o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.STATUS_NOTIFICATION:
                    var tlst = Enum.GetValues(typeof(UTIL.STATUS_NOTIFICATION)).Cast<UTIL.STATUS_NOTIFICATION>().Select(x => x).ToList();
                    enumList = tlst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.STATUS_NOTIFICATION), o.ToString())

                    }).ToList();
                    break;               
                case UTIL.PARENT_ENUMS.AD_SOURCE:
                    var adtlst = Enum.GetValues(typeof(UTIL.AD_SOURCE)).Cast<UTIL.AD_SOURCE>().Select(x => x).ToList();
                    enumList = adtlst.Select(o => new EnumViewModel {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.AD_SOURCE), o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.VEHICLE_STATUS:
                    var vinsulst = Enum.GetValues(typeof(UTIL.VEHICLE_STATUS)).Cast<UTIL.VEHICLE_STATUS>().Select(x => x).ToList();
                    enumList = vinsulst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.VEHICLE_STATUS), o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.AUDIT_ENTITIES:
                    var dlst = Enum.GetValues(typeof(UTIL.AUDIT_ENTITIES)).Cast<UTIL.AUDIT_ENTITIES>().Select(x => x).ToList();
                    enumList = dlst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.AUDIT_ENTITIES), o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.AVAILIBILITY_STATUS:
                    var plst = Enum.GetValues(typeof(UTIL.AVAILIBILITY_STATUS)).Cast<UTIL.AVAILIBILITY_STATUS>().Select(x => x).ToList();
                    enumList = plst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.AVAILIBILITY_STATUS), o.ToString())

                    }).ToList();
                    break;             
                case UTIL.PARENT_ENUMS.BUSINESS_ENTITIES:
                    var pCategories = Enum.GetValues(typeof(UTIL.BUSINESS_ENTITIES)).Cast<UTIL.BUSINESS_ENTITIES>().Select(x => x).ToList();
                    enumList = pCategories.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.BUSINESS_ENTITIES), o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.BUSINESS_TYPES:
                    var englst = Enum.GetValues(typeof(UTIL.BUSINESS_TYPES)).Cast<UTIL.BUSINESS_TYPES>().Select(x => x).ToList();
                    enumList = englst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.BUSINESS_TYPES), o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.VEHICLE_CATEGORIES:
                    var vhltypels = Enum.GetValues(typeof(UTIL.VEHICLE_CATEGORIES)).Cast<UTIL.VEHICLE_CATEGORIES>().Select(x => x).ToList();
                    enumList = vhltypels.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.VEHICLE_CATEGORIES), o.ToString())

                    }).ToList();
                    break;
                case UTIL.PARENT_ENUMS.USER_ROLES:
                    var vhlst = Enum.GetValues(typeof(UTIL.USER_ROLES)).Cast<UTIL.USER_ROLES>().Select(x => x).ToList();
                    enumList = vhlst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.USER_ROLES), o.ToString())

                    }).ToList();
                    break;                      
                case UTIL.PARENT_ENUMS.STATUS_ADMIN_USERS:
                    var lstSAU = Enum.GetValues(typeof(UTIL.STATUS_ADMIN_USERS)).Cast<UTIL.STATUS_ADMIN_USERS>().Select(x => x).ToList();
                    enumList = lstSAU.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.STATUS_ADMIN_USERS), o.ToString())

                    }).ToList();
                    break;          
         
                case UTIL.PARENT_ENUMS.TRANSACTION_TYPES:
                    var lstt = Enum.GetValues(typeof(UTIL.TRANSACTION_TYPES)).Cast<UTIL.TRANSACTION_TYPES>().Select(x => x).ToList();
                    enumList = lstt.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(UTIL.TRANSACTION_TYPES), o.ToString())

                    }).ToList();
                    break;
            }

            if (!string.IsNullOrWhiteSpace("" + IncludeAll.Trim())) {
                enumList.Add(new EnumViewModel { id = 0, name = IncludeAll });
            }
            return enumList.OrderBy(p => p.name).ToList();
        }
        private string GetEnumDesciption(Type type,  string mame){
            var memInfo = type.GetMember(mame)[0].GetCustomAttributes(typeof(DescriptionAttribute), false).FirstOrDefault() as DescriptionAttribute;
            //var description= type.GetMember(typeof(enm).GetEnumName(val))[0].GetCustomAttributes(typeof(DescriptionAttribute), false).FirstOrDefault();
            return (memInfo== null ? mame :memInfo.Description );
    }
        
        public async Task<EnumViewModel> GenEnumViewModel(Enum enumOption, int Id)
        {

            
        //Enum.GetValues(typeof(UTIL.COMMON_STATUS)).Cast<UTIL.COMMON_STATUS>().FirstOrDefault().GetType().GetCustomAttributes(typeof(DescriptionAttribute), false)
            var roles = Enum.GetValues(typeof(UTIL.COMMON_STATUS)).Cast<UTIL.COMMON_STATUS>()
        .Select(r => new
        {
            id = (int)r,
            name = ((DescriptionAttribute)r.GetType().GetCustomAttributes(typeof(DescriptionAttribute), false)[0]).Description
        }).ToList();
            //  throw new Exception("Not Implemented");
            return new EnumViewModel { id = roles.FirstOrDefault().id, name = roles.FirstOrDefault().name };
        }
    }
}
