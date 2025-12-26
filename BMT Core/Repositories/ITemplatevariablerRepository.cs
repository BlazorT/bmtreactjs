using com.blazor.bmt.core.repositries;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace com.blazor.bmt.core.repositories
{
    public interface ITemplatevariablerRepository :  IRepositoryTransaction<Templatevariable>
    {
              
        Task<IEnumerable<Templatevariable>> GetTemplateVariablesByNameAsync(string name);
        Task<IEnumerable<Templatevariable>> GetTemplateVariablesByNetworkIdAsync(int orgId,int networkId);
        Task<Templatevariable> GetTemplateVariableByIdAsync(long id);        
        Task<IEnumerable<Templatevariable>> GetTemplateVariablesByAllFiltersAsync(Templatevariable template);
       }
}
