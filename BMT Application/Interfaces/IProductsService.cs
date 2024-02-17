using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IProductsService
    {
        Task<IEnumerable<ProductModel>> GetProductsByNameAsync(string productName);
        //Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<ProductModel>> GetProductsByStatusAsync(int status);
        Task<IEnumerable<ProductModel>> GetProductsAllFiltersAsync(ProductModel model);       
        Task<ProductModel> GetProductByIdAsync(Int32 id);
        Task<ProductModel> Create(ProductModel model);
        Task Update(ProductModel model);
        Task Delete(ProductModel model);

    }
}
