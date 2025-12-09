using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface IContactAlbumService
    {
        Task<IEnumerable<ContactsalbumModel>> GetContactAlbumsByNetworkAndOrgList(int NetworkId, int OrgId);
        Task<IEnumerable<ContactsalbumModel>> GetContactAlbumsAlFiltersList(ContactsalbumModel model);
        Task<ContactsalbumModel> GetContactAlbumById(System.Int64 Id);
        Task<ContactsalbumModel> Create(ContactsalbumModel configurationsModel);
        Task Update(ContactsalbumModel model);
        // Task<IEnumerable<CompaigntemplateModel>> GetCitiesList(string details);
        //Task<IEnumerable<CityModel>> GetCitiesListByState(int state);

    }
}
