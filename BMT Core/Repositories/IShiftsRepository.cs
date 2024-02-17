using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IShiftsRepository : IRepository<Shift>
    {
        Task<IEnumerable<Shift>> GetShiftsByStatusAsync(int status);
        Task<IEnumerable<Shift>> GetShiftsByNameAsync(string name);
        Task<IEnumerable<Shift>> GetShiftsAllFiltersAsync(Shift model);
        Task<Shift> GetShiftByIdAsync(Int32 id);


    }
}
