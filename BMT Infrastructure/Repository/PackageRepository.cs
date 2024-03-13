using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class PackageRepository : Repository<Package>, IPackageRepository
    {
        public PackageRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
       
        //Task<IEnumerable<Package>> GetPackageListByIdAsync(int id);
        //Task<IEnumerable<Package>> GetPackagesByNameAsync(string name);

        public async Task<IEnumerable<Package>> GetPackagesListByStatusAsync(int status)
        {
            return await _dbContext.Packages.AsNoTracking()
               .Where(x => x.Status== (status==0? x.Status: status))
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
       
        public async Task<IEnumerable<Package>> GetPackagesByNameAsync(string name)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Packages.AsNoTracking()
               .Where(x => x.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();
           
        }
        public async Task<Package> GetPackageListByIdAsync(int id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Packages.AsNoTracking()
               .Where(x => x.Id== id)
                .FirstOrDefaultAsync();

        }


    }
}
