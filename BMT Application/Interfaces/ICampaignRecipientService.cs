using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.Application.Interfaces
{
    public interface ICampaignRecipientService
    {
        Task<IEnumerable<CompaignrecipientModel>> GetCampaignRecipientsByNetworkAndOrgList(int NetworkId, int OrgId);
        Task<IEnumerable<CompaignrecipientModel>> GetCampaignRecipientsAlFiltersList(CompaignrecipientModel model);
        Task<CompaignrecipientModel> GetCampaignRecipientsById(System.Int64 Id);
        Task<CompaignrecipientModel> Update(CompaignrecipientModel model);
        //  Task<CompaignrecipientModel> Update(CompaignrecipientModel model);

        // Task<IEnumerable<CompaigntemplateModel>> GetCitiesList(string details);
        //Task<IEnumerable<CityModel>> GetCitiesListByState(int state);

    }
}
