using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.util;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class ProductsRepository : Repository<Product>, IProductRepository
    {
        public ProductsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Product>> GetProductsByStatusAsync(int status)
        {
            return await _dbContext.Products.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Product>> GetProductsByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Products.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Product>> GetProductsAllFiltersAsync(Product model)
        {
            return await _dbContext.Products.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id)  && x.CategoryId == ((model.CategoryId == 0 || model.CategoryId==null) ? x.CategoryId : model.CategoryId) && x.ShortCode.Contains(("" + model.ShortCode)) && x.BarCode.Contains((""+ model.BarCode)) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt) &&  x.Name.Contains(""+model.Name) && x.ManufactureCountryId==(model.ManufactureCountryId==0? x.ManufactureCountryId: model.ManufactureCountryId)).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Product> GetProductByIdAsync(Int32 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Products.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
