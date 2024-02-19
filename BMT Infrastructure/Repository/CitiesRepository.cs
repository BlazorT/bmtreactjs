
using com.blazor.bmt.core;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blazor.Web.Infrastructure.Repository
{
    public class CitiesRepository : Repository<City>, ICitiesRepository
    {
        public CitiesRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<City>> GetCitiesByStatusList(int status)
        {
            return await _dbContext.Cities.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status)).OrderBy(x=>x.SortOrder).OrderBy(x => x.Name)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<City>> GetCitiesListByState(int stateId)
        {
            return await _dbContext.Cities.AsNoTracking()
              .Where(x => x.StateId == (stateId == 0 ? x.StateId : stateId)).OrderBy(x => x.Name)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<City>> GetCitiesList(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Cities.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }
        public async Task<City> GetCityByIdAsnc(Int32 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Cities.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }

    }
}
