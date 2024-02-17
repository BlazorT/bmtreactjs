using com.blazor.bmt.application.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface IInspectionItemsService
    {

        Task<IEnumerable<InspectionitemModel>> GetInspectionItemslListAsync(Int64 inspectonReportId);
       
        Task<IEnumerable<InspectionitemModel>> BulkAddorUpdates(List<InspectionitemModel> ls);
        Task<InspectionitemModel> Create(InspectionitemModel model);
        Task Update(InspectionitemModel model);
    

    }
}
