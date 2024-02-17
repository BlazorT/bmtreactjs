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
    public class DsppartnerRepository : Repository<Dsppartner>, IDsppartnerRepository
    {
        public DsppartnerRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Dsppartner>> GetDspPartnersListByStatusAsync(int dspid, int status)
        {
            return await _dbContext.Dsppartners.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status) && x.Dspid == (dspid == 0 ? x.Dspid : dspid))
                .ToListAsync();
        }
       
        public async Task<IEnumerable<Dsppartner>> GetDspPartnersByNameAsync(string name)
        {        
            return await _dbContext.Dsppartners.AsNoTracking()
               .Where(x => x.FullName.ToLower().Contains(name.ToLower()) || x.BusinessName.ToLower().Contains(name.ToLower())).OrderBy(x => x.FullName)
                .ToListAsync();
           
        }
        public async Task<IEnumerable<Dsppartner>> bulkaddorupdates(List<Dsppartner> ls)
        {
            var newLs = ls.Where(x => x.Id == 0).ToList();
            if (newLs != null && newLs.Any())
                 _dbContext.Dsppartners.AddRange(newLs);
            var updateLs = ls.Where(x => x.Id > 0).ToList();
            if (updateLs != null && updateLs.Any())
                _dbContext.Dsppartners.UpdateRange(updateLs);

             _dbContext.SaveChanges();
            return newLs;          
        }
        public async Task<IEnumerable<Dsppartner>> GetDspPartnersAllFiltersAsync(Dsppartner model)
        {
            return await _dbContext.Dsppartners.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.FullName.Contains((""+ model.FullName)) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) &&  x.FullName.Contains(""+model.FullName) && x.BusinessName.Contains("" + model.BusinessName)).OrderBy(x => x.FullName)
                .ToListAsync();
        }
        public async Task<Dsppartner> GetDspPartnersByIDeAsync(Int32 id)
        {   
            return await _dbContext.Dsppartners.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
