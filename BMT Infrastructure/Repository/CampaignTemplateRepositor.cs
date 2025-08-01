﻿
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class CampaignTemplateRepository : Repository<Compaigntemplate>, ICampaignTemplateRepository
    {
        public CampaignTemplateRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Compaigntemplate>> GetCompaigntemplatesByNetworkList(int NetworkId)
        {
            return await _dbContext.Compaigntemplates.AsNoTracking()
               .Where(x => x.NetworkId== (NetworkId == 0? x.NetworkId : NetworkId)).OrderBy(x=>x.Id).OrderBy(x => x.Name)
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
