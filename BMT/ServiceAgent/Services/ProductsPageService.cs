using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class ProductsPageService : IProductPageService
    {
        private readonly IProductsService _productsService;
        private readonly IAppLogger<ProductsPageService> _logger;
        private readonly IMapper _mapper;
        public ProductsPageService(IProductsService productsService, IMapper mapper, IAppLogger<ProductsPageService> logger)
        {
            _productsService = productsService ?? throw new ArgumentNullException(nameof(productsService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<ProductViewModel>> GetProductsByStatusAsync(int status)
        {
            var list = await _productsService.GetProductsByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<ProductViewModel>>(list);
            return mapped;
        }
          public async Task<IEnumerable<ProductViewModel>> GetProductsList()
        {
            var list = await _productsService.GetProductsByNameAsync("");
            var mapped = _mapper.Map<IEnumerable<ProductViewModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<ProductViewModel>> GetProductsByNameAsync(string keyword)
        {
            var userList = await _productsService.GetProductsByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<ProductViewModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<ProductViewModel>> GetProductsAllFiltersAsync(ProductViewModel model)
        {
            var sModel = _mapper.Map<ProductModel>(model);
            var userList = await _productsService.GetProductsAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<ProductViewModel>>(userList);
            return mapped;
        }

        public async Task<ProductViewModel> GetProductByIdAsync(Int32 id)
        {
            var store = await _productsService.GetProductByIdAsync(id);
            var mapped = _mapper.Map<ProductViewModel>(store);
            return mapped;
        }
        public async Task<ProductModel> Create(ProductViewModel model)
        {
            await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<ProductViewModel, ProductModel>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _productsService.Create(mappedEntity);
            _logger.LogInformation($"Entity successfully added - ProductServiceAppService");

            var newMappedEntity = _mapper.Map<ProductModel>(newEntity);
            return newMappedEntity;
        }   

        public async Task Update(ProductViewModel model)
        {
           
            //ObjectMapper.Mapper.Map<UserModel, User>(model, editPrice);
            var edit = await _productsService.GetProductByIdAsync(model.Id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ProductViewModel, ProductModel>(model, edit);
            await _productsService.Update(edit);
            _logger.LogInformation($"Entity successfully updated - ProductServiceAppService");
        }

        public async Task Delete(ProductViewModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _productsService.GetProductByIdAsync(model.Id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _productsService.Delete(vehicle);
            _logger.LogInformation($"Entity successfully deleted - StoresService");
        }

        private async Task ValidateProductIfExist(ProductViewModel model)
        {
            var existingEntity = await _productsService.GetProductByIdAsync(model.Id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(ProductViewModel model)
        {
            var existingEntity = _productsService.GetProductByIdAsync(model.Id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
