using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.viewmodels;


namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class GlobalNetworkDetailService : IGlobalNetworkDetailService
    {
        private readonly IGlobalNetworkDetailsRepository _globalNetworkDetailsRepository;
        private readonly IAppLogger<GlobalNetworkDetailService> _logger;
        private readonly IMapper _mapper;
        public GlobalNetworkDetailService(IGlobalNetworkDetailsRepository globalNetworkDetailsRepository, IMapper mapper, IAppLogger<GlobalNetworkDetailService> logger)
        {
            _globalNetworkDetailsRepository = globalNetworkDetailsRepository ?? throw new ArgumentNullException(nameof(globalNetworkDetailsRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }      
        public async Task<IEnumerable<GlobalnetworkdetailViewModel>> GetGlobalNetworkDetailByStatusList(int status)
        {
            var list = await _globalNetworkDetailsRepository.GetGlobalNetworkDetailListByStatusAsync(status);          
            var mapped = _mapper.Map<IEnumerable<GlobalnetworkdetailViewModel>>(list);
            return mapped;
        }
        public async Task<GlobalnetworkdetailViewModel> GetGlobalNetworkDetailByIdAsync(Int64 Id)
        {
            var mdl = await _globalNetworkDetailsRepository.GetGlobalNetworkDetailByIdAsync(Id);
            var mapped = _mapper.Map<GlobalnetworkdetailViewModel>(mdl);
            return mapped;
        }
        public async Task<IEnumerable<GlobalnetworkdetailViewModel>> GetGlobalNetworkDetailByNetWorkIdAsync(int netWorkId)
        {
            var list = await _globalNetworkDetailsRepository.GetGlobalNetworkDetailByNetworkIdAsync(netWorkId);
            var mapped = _mapper.Map<IEnumerable<GlobalnetworkdetailViewModel>>(list);
            return mapped;
        }
        //Task<PackageModel> Update(PackageModel model)
        public async Task<GlobalnetworkdetailViewModel> Update(GlobalnetworkdetailViewModel model)
        {
            //await ValidateEntityIfExist(userModel);

            var edit = await _globalNetworkDetailsRepository.GetGlobalNetworkDetailByIdAsync(model.Id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<GlobalnetworkdetailModel>(model);

            await _globalNetworkDetailsRepository.UpdateAsync(edit );
            _logger.LogInformation($"Entity successfully updated - GlobalNetworkDetailsService");
            return model;
        }
    }
}
