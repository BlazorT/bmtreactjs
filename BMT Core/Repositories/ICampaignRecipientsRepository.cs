using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface ICampaignRecipientsRepository : IRepositoryTransaction<Compaignrecipient>
    {
        Task<IEnumerable<Compaignrecipient>> GetCompaignrecipientsByNetworkLAndOrgist(int NetworkId, int OrgId);
        Task<IEnumerable<Compaignrecipient>> GetCampaignRecipientsListAllFilters(Compaignrecipient model);
        Task<Compaignrecipient> GetCompaignRecipientByIdAsnc(Int64 id);


    }
}
