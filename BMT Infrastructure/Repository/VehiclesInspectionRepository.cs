
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
    public class VehiclesInspectionRepository : RepositoryTransaction<Vehicleinspection>, IVehiclesInspectionRepository
    {
        public VehiclesInspectionRepository(_bmtContext dbContext) : base(dbContext)
        {

        }    
      
        public async Task<IEnumerable<Vehicleinspection>> GetVehicleInspectionsListAsync()
        {
            return await _dbContext.Vehicleinspections.AsNoTracking()
           .Where(x => x.Status == (int)util.UTIL.COMMON_STATUS.ACTIVE)
              .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Vehicleinspection>> GGetVehicleInspectionByReportIdSync(Int64 Reportid)
        {
            return await _dbContext.Vehicleinspections.AsNoTracking()
            .Where(x => x.InspectionReportId == Reportid)
               .ToListAsync();
        }
        public async Task<Vehicleinspection> GGetVehicleInspectionByIdSync(Int64 id)
        {
            return await _dbContext.Vehicleinspections.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();
        }
    
       // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
            public async Task<IEnumerable<Vehicleinspection>> GetVehiclesByVehicleIdAndStatusAsnc(Int64 vehicleId, int status)
        {
            return await _dbContext.Vehicleinspections.AsNoTracking()
                .Where(x => x.Vehicleid == vehicleId && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }
        public async Task<IEnumerable<Vehicleinspection>> bulkaddorupdates(List<Vehicleinspection> ls) {
           
                var newLs = ls.Where(x => x.Id == 0).ToList();
                if (newLs != null && newLs.Any())
                    await _dbContext.Vehicleinspections.AddRangeAsync(newLs);
                var updateLs = ls.Where(x => x.Id > 0).ToList();
                if (updateLs != null && updateLs.Any())
                    _dbContext.Vehicleinspections.UpdateRange(updateLs);

                await _dbContext.SaveChangesAsync();
                return newLs;
            
        }
        public async Task<IEnumerable<Vehicleinspection>> GetVehiclesAllFiltersAsync(Vehicleinspection model)
        {
            return await _dbContext.Vehicleinspections.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Vehicleid == (model.Vehicleid == 0 ? x.Vehicleid : model.Vehicleid) && x.InspectionItemId == (model.InspectionItemId == 0 ? x.InspectionItemId : model.InspectionItemId) && x.Status == (( model.Status == 0) ? x.Status : model.Status)  && x.CreatedAt >= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt)  ).OrderByDescending(x => x.Id)                
                .ToListAsync();
        }
    }
}
