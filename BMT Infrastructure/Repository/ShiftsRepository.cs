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
using Org.BouncyCastle.Utilities;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class ShiftsRepository : Repository<Shift>, IShiftsRepository
    {
        public ShiftsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Shift>> GetShiftsByStatusAsync(int status)
        {
            return await _dbContext.Shifts.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Shift>> GetShiftsByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Shifts.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Shift>> GetShiftsAllFiltersAsync(Shift model)
        {
            return await _dbContext.Shifts.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id)  && x.ShiftTypeId == ((model.ShiftTypeId == 0 || model.ShiftTypeId == null) ? x.ShiftTypeId : model.ShiftTypeId) && x.Name.Contains(("" + model.Name))  && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime : model.LastUpdatedAt) &&  x.Name.Contains(""+model.Name)).OrderBy(x => x.Name)
                .ToListAsync();
        }
        public async Task<Shift> GetShiftByIdAsync(Int32 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Shifts.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
