
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class FleetrosterplanRepository : RepositoryTransaction<Fleetrosterplan>, IFleetrosterplanRepository
    {
        public FleetrosterplanRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<Fleetrosterplan> GetFleetrosterplanByIdSync(Int64 id)
        {
            return await _dbContext.Fleetrosterplans.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<Fleetrosterplan>> GetRosterPlasByRosterIdAsync(Int64 rosterId)
        {            
            return await _dbContext.Fleetrosterplans.AsNoTracking()
                .Where(x => x.RosterId== rosterId)
                .ToListAsync();
        }
       
        public async Task<IEnumerable<Fleetrosterplan>> GetFleetrosterplansAllFiltersAsync(Fleetrosterplan model)
        {
            return await _dbContext.Fleetrosterplans.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.RosterId == (model.RosterId == 0 ? x.RosterId : model.RosterId) && x.CreatedBy == (model.CreatedBy == 0 ? x.CreatedBy : model.CreatedBy) && x.Status == ((model.Status == null ||model.Status == 0) ? x.Status : model.Status)  && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) && x.VehicleId == (model.VehicleId == 0 ? x.VehicleId : model.VehicleId))
                // .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.ShowRoomId == (model.ShowRoomId == 0 ? x.ShowRoomId : model.ShowRoomId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Fleetrosterplan>> bulkaddorupdates(List<Fleetrosterplan> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                await _dbContext.Fleetrosterplans.AddRangeAsync(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Fleetrosterplans.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;
        }
    }
}
