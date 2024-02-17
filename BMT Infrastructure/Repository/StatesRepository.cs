
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
    public class StatesRepository : Repository<State>, IStatesRepository
    {
        public StatesRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<State>> GetStatesListByStatusAsync(int status)
        {
            return await _dbContext.States.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status)).OrderBy(x => x.Name)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<State>> GetStatesByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.States.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name)
                .ToListAsync();
           
        }

    }
}
