
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class InventoryRepository : RepositoryTransaction<Inventorydetail>, IInventoryRepository
    {
        public InventoryRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
        public async Task<IEnumerable<Inventorydetail>> GetInventoryDataAsync()
        {
            return await _dbContext.Inventorydetails.AsNoTracking()
              .ToListAsync();
        }
        public async Task<Inventorydetail> GetInventoryDataByIdSync(Int64 id)
        {
            return await _dbContext.Inventorydetails.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<Inventorydetail>> GetInventoryDataByProductDetailIdAsync(int productDetailsId)
        {
            //_dbContext.Inventorydetails.()
            return await _dbContext.Inventorydetails.AsNoTracking()
                .Where(x => x.ProductDetailId== productDetailsId)
                .ToListAsync();
        }
       // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
            public async Task<IEnumerable<Inventorydetail>> GetInventoryDetailsByDspAndStatusAsnc(int dspId, int status)
        {
            return await _dbContext.Inventorydetails.AsNoTracking()
                .Where(x => x.Dspid == dspId && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }      
        public async Task<IEnumerable<Vehicle>> GetInventoryDataByDspAndStatusAsnc(int dspId, int status)
        {
            return await _dbContext.Vehicles.AsNoTracking()
                .Where(x => x.Dspid == dspId && x.Status== (status==0? x.Status: status))
                .ToListAsync();
        }

        public async Task<IEnumerable<Inventorydetail>> GetInventoryDataAllFiltersAsync(Inventorydetail model)
        {
            return await _dbContext.Inventorydetails.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.ProductDetailId == (model.ProductDetailId == 0 ? x.ProductDetailId : model.ProductDetailId) && x.Dspid == (model.Dspid == 0 ? x.Dspid : model.Dspid) && x.Status == ((model.Status == null ||model.Status == 0) ? x.Status : model.Status)   && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt)  && x.BarCode.Contains(("" + model.BarCode).Trim()))
                // .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.ShowRoomId == (model.ShowRoomId == 0 ? x.ShowRoomId : model.ShowRoomId))
                .ToListAsync();
        }
        public async Task<IEnumerable<Inventorydetail>> addorupdateInventoryDetails(List<Inventorydetail> ls)
        {
            var  newLs= ls.Where(x=> x.Id==0).ToList();          
            if (newLs != null && newLs.Any())
                await _dbContext.Inventorydetails.AddRangeAsync(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
             _dbContext.Inventorydetails.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;
            //return await _dbContext.Inventorydetails.AsNoTracking()
            //     .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.ProductDetailId == (model.ProductDetailId == 0 ? x.ProductDetailId : model.ProductDetailId) && x.Dspid == (model.Dspid == 0 ? x.Dspid : model.Dspid) && x.Status == ((model.Status == null || model.Status == 0) ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) && x.BarCode.Contains(("" + model.BarCode).Trim()))
            //    // .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.ShowRoomId == (model.ShowRoomId == 0 ? x.ShowRoomId : model.ShowRoomId))
            //    .ToListAsync();
        }
    }
}
