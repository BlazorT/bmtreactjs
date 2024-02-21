using Blazor.Web.Application.Interfaces;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.ViewModels;
// Microsoft Namespaces
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.ComponentModel;
using System.Linq;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.util;


namespace Blazor.Web.UI.Services
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
        public async Task<IEnumerable<EnumViewModel>> GetEnumCollection(PARENT_ENUMS enumOption, string IncludeAll)
        {
            List<EnumViewModel> enumList = new List<EnumViewModel>();

            switch (enumOption)
            {
                case PARENT_ENUMS.STATUS_USERS:
                    var lst = Enum.GetValues(typeof(STATUS_USERS)).Cast<STATUS_USERS>().Select(x => x).ToList();
                    enumList = lst.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(STATUS_USERS),o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.STATUS_BUSINESS_PLAN:
                    var lsts = Enum.GetValues(typeof(STATUS_BUSINESS_PLAN)).Cast<STATUS_BUSINESS_PLAN>().Select(x => x).ToList();
                    enumList = lsts.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(STATUS_BUSINESS_PLAN), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.POST_TYPES:
                    var psts = Enum.GetValues(typeof(POST_TYPES)).Cast<POST_TYPES>().Select(x => x).ToList();
                    enumList = psts.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(POST_TYPES), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.INTERVAL_TYPES:
                    var ITYPES = Enum.GetValues(typeof(INTERVAL_TYPES)).Cast<INTERVAL_TYPES>().Select(x => x).ToList();
                    enumList = ITYPES.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(INTERVAL_TYPES), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.MEDIA_NETWORKS:
                    var MTypesLs = Enum.GetValues(typeof(MEDIA_NETWORKS)).Cast<MEDIA_NETWORKS>().Select(x => x).ToList();
                    enumList = MTypesLs.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(MEDIA_NETWORKS), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.COMMON_STATUS:
                    var lstcs = Enum.GetValues(typeof(COMMON_STATUS)).Cast<COMMON_STATUS>().Select(x => x).ToList();
                    enumList = lstcs.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(COMMON_STATUS), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.PACKAGES:
                    var lstcc = Enum.GetValues(typeof(PACKAGES)).Cast<PACKAGES>().Select(x => x).ToList();
                    enumList = lstcc.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(PACKAGES), o.ToString())

                    }).ToList();
                    break;
                //case UTIL.PARENT_ENUMS.PLANS_APPROVAL_STATUS:
                //    var lstv = Enum.GetValues(typeof(Blazor.Web.UTIL.PLANS_APPROVAL_STATUS)).Cast<Blazor.Web.UTIL.PLANS_APPROVAL_STATUS>().Select(x => x).ToList();
                //    enumList = lstv.Select(o => new EnumViewModel
                //    {
                //        id = (int)o,
                //        name = GetEnumDesciption(typeof(Blazor.Web.UTIL.PLANS_APPROVAL_STATUS), o.ToString())

                //    }).ToList();
                //    break;
                case PARENT_ENUMS.STATUS_ADMIN_USERS:
                    var lstSAU = Enum.GetValues(typeof(STATUS_ADMIN_USERS)).Cast<STATUS_ADMIN_USERS>().Select(x => x).ToList();
                    enumList = lstSAU.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(STATUS_ADMIN_USERS), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.STATUS_NOTIFICATION:
                    var lstn = Enum.GetValues(typeof(STATUS_NOTIFICATION)).Cast<STATUS_NOTIFICATION>().Select(x => x).ToList();
                    enumList = lstn.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(STATUS_NOTIFICATION), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.TRANSACTION_TYPES:
                    var lstt = Enum.GetValues(typeof(TRANSACTION_TYPES)).Cast<TRANSACTION_TYPES>().Select(x => x).ToList();
                    enumList = lstt.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(TRANSACTION_TYPES), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.PAYMENT_METHODS:
                    var lstp = Enum.GetValues(typeof(PAYMENT_METHODS)).Cast<PAYMENT_METHODS>().Select(x => x).ToList();
                    enumList = lstp.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(PAYMENT_METHODS), o.ToString())

                    }).ToList();
                    break;
                //case UTIL.PARENT_ENUMS.DONATION_PACKAGES:
                //    var lstsp = Enum.GetValues(typeof(Blazor.Web.UTIL.DONATION_PACKAGES)).Cast<Blazor.Web.UTIL.DONATION_PACKAGES>().Select(x => x).ToList();
                //    enumList = lstsp.Select(o => new EnumViewModel
                //    {
                //        id = (int)o,
                //        name = GetEnumDesciption(typeof(Blazor.Web.UTIL.DONATION_PACKAGES), o.ToString())

                //    }).OrderByDescending(x=>x.id).ToList();
                //    break;
                case PARENT_ENUMS.USERROLES:
                    var lstur = Enum.GetValues(typeof(USERROLES)).Cast<USERROLES>().Select(x => x).ToList();
                    enumList = lstur.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(USERROLES), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.MESSAGE_RESPONSE_TYPES:
                    var lstmt = Enum.GetValues(typeof(MESSAGE_RESPONSE_TYPES)).Cast<MESSAGE_RESPONSE_TYPES>().Select(x => x).ToList();
                    enumList = lstmt.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(MESSAGE_RESPONSE_TYPES), o.ToString())

                    }).ToList();
                    break;
                case PARENT_ENUMS.LOGIN_ACTIVITY:
                    var lstat = Enum.GetValues(typeof(LOGIN_ACTIVITY)).Cast<LOGIN_ACTIVITY>().Select(x => x).ToList();
                    enumList = lstat.Select(o => new EnumViewModel
                    {
                        id = (int)o,
                        name = GetEnumDesciption(typeof(LOGIN_ACTIVITY), o.ToString())

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
        public async Task<EnumViewModel> GenEnumViewModel(Enum enumOption, int Id){

        //    var roles = Enum.GetValues(typeof(Blazor.Web.UTIL.STATUS)).Cast<Blazor.Web.UTIL.STATUS>()
        //.Select(r => new { id = (int)r, name = ((DescriptionAttribute)r.GetType().GetCustomAttributes(typeof(DescriptionAttribute), false)[0]).Description      
        //}).ToList();
            throw new Exception("Not Implemented");
        }
    }
}
