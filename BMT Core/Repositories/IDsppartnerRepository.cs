using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IDsppartnerRepository : IRepository<Dsppartner>
    {
        Task<IEnumerable<Dsppartner>> GetDspPartnersListByStatusAsync(int dspid,int status);
        Task<IEnumerable<Dsppartner>> GetDspPartnersByNameAsync(string name);
        Task<IEnumerable<Dsppartner>> GetDspPartnersAllFiltersAsync(Dsppartner model);
        Task<IEnumerable<Dsppartner>> bulkaddorupdates(List<Dsppartner> ls);
        Task<Dsppartner> GetDspPartnersByIDeAsync(Int32 id);


    }
}
