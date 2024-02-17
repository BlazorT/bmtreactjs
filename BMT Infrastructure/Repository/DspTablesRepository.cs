
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class DspTablesRepository : RepositoryTransaction<Dspstable>, IDspTablesRepository
    {
        public DspTablesRepository(_bmtContext dbContext) : base(dbContext)
        {

        }      
      
     
        public async Task<Dspstable> GetDspTableleByIdSync(Int64 id)
        {
            return await _dbContext.Dspstables.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Dspstable>> GetDspTableleByTableIdSync(int tid)
        {
            return await _dbContext.Dspstables.AsNoTracking()
            .Where(x => x.Id == tid)
               .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Dspstable>> GetDspTablesByNameAsync(string Name)
        {
            
            // third way
            return await _dbContext.Dspstables.AsNoTracking()
                .Where(x => x.DefaultValue.Contains(Name) ||  x.TableName.Contains(Name) || x.ColumnName.Contains(Name) || Convert.ToString(x.Id).Contains(Name))
                .ToListAsync();
        }
       // Task<IEnumerable<Vehicle>> GetVehiclesByDspAndStatusAsnc(int dspId, int status)
            public async Task<IEnumerable<Dspstable>> GetDspTablesByColumnAndStatusAsnc(int columnIndex, int status)
        {
            return await _dbContext.Dspstables.AsNoTracking()
                .Where(x => x.ColumnOrdinal == columnIndex && x.Status == (status == 0 ? x.Status : status))
                .ToListAsync();
        }    
       

        public async Task<IEnumerable<Dspstable>> GetDspTablesAllFiltersAsync(Dspstable model)
        {
            return await _dbContext.Dspstables.AsNoTracking()
                 .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Tid == (model.Tid == 0 ? x.Tid : model.Tid) && x.ColumnOrdinal == (model.ColumnOrdinal == 0 ? x.ColumnOrdinal : model.ColumnOrdinal) && x.Status == ((model.Status == null ||model.Status == 0) ? x.Status : model.Status)  && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.ColumnName.Contains(("" + model.ColumnName).Trim()) &&  x.TableName.Contains(("" + model.TableName).Trim()))
                // .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.CategoryId == (model.CategoryId == 0 ? x.CategoryId : model.CategoryId) && x.ShowRoomId == (model.ShowRoomId == 0 ? x.ShowRoomId : model.ShowRoomId))
                .ToListAsync();
        }
    }
}
