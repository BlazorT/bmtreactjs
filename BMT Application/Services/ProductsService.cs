using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class ProductsService : IProductsService
    {
        private readonly IProductRepository _productRepository;
        private readonly IAppLogger<ProductsService> _logger;
        private readonly IMapper _mapper;
        public ProductsService(IProductRepository productRepository, IMapper mapper, IAppLogger<ProductsService> logger)
        {
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        public async Task<IEnumerable<ProductModel>> GetProductsByStatusAsync(int status)
        {
            var list = await _productRepository.GetProductsByStatusAsync(status);
            var mapped = _mapper.Map<IEnumerable<ProductModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<ProductModel>> GetProductsByNameAsync(string keyword)
        {
            var userList = await _productRepository.GetProductsByNameAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<ProductModel>>(userList);
            return mapped;
        }
        public async Task<IEnumerable<ProductModel>> GetProductsAllFiltersAsync(ProductModel model)
        {
            var sModel = _mapper.Map<Product>(model);
            var userList = await _productRepository.GetProductsAllFiltersAsync(sModel);
            var mapped = _mapper.Map<IEnumerable<ProductModel>>(userList);
            return mapped;
        }

        public async Task<ProductModel> GetProductByIdAsync(Int32 id)
        {
            var store = await _productRepository.GetProductByIdAsync(id);
            var mapped = _mapper.Map<ProductModel>(store);
            return mapped;
        }
        public async Task<ProductModel> Create(ProductModel model)
        {
            await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<ProductModel, Product>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");

            var newEntity = await _productRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - ProductServiceAppService");

            var newMappedEntity = _mapper.Map<ProductModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(ProductModel model)
        {
            //ValidateProductIfNotExist(model);
            //var editPrice = await _userRepository.GetByIdAsync(model.id);
            //if (editPrice == null)
            //    throw new ApplicationException($"Entity could not be loaded.");

            //ObjectMapper.Mapper.Map<UserModel, User>(model, editPrice);
            var edit = await _productRepository.GetProductByIdAsync(model.id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ProductModel, Product>(model, edit);
            await _productRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - ProductServiceAppService");
        }

        public async Task Delete(ProductModel model)
        {
            ValidateProductIfNotExist(model);
            var vehicle = await _productRepository.GetProductByIdAsync(model.id);
            if (vehicle == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _productRepository.DeleteAsync(vehicle);
            _logger.LogInformation($"Entity successfully deleted - StoresService");
        }

        private async Task ValidateProductIfExist(ProductModel model)
        {
            var existingEntity = await _productRepository.GetProductByIdAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(ProductModel model)
        {
            var existingEntity = _productRepository.GetProductByIdAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");


        }
    }
}
