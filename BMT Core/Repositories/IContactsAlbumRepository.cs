using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IContactsAlbumRepository: IRepositoryTransaction<Contactsalbum>
    {
        Task<IEnumerable<Contactsalbum>> GetContactAlbumsByNetworkLAndOrgist(int NetworkId, int OrgId);
        Task<IEnumerable<Contactsalbum>> GetContactAlbumsListAllFilters(Contactsalbum model);
        Task<Contactsalbum> GetContactAlbumsByIdAsnc(Int64 id);


    }
}
