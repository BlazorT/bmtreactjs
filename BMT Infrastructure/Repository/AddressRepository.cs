using com.blazor.bmt.core;
using com.blazor.bmt.core.repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class AddressRepository : Repository<Address>, IAddressRepository
    {
        public AddressRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Address>> GetAddressListAsync()
        {
            return await _dbContext.Addresses.AsNoTracking()

                   //  .Where(x => x..Contains(name))
                   .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Address>> GetAddressByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Addresses.AsNoTracking()
               .Where(x => x.FirstName.ToLower().Contains(name) || x.LastName.ToLower().Contains(name))
                .ToListAsync();
        }

        public async Task<IEnumerable<Address>> GetAddressByUserAsync(int userId)
        {
            return await _dbContext.Addresses.AsNoTracking()
                .Where(x => x.UserId== (userId==0? x.UserId: userId))
                .ToListAsync();
        }
    }
}
