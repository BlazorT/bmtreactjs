
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class CampaignTemplateRepository : Repository<Compaigntemplate>, ICampaignTemplateRepository
    {
        public CampaignTemplateRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Compaigntemplate>> GetCompaigntemplatesByNetworkList(int NetworkId)
        {
            return await _dbContext.Compaigntemplates.AsNoTracking()
               .Where(x => x.NetworkId== (NetworkId == 0? x.NetworkId : NetworkId)).OrderBy(x=>x.Id).OrderBy(x => x.Name)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
      
		
        public async Task<Compaigntemplate> GetCompaignTemplateByIdAsnc(Int32 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Compaigntemplates.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
