
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(_bmtContext dbContext) : base(dbContext)
        {            
        }

        public async Task<Category> GetCategoryWithProductsAsync(int categoryId)
        {
            return await _dbContext.Categories.AsNoTracking()
              //.Where(x => x.Id == id)
              .FirstOrDefaultAsync();
        }
    }
}
