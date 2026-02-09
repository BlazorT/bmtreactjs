using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IApprovalRequestRepository : IRepositoryTransaction<Approvalrequest>
    {
        //Task<IEnumerable<Approvalrequest>> GetApprovalRequestListAsync();       
        Task<IEnumerable<Approvalrequest>> GetApprovalRequestAllFiltersAsync(Approvalrequest log);
        Task<Approvalrequest> GetApprovalRequestByIdAsync(long Id);
        Task<IEnumerable<Approvalrequest>> GetApprovalRequestByOrgAsync(int orgid);
        
    }
}
