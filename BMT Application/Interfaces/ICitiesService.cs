using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface ICitiesService
    {
        Task<IEnumerable<CityModel>> GetCitiesByStatusList(int status);
     
        Task<IEnumerable<CityModel>> GetCitiesList(string details);
        Task<IEnumerable<CityModel>> GetCitiesListByState(int state);

    }
}
