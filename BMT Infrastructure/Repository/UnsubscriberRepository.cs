using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class UnsubscriberRepository : RepositoryTransaction<Unsubscriber>, IUnsubscriberRepository
    {
        public UnsubscriberRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
      //  Task<IEnumerable<Unsubscriber>> GetUnsubscribersByContactIdAsync(string name);
      //  Task<IEnumerable<Unsubscriber>> GetUnsubscribersByOrganizationAsync(int orgId);
       // Task<Unsubscriber> GetUnsubscribersByIdAsync(long id);
       // Task<IEnumerable<Compaign>> GetCompaignByAllFiltersAsync(Unsubscriber compaign);
        public async Task<IEnumerable<Unsubscriber>> GetUnsubscribersByContactIdAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Unsubscribers
               .Where(x => x.Contactid.ToLower().Contains(name.ToLower()))
                .ToListAsync();           
        }
        public async Task<IEnumerable<Unsubscriber>> GetUnsubscribersByNetworkIdAsync(int networkid)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Unsubscribers
               .Where(x => x.Networkid==networkid)
                .ToListAsync();            
        }
        public async Task<Unsubscriber> GetUnsubscribersByIdAsync(Int64 id)
        {
            return await _dbContext.Unsubscribers.AsNoTracking()
               .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
           
        }
       

        public async Task<IEnumerable<Unsubscriber>> GetUnsubscribersByAllFiltersAsync(Unsubscriber model)
        {
           
            return await _dbContext.Unsubscribers.AsNoTracking()
               .Where(x => x.Id == (model.Id==0?x.Id: model.Id) && (x.Status== (model.Status==0?x.Status:model.Status) && x.Networkid== (Convert.ToInt32(model.Networkid)==0?x.Networkid:model.Networkid)) && x.Contactid.Contains(""+model.Contactid) && x.LastUpdatedAt >= (model.LastUpdatedAt ?? GlobalUTIL.CurrentDateTime)).OrderByDescending(x => x.LastUpdatedAt)
                .ToListAsync();
           
        }
       
    }
}
