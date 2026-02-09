using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class ApprovalRequestRepository : RepositoryTransaction<Approvalrequest>, IApprovalRequestRepository
    {
        public ApprovalRequestRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
        
        public async Task<Approvalrequest> GetApprovalRequestByIdAsync(long id)
        {
            return await _dbContext.Approvalrequests.AsNoTracking()
                  .Where(x => x.Id== id)
                   .FirstOrDefaultAsync();

        }
        public async Task<IEnumerable<Approvalrequest>> GetApprovalRequestByOrgAsync(int orgId)
        {
            return await _dbContext.Approvalrequests.AsNoTracking()
                  .Where(x => x.OrgId == orgId )
                   .ToListAsync();

        }
        public async Task<IEnumerable<Approvalrequest>> GetApprovalRequestAllFiltersAsync(Approvalrequest model) {
            return await _dbContext.Approvalrequests.AsNoTracking()
                       .Where(x => x.Id == (model.Id == 0? x.Id : model.Id) && x.OrgId == (model.OrgId == 0 ? x.OrgId : model.OrgId) && x.OrgId == (model.OrgId == 0 ? x.OrgId : model.OrgId)  && x.CreatedAt >= (model.CreatedAt == null?System.DateTime.Now.AddDays(-365): model.CreatedAt)).OrderByDescending(k => k.Id)
                      .ToListAsync();
        }       
  
    }
}
