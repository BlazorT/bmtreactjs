using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface ICampaignTemplateRepository
    {
        Task<IEnumerable<Compaigntemplate>> GetCompaigntemplatesByNetworkList(int NetworkId);
        //Task<IEnumerable<City>> GetCitiesListByState(int stateId);
        //Task<IEnumerable<City>> GetCitiesList(string name);
        
    }
}
