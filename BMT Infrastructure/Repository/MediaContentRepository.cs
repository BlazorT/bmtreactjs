using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class MediaContentRepository : RepositoryTransaction<Mediacontent>, IMediaContentRepository {
        public MediaContentRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
        public async Task<Mediacontent> GetVehicleImagesByIdSync(Int64 id)
        {
            return await _dbContext.Mediacontents.AsNoTracking()
                     .Where(x => (x.Id== id ))
                     .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<Mediacontent>> addorupdateBulkImage(List<Mediacontent> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                await _dbContext.Mediacontents.AddRangeAsync(ls);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Mediacontents.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;
           
        }


    }
}
