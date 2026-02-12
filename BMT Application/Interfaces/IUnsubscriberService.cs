using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IUnsubscriberService
    {
        Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListByNetworkIdAsync(int netnworkid);
     
        Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListByContactIdAsync(string contacid);
        Task<UnsubscriberModel> GetUnsubscriberByIdAsync(Int64 id);
        Task<IEnumerable<UnsubscriberModel>> GetUnsubscribersListAllFiltersAsync(UnsubscriberModel compaign);
       // Task<UnsubscriberModel> Create(UnsubscriberModel model);
        Task Update(UnsubscriberModel configurationsModel);
        Task<UnsubscriberModel> CreateSingle(UnsubscriberModel models);
        Task<List<UnsubscriberModel>> Create(List<UnsubscriberModel> models);



    }
}
