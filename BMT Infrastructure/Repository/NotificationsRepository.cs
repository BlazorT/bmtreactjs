
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using com.blazor.bmt.infrastructure;
using com.blazor.bmt.infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class NotificationsRepository : RepositoryTransaction<Notification>,  INotificationsRepository
    {
        public NotificationsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }      
       
        public async Task<IEnumerable<Notification>> GetNotificationsListAsync()
        {
            return await _dbContext.Notifications.AsNoTracking()
           //.Where(x => x.Id == id)
              .ToListAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<Notification> GetNotificationByIdSync(Int64 id)
        {
            return await _dbContext.Notifications.AsNoTracking()
            .Where(x => x.Id== id && x.Status == 1)
               .FirstOrDefaultAsync();

            // second way
            // return await GetAllAsync();
        }
        public async Task<IEnumerable<Notification>> GetNotificationsByNameAsync(string keyword)
        {
            // var spec = new PriceWithCategorySpecification(productName);
            // return await GetAsync(spec);

            // second way
            // return await GetAsync(x => x.ProductName.ToLower().Contains(productName.ToLower()));

            // third way
            return await _dbContext.Notifications.AsNoTracking()
                .Where(x => x.Body.Contains(keyword) && x.Status==1 )
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetNotificationsByCategoryAsync(int dspid)
        {
            return await _dbContext.Notifications.AsNoTracking()
                .Where(x => x.OrganizationId == dspid && x.Status == 1)
                .ToListAsync();
        }
        public async Task<IEnumerable<Notification>> GetNotificationsByCategoryAndStatusAsnc(int Dspid, int status)
        {
            return await _dbContext.Notifications.AsNoTracking()
                .Where(x => x.OrganizationId == Dspid && x.Status== (status==0? x.Status: status))
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetNotificationsAllFiltersAsync(Notification model)
        {
            return await _dbContext.Notifications.AsNoTracking()
                .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.OrganizationId == (model.OrganizationId == 0 ? x.OrganizationId : model.OrganizationId) && x.Status == (model.Status == 0 ? x.Status : model.Status) && Convert.ToDateTime(x.CreatedAt) <= (model.CreatedAt.Year<=1900 ? Convert.ToDateTime(x.CreatedAt) : Convert.ToDateTime(model.CreatedAt)))
                .ToListAsync();
        }
    }
}
