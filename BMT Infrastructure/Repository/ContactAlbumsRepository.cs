
using com.blazor.bmt.core;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{

    public class ContactAlbumsRepository : RepositoryTransaction<Contactsalbum>, IContactsAlbumRepository
    {
        public ContactAlbumsRepository(_bmtContext dbContext) : base(dbContext)
        {

        }
       // Task<IEnumerable<Contactsalbum>> GetContactAlbumsByNetworkLAndOrgist(int NetworkId, int OrgId);
        //Task<IEnumerable<Contactsalbum>> GetContactAlbumsListAllFilters(Contactsalbum model);
      //  Task<Contactsalbum> GetContactAlbumsByIdAsnc(Int64 id);
        public async Task<IEnumerable<Contactsalbum>> GetContactAlbumsByNetworkLAndOrgist(int NetworkId, int OrgId)
        {
            return await _dbContext.Contactsalbums.AsNoTracking()
               .Where(x => x.Networkid == (NetworkId == 0 ? x.Networkid : NetworkId) && x.Orgid == (OrgId == 0 ? x.Orgid : OrgId)).OrderBy(x => x.Id)
                .ToListAsync();
        }
        public async Task<IEnumerable<Contactsalbum>> GetContactAlbumsListAllFilters(Contactsalbum model)
        {
            return await _dbContext.Contactsalbums.AsNoTracking()
              .Where(x => x.Id == (model.Id == 0 ? x.Id : model.Id) && x.Status == (model.Status == 0 ? x.Status : model.Status) && x.Orgid == (model.Orgid == 0 ? x.Orgid : model.Orgid) && x.Name.Contains("" + model.Name) && x.Networkid == (model.Networkid == 0 ? x.Networkid : model.Networkid)).OrderBy(x => x.Id)
                .ToListAsync();

            // second way
            // return await GetAllAsync();
        }

        public async Task<Contactsalbum> GetContactAlbumsByIdAsnc(Int64 id)
        {
            //var spec = new UsersWithRoleSpecification(name);
            //return await GetAsync(spec);
            return await _dbContext.Contactsalbums.AsNoTracking()
               .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

        }

    }
}
