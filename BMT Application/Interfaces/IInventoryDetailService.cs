using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IInventoryDetailService
    {
        Task<IEnumerable<InventorydetailModel>> GetInventoryDataAsync();
        Task<InventorydetailModel> GetInventoryDataByIdSync(Int64 Id);
        Task<IEnumerable<InventorydetailModel>> GetInventoryDataAllFiltersAsync(InventorydetailModel model);
        Task<IEnumerable<InventorydetailModel>> GetInventoryDetailsByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<InventorydetailModel>> GetInventoryDataByProductDetailIdAsync(int productDetailsId);
        Task<IEnumerable<InventorydetailModel>> addorupdateInventoryDetails(List<InventorydetailModel> ls);
        Task<InventorydetailModel> Create(InventorydetailModel model);
        Task Update(InventorydetailModel model);
        Task Delete(InventorydetailModel model);
    }
}
