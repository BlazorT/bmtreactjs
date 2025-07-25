using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface ICampaignTemplateService
    {
        Task<IEnumerable<CompaigntemplateModel>> GetCampaignTemplatesByNetworkList(int NetworkId);
     
       // Task<IEnumerable<CompaigntemplateModel>> GetCitiesList(string details);
        //Task<IEnumerable<CityModel>> GetCitiesListByState(int state);

    }
}
