using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IWorkflowTasksRepository : IRepository<Workflowtask>
    {
        Task<IEnumerable<Workflowtask>> GetWorkflowTasksListByStatusAsync(int dspid,int status);
        Task<IEnumerable<Workflowtask>> GetWorkflowTasksByNameAsync(string name);
        Task<IEnumerable<Workflowtask>> GetWorkflowTasksAllFiltersAsync(Workflowtask model);
        Task<IEnumerable<Workflowtask>> bulkaddorupdates(List<Workflowtask> ls);
        Task<Workflowtask> GetWorkflowTaskssByIdAsync(Int32 id);


    }
}
