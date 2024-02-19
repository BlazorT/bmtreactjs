using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using com.blazor.bmt.util;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class UsersRepository : Repository<User>, IUsersRepository
    {
        public UsersRepository(_bmtContext dbContext) : base(dbContext)
        {

        }

      
       
        //Task<IEnumerable<User>> GetUsersAllFiltersAsync(User model);
          

        public async Task<IEnumerable<User>> GetUsersListAsync()
        {
            return await _dbContext.Users.AsNoTracking().OrderBy(x => x.FirstName)
              //.Where(x => x.Id == id)
              .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<User> GetUserByIdSync(Int32 id)
        {
            return await _dbContext.Users.AsNoTracking()
            .Where(x => x.Id== id)
               .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<User>> GetUsersByNameAsync(string Name)
        {
            // var spec = new PriceWithCategorySpecification(productName);
            // return await GetAsync(spec);

            // second way
            // return await GetAsync(x => x.ProductName.ToLower().Contains(productName.ToLower()));

            // third way
            return await _dbContext.Users.AsNoTracking()
                .Where(x => x.UserName.Contains(Name)).OrderBy(x => x.FirstName)
                .ToListAsync();
        }
        
        public async Task<IEnumerable<User>> GetDspUsersAllFiltersAsync(User model) {
            var sUsers= await _dbContext.Users.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.RoleId == (model.RoleId == 0 ? x.RoleId : model.RoleId) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.Email.Contains((String.IsNullOrWhiteSpace(model.Email) ? x.Email : model.Email)) && x.CreatedAt >= (model.CreatedAt.Year <= 1900 ? System.DateTime.Now.AddYears(-1) : model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) && x.OrgId == ((model.OrgId== null || model.OrgId== 0) ? x.OrgId: model.OrgId) && x.UserName.Contains(("" + model.UserName).Trim())).OrderBy(x => x.FirstName)
                .ToListAsync();
            return sUsers.Where(x => x.RoleId == (int)UTIL.USER_ROLES.OPERATION_MANAGER || x.RoleId == (int)UTIL.USER_ROLES.DA || x.RoleId == (int)UTIL.USER_ROLES.SUPERVISOR).ToList();
        }
        public async Task<IEnumerable<User>> GetDspMobileUsersAllFiltersAsync(User model) {
            return await _dbContext.Users.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.OrgId== (Convert.ToInt32(model.OrgId) == 0 ? x.OrgId: model.OrgId) && x.RoleId == (int)UTIL.USER_ROLES.DA && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.Fmctoken != null && ("" +x.Fmctoken).Length > 5 )
                .ToListAsync();
        }
        public async Task<IEnumerable<User>> GetUsersAllFiltersAsync(User model)
        {
            return await _dbContext.Users.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.RoleId == (model.RoleId == 0 ? x.RoleId : model.RoleId) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.UserName.Contains((String.IsNullOrWhiteSpace(model.UserName) ? x.UserName : model.UserName)) && x.Email.Contains((String.IsNullOrWhiteSpace(model.Email)? x.Email : model.Email)) && x.CreatedAt >= (model.CreatedAt.Year <=1900 ? System.DateTime.Now.AddYears(-1): model.CreatedAt) && x.CreatedAt <= (Convert.ToDateTime(model.LastUpdatedAt).Year <= 1900 ? System.DateTime.Now : model.LastUpdatedAt) && x.OrgId== ((model.OrgId== null || model.OrgId== 0) ? x.OrgId: model.OrgId) && x.UserName.Contains(("" + model.UserName).Trim()) ).OrderBy(x=>x.FirstName)
                .ToListAsync();
        }
        public async Task<IEnumerable<User>> GetUsersByRoleAsync(int roleId, int dspId=0)
        {
            return await _dbContext.Users.AsNoTracking()
                .Where(x => x.RoleId== roleId && (x.OrgId == (dspId==0? x.OrgId : dspId))).OrderBy(x => x.FirstName)
                .ToListAsync();
        }
    }
}
