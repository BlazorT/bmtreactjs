using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IShiftsService
    {
        Task<IEnumerable<ShiftModel>> GetShiftsByNameAsync(string productName);
        //Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<ShiftModel>> GetShiftsByStatusAsync(int status);
        Task<IEnumerable<ShiftModel>> GetShiftsAllFiltersAsync(ShiftModel model);       
        Task<ShiftModel> GetShiftByIdAsync(Int32 id);
        Task<ShiftModel> Create(ShiftModel model);
        Task Update(ShiftModel model);
        Task Delete(ShiftModel model);

    }
}
