using com.blazor.bmt.core;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IProductPageService
    {
        Task<IEnumerable<ProductViewModel>> GetProductsList();
        Task<IEnumerable<ProductViewModel>> GetProductsByNameAsync(string keyword);
        Task<IEnumerable<ProductViewModel>> GetProductsByStatusAsync(int status);
        Task<IEnumerable<ProductViewModel>> GetProductsAllFiltersAsync(ProductViewModel model);
        Task<ProductViewModel> GetProductByIdAsync(Int32 id);      
        Task<ProductModel> Create(ProductViewModel model);
        Task Update(ProductViewModel model);
        Task Delete(ProductViewModel model);
    }
    }

