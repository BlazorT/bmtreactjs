using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface ICampaignTemplateRepository: IRepository<Compaigntemplate>

	{
        Task<IEnumerable<Compaigntemplate>> GetCompaigntemplatesByNetworkList(int NetworkId);
		Task<IEnumerable<Compaigntemplate>> GetCompaigntemplatesAllFiltersList(Compaigntemplate model);
		Task<Compaigntemplate> GetCompaignTemplateByIdAsnc(Int32 id);
		//Task<IEnumerable<City>> GetCitiesList(string name);

	}
}
