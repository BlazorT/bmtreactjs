using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Blazor.Web.Core.Repositories;
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class BundlingPackagesService : IBundlingPackageService
    {
        private readonly IBundlingPackageRepository _BundlingPackageRepository;
        private readonly IAppLogger<BundlingPackagesService> _logger;
        private readonly IMapper _mapper;
        public BundlingPackagesService(IBundlingPackageRepository BundlingPackageRepository, IMapper mapper, IAppLogger<BundlingPackagesService> logger)
        {
            _BundlingPackageRepository = BundlingPackageRepository ?? throw new ArgumentNullException(nameof(BundlingPackageRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        //Task<PackageModel> GetPackageByIdAsync(int Id);
        //Task<IEnumerable<PackageModel>> GetPackagesList(string details);

        public async Task<IEnumerable<BundlingpackagedetailViewModel>> GetBundlingPackagesByStatusList(int status)
        {
            var list = await _BundlingPackageRepository.GetBundlingPackagesListByStatusAsync(status);          
            var mapped = _mapper.Map<IEnumerable<BundlingpackagedetailViewModel>>(list);
            return mapped;
        }
        public async Task<BundlingpackagedetailModel> GetBundlingPackageByIdAsync(Int64 Id)
        {
            var mdl = await _BundlingPackageRepository.GetBundlingPackageByIdAsync(Id);
            var mapped = _mapper.Map<BundlingpackagedetailModel>(mdl);
            return mapped;
        }
        public async Task<IEnumerable<BundlingpackagedetailViewModel>> GetBundlingPackageByNetWorkIdAsync(int netWorkId)
        {
            var list = await _BundlingPackageRepository.GetBundlingPackageByNetworkIdAsync(netWorkId);
            var mapped = _mapper.Map<IEnumerable<BundlingpackagedetailViewModel>>(list);
            return mapped;
        }
        //Task<PackageModel> Update(PackageModel model)
        public async Task<BundlingpackagedetailViewModel> Update(BundlingpackagedetailViewModel model)
        {
            //await ValidateEntityIfExist(userModel);

            var edit = await _BundlingPackageRepository.GetBundlingPackageByIdAsync(Convert.ToInt64(model.Id));
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<BundlingpackagedetailModel>(model);

            await _BundlingPackageRepository.UpdateAsync(edit );
            _logger.LogInformation($"Entity successfully updated - BundlingPackageService");
            return model;
        }
    }
}
