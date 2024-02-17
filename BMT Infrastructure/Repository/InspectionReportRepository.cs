
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class InspectionReportRepository : RepositoryTransaction<Inspectionreport>, IInspectionReportRepository
    {
        public InspectionReportRepository(_bmtContext dbContext) : base(dbContext)
        {

        }        
     
        public async Task<IEnumerable<Inspectionreport>> GetVehicleInspectionReportsListAsync()
        {
            return await _dbContext.Inspectionreports.AsNoTracking()
           .Where(x => x.Status == (int)util.UTIL.COMMON_STATUS.ACTIVE)
              .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<Inspectionreport> GGetVehicleInspectionReportByIdSync(Int64 id)
        {
            return await _dbContext.Inspectionreports.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();
        }
    
       // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
        public async Task<IEnumerable<Inspectionreport>> GetVehicleINspectionReportsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status)
        {
            return await _dbContext.Inspectionreports.AsNoTracking()
                .Where(x => x.VehicleId == vehicleId && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }   

        public async Task<IEnumerable<Inspectionreport>> GetVehicleReportsAllFiltersAsync(Inspectionreport model)
        {
            return await _dbContext.Inspectionreports.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.VehicleId == (model.VehicleId == 0 ? x.VehicleId : model.VehicleId) && x.ApprovedBy == (model.ApprovedBy == 0 ? x.ApprovedBy : model.ApprovedBy) && x.Status == (( model.Status == 0) ? x.Status : model.Status)  && x.CreatedAt >= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt)  ).OrderByDescending(x => x.Id)                
                .ToListAsync();
        }
    }
}
