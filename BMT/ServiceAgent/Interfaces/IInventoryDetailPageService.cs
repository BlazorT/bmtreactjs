
using com.blazor.bmt.core;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
    public interface IInventoryDetailPageService
    {
        Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDataAsync();
        Task<Inventorydetailviewmodel> GetInventoryDataByIdSync(Int64 Id);
        Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDataAllFiltersAsync(Inventorydetailviewmodel model);
        Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDetailsByDspAndStatusAsnc(int dspId, int status);
        Task<IEnumerable<Inventorydetailviewmodel>> GetInventoryDataByProductDetailIdAsync(int productDetailsId);
        Task<IEnumerable<Inventorydetailviewmodel>> addorupdateInventoryDetails(List<Inventorydetailviewmodel> ls);
        Task<Inventorydetailviewmodel> Create(Inventorydetailviewmodel model);
        Task Update(Inventorydetailviewmodel model);
        Task Delete(Inventorydetailviewmodel model);
    }
}
