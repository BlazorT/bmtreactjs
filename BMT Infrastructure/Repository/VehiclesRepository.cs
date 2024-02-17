
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class VehiclesRepository : RepositoryTransaction<Vehicle>,  IVehiclesRepository
    {
        public VehiclesRepository(_bmtContext dbContext) : base(dbContext)
        {

        }      
       
        public async Task<IEnumerable<Vehicle>> GetVehiclesListAsync()
        {
            return await _dbContext.Vehicles.AsNoTracking()
           //.Where(x => x.Id == id)
              .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<Vehicle> GetVehicleByIdSync(Int64 id)
        {
            return await _dbContext.Vehicles.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Vehicle>> GetVehiclesByNameAsync(string Name)
        {
            // var spec = new PriceWithCategorySpecification(productName);
            // return await GetAsync(spec);

            // second way
            // return await GetAsync(x => x.ProductName.ToLower().Contains(productName.ToLower()));

            // third way
            return await _dbContext.Vehicles.AsNoTracking()
                .Where(x => x.Name.Contains(Name) ||  x.Desc.Contains(Name) || x.Email.Contains(Name) || Convert.ToString(x.Id).Contains(Name))
                .ToListAsync();
        }
       // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
            public async Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
        {
            return await _dbContext.Vehicles.AsNoTracking()
                .Where(x => x.Dspid == dspId && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }
        public async Task<IEnumerable<Vehicle>> GetVehiclesByCategoryAsync(int categoryId)
        {
            return await _dbContext.Vehicles.AsNoTracking()
                .Where(x => x.CategoryId== categoryId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Vehicle>> GetVehiclesByCategoryAndStatusAsnc(int categoryId, int status)
        {
            return await _dbContext.Vehicles.AsNoTracking()
                .Where(x => x.CategoryId == categoryId && x.Status== (status==0? x.Status: status))
                .ToListAsync();
        }

        public async Task<IEnumerable<Vehicle>> GetVehiclesAllFiltersAsync(Vehicle model)
        {
            return await _dbContext.Vehicles.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.MakeDetailId == (model.MakeDetailId == 0 ? x.MakeDetailId : model.MakeDetailId) && x.Status == ((model.Model == null ||model.Model == 0) ? x.Model : model.Model)  && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) && x.Dspid == ((model.Dspid == null || model.Dspid == 0) ? x.Dspid : model.Dspid) && x.Name.Contains(("" + model.Name).Trim()))
                // .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.ShowRoomId == (model.ShowRoomId == 0 ? x.ShowRoomId : model.ShowRoomId))
                .ToListAsync();
        }
    }
}
