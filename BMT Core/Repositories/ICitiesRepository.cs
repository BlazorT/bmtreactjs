using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface ICitiesRepository
    {
        Task<IEnumerable<City>> GetCitiesByStatusList(int status);
        Task<IEnumerable<City>> GetCitiesListByState(int stateId);
        Task<IEnumerable<City>> GetCitiesList(string name);
        
    }
}
