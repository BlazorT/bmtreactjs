using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IInventoryRepository : IRepositoryTransaction<Inventorydetail>
    {
        Task<IEnumerable<Inventorydetail>> GetInventoryDataAsync();
        Task<Inventorydetail> GetInventoryDataByIdSync(Int64 Id);
        Task<IEnumerable<Inventorydetail>> GetInventoryDataAllFiltersAsync(Inventorydetail model);
        Task<IEnumerable<Inventorydetail>> GetInventoryDetailsByDspAndStatusAsnc(int dspId, int status);     
        Task<IEnumerable<Inventorydetail>> GetInventoryDataByProductDetailIdAsync(int productDetailsId);
        Task<IEnumerable<Inventorydetail>> addorupdateInventoryDetails(List<Inventorydetail> ls);
    }
}
