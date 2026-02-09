using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IApprovalRequestService
    {
       
        Task<ApprovalrequestModel> GetApprovalRequestById(long id);
        Task<IEnumerable<ApprovalrequestModel>> GetApprovalRequestAllFiltersAsync(ApprovalrequestModel model);

        Task<IEnumerable<ApprovalrequestModel>> GetApprovalRequestByOrgId(int orgId);
        Task<ApprovalrequestModel> Create(ApprovalrequestModel model);
        Task<ApprovalrequestModel> Update(ApprovalrequestModel model);       
    }
}
