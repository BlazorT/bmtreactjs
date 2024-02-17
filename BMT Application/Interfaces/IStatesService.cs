using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IStatesService
    {
        Task<IEnumerable<StateModel>> GetStatesByStatusList(int status);
     
        Task<IEnumerable<StateModel>> GetStatesList(string details);
      
    }
}
