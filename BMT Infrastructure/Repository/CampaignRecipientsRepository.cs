
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{

    public class CampaignRecipientsRepository  : RepositoryTransaction<Compaignrecipient>, ICampaignRecipientsRepository
    {
        public CampaignRecipientsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
        //Task<IEnumerable<Compaignrecipient>> GetCompaignrecipientsByNetworkLAndOrgist(int NetworkId, int OrgId;
        //Task<IEnumerable<Compaignrecipient>> GetCampaignRecipientsListAllFilters(Compaignrecipient model);
        public async Task<IEnumerable<Compaignrecipient>> GetCompaignrecipientsByNetworkLAndOrgist(int NetworkId, int OrgId)
        {
            return await _dbContext.Compaignrecipients.AsNoTracking()
               .Where(x => x.NetworkId == (NetworkId == 0 ? x.NetworkId : NetworkId) && x.OrgId == (OrgId == 0 ? x.OrgId : OrgId)).OrderBy(x => x.Id)
                .ToListAsync();
        }
        public async Task<IEnumerable<Compaignrecipient>> GetCampaignRecipientsListAllFilters(Compaignrecipient model)
        {
            return await _dbContext.Compaignrecipients.AsNoTracking()
              .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.OrgId == (model.OrgId == 0 ? x.OrgId : model.OrgId) && x.ContentId.Contains("" + model.ContentId) && x.NetworkId == (model.NetworkId == 0 ? x.NetworkId : model.NetworkId)).OrderBy(x => x.CreatedAt)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }

        public async Task<Compaignrecipient> GetCompaignRecipientByIdAsnc(Int64 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Compaignrecipients.AsNoTracking()
               .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

        }

    }
}
