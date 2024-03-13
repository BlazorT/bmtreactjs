using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositries;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class PackagesService : IPackageService
    {
        private readonly IPackageRepository _packageRepository;
        private readonly IAppLogger<PackagesService> _logger;
        private readonly IMapper _mapper;
        public PackagesService(IPackageRepository packageRepository, IMapper mapper, IAppLogger<PackagesService> logger)
        {
            _packageRepository = packageRepository ?? throw new ArgumentNullException(nameof(packageRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        //Task<PackageModel> GetPackageByIdAsync(int Id);
        //Task<IEnumerable<PackageModel>> GetPackagesList(string details);

        public async Task<IEnumerable<PackageModel>> GetPackagesByStatusList(int status)
        {
            var list = await _packageRepository.GetPackagesListByStatusAsync(status);          
            var mapped = _mapper.Map<IEnumerable<PackageModel>>(list);
            return mapped;
        }
        public async Task<PackageModel> GetPackageByIdAsync(int Id)
        {
            var mdl = await _packageRepository.GetPackageListByIdAsync(Id);
            var mapped = _mapper.Map<PackageModel>(mdl);
            return mapped;
        }
        public async Task<IEnumerable<PackageModel>> GetPackagesList(string keyword)
        {
            var lst = await _packageRepository.GetPackagesByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<PackageModel>>(lst);
            return mapped;
        }
        //Task<PackageModel> Update(PackageModel model)
        public async Task<PackageModel> Update(PackageModel model)
        {
            //await ValidateEntityIfExist(userModel);

            var edit = await _packageRepository.GetPackageListByIdAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<PackageModel, Package>(model, edit);

            await _packageRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - DeenScreenUsersService");
            return model;
        }
    }
}
