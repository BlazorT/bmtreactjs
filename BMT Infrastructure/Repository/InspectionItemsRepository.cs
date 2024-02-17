using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class InspectionItemsRepository : Repository<Inspectionitem>, IInspectionItemsRepository
    {
        public InspectionItemsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }


        public async Task<IEnumerable<Inspectionitem>> GetInspectionItemsListByStatusAsync(int reportId, int status)
        {
            return await _dbContext.Inspectionitems.AsNoTracking()
               .Where(x =>  x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }

        public async Task<IEnumerable<Inspectionitem>> bulkaddorupdates(List<Inspectionitem> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                await _dbContext.Inspectionitems.AddRangeAsync(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Inspectionitems.UpdateRange(updateLs);

            await _dbContext.SaveChangesAsync();
            return newLs;
        }
        public async Task<IEnumerable<Inspectionitem>> GetInspectionItemsBYReportIdAsync(Int64 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Inspectionitems.AsNoTracking()
               .Where(x => x.Id== id)
                .ToListAsync();

        }
        public async Task<IEnumerable<Inspectionitem>> GetDspByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Inspectionitems.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Inspectionitem>> GetInspectionItemsAllFiltersAsync(Inspectionitem model)
        {
            return await _dbContext.Inspectionitems.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id))// && x.Contact.Contains((""+ model.Contact)) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) &&  x.Name.Contains(""+model.Name) && x.TradeName.Contains("" + model.TradeName)).OrderBy(x => x.Name)
                .ToListAsync();
        }
     

    }
}
