
using com.blazor.bmt.core.repositries;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<Category> GetCategoryWithProductsAsync(int categoryId);
    }
}
