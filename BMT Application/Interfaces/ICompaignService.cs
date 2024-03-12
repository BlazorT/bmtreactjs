using Blazor.Web.Application.Models;
using com.blazor.bmt.application.model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.interfaces
{
    public interface ICompaignService
    {
        Task<IEnumerable<CompaignModel>> GetCompaignsListByStatusAsync(int status);
     
        Task<IEnumerable<CompaignModel>> GetCompainListByNameAsync(string details);
        Task<IEnumerable<CompaignModel>> GetCompainListAllFiltersAsync(CompaignModel compaign);
        Task<CompaignModel> Create(CompaignModel configurationsModel);
        Task Update(CompaignModel configurationsModel);


    }
}
