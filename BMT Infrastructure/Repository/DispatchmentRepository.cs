
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class DispatchmentRepository : RepositoryTransaction<Dispatchment>, IDispatchmentRepository
    {
        public DispatchmentRepository(_bmtContext dbContext) : base(dbContext)
        {

        }       
       
        public async Task<IEnumerable<Dispatchment>> GetDispatchmentsByDspIdAndStatusAsnc(int dispId, int status)
        {
            return await _dbContext.Dispatchments.AsNoTracking()
           .Where(x => x.Dspid == dispId && x.Status == (int)util.UTIL.COMMON_STATUS.ACTIVE)
              .ToListAsync();
           
        }

        public async Task<IEnumerable<Dispatchment>> bulkaddorupdates(List<Dispatchment> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                _dbContext.Dispatchments.AddRange(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Dispatchments.UpdateRange(updateLs);

            _dbContext.SaveChanges();
            return newLs;
        }
        public async Task<Dispatchment> GetDispatchmentByIdSync(Int64 id)
        {
            return await _dbContext.Dispatchments.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();
        }
    
       // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
        public async Task<IEnumerable<Dispatchment>> GetDispatchmentsByVehicleIdAndStatusAsnc(Int64 vehicleId, int status)
        {
            return await _dbContext.Dispatchments.AsNoTracking()
                .Where(x => x.VehicleId == vehicleId && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }   

        public async Task<IEnumerable<Dispatchment>> GetDispatchmentsAllFiltersAsync(Dispatchment model)
        {
            return await _dbContext.Dispatchments.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.AssignedTo == (model.AssignedTo == 0 ? x.AssignedTo : model.AssignedTo) && x.ProductDetailId == (model.ProductDetailId == 0 ? x.ProductDetailId : model.ProductDetailId) && x.VehicleId == (model.VehicleId == 0 ? x.VehicleId : model.VehicleId) && x.Status == (( model.Status == 0) ? x.Status : model.Status)  && x.CreatedAt >= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? GlobalUTIL.CurrentDateTime.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt)  ).OrderByDescending(x => x.Id)                
                .ToListAsync();
        }
    }
}
