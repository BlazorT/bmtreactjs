using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IProductRepository : IRepository<Product>
    {
      //  Task<IEnumerable<Product>> GetProductsListAsync();
        Task<IEnumerable<Product>> GetProductsByNameAsync(string productName);
        //Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<Product>> GetProductsByStatusAsync(int status);
        Task<IEnumerable<Product>> GetProductsAllFiltersAsync(Product model);
        Task<Product> GetProductByIdAsync(Int32 id);
    }
}
