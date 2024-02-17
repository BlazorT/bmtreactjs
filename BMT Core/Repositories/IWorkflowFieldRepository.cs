using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IWorkflowFieldRepository : IRepositoryTransaction<Wffield>
    {
        Task<IEnumerable<Wffield>> GetWorkflowEntityFieldsListByEntityAsync(int entityId);

        Task<IEnumerable<Wffield>> GetWorkflowEntityFieldsAllFiltersAsync(Wffield model);
        Task<IEnumerable<Wffield>> bulkaddorupdates(List<Wffield> ls);
        Task<Wffield> GetWorkflowEntityFieldsByIdAsync(Int64 id);


    }
}
