using com.blazor.bmt.core.repositries;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositories
{
    public interface ICompaignRepository :  IRepositoryTransaction<Compaign>
    {
        Task<IEnumerable<Compaign>> GetCompaignListAsync();       
        Task<IEnumerable<Compaign>> GetCompaignsByNameAsync(string name);
        Task<IEnumerable<Compaign>> GetCompaignsByOrganizationAsync(int orgId);
        Task<Compaign> GetCompaignByIdAsync(long compaignId);
        Task<Compaign> GetCompaignByStatusAsync(int stats);
        Task<IEnumerable<Compaign>> GetCompaignByAllFiltersAsync(Compaign compaign);
       }
}
