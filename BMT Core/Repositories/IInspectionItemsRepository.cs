using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IInspectionItemsRepository : IRepository<Inspectionitem>
    {
        Task<IEnumerable<Inspectionitem>> GetInspectionItemsListByStatusAsync(int dspid,int status);        
        Task<IEnumerable<Inspectionitem>> GetInspectionItemsAllFiltersAsync(Inspectionitem model);
        Task<IEnumerable<Inspectionitem>> bulkaddorupdates(List<Inspectionitem> ls);
        Task<IEnumerable<Inspectionitem>> GetInspectionItemsBYReportIdAsync(Int64 id);


    }
}
