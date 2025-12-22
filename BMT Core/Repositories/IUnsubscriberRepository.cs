using com.blazor.bmt.core.repositries;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface IUnsubscriberRepository :  IRepositoryTransaction<Unsubscriber>
    {
              
        Task<IEnumerable<Unsubscriber>> GetUnsubscribersByContactIdAsync(string name);
        Task<IEnumerable<Unsubscriber>> GetUnsubscribersByNetworkIdAsync(int networkId);
        Task<Unsubscriber> GetUnsubscribersByIdAsync(long id);        
        Task<IEnumerable<Unsubscriber>> GetUnsubscribersByAllFiltersAsync(Unsubscriber compaign);
       }
}
