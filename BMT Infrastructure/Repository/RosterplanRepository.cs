
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class RosterplanRepository : RepositoryTransaction<Rosterplan>, IRosterplanRepository
    {
        public RosterplanRepository(_bmtContext dbContext) : base(dbContext)
        {

        }     
       
        
        public async Task<Rosterplan> GetRosterPlanByIdSync(Int64 id)
        {
            return await _dbContext.Rosterplans.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<Rosterplan>> GetRosterPlasByNameAsync(int dspId)
        {            
            return await _dbContext.Rosterplans.AsNoTracking()
                .Where(x => x.DspId== dspId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Rosterplan>> bulkaddorupdates(List<Rosterplan> ls)
        {

            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                await _dbContext.Rosterplans.AddRangeAsync(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Rosterplans.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;

        }
        // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
        public async Task<IEnumerable<Vehicle>> GetRosterPlasByDspAndStatusAsnc(int dspId, int status)
        {
            return await _dbContext.Vehicles.AsNoTracking()
                .Where(x => x.Dspid == dspId && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }   

        public async Task<IEnumerable<Rosterplan>> GetRosterPlasAllFiltersAsync(Rosterplan model)
        {
            return await _dbContext.Rosterplans.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.DspId == (model.DspId == 0 ? x.DspId : model.DspId) && x.CreatedBy == (model.CreatedBy == 0 ? x.CreatedBy : model.CreatedBy) && x.Status == ((model.Status == null ||model.Status == 0) ? x.Status : model.Status)  && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ?GlobalUTIL.CurrentDateTime : model.LastUpdatedAt) && x.RosterTypeId == (model.RosterTypeId == 0 ? x.RosterTypeId : model.RosterTypeId))
                // .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.ShowRoomId == (model.ShowRoomId == 0 ? x.ShowRoomId : model.ShowRoomId))
                .ToListAsync();
        }
    }
}
