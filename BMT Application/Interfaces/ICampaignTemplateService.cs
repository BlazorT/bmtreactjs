using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface ICampaignTemplateService
    {
        Task<IEnumerable<CompaigntemplateModel>> GetCampaignTemplatesByNetworkList(int NetworkId);
		Task<CompaigntemplateModel> GetCampaignTemplatesById(int id);

		Task<CompaigntemplateModel> Create(CompaigntemplateModel model);
		//Task Update(CompaigntemplateModel model);
		//Task Delete(CompaigntemplateModel model);

		// Task<IEnumerable<CompaigntemplateModel>> GetCitiesList(string details);
		//Task<IEnumerable<CityModel>> GetCitiesListByState(int state);

	}
}
