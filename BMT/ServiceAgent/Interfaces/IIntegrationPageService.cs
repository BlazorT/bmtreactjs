using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.interfaces
{
        public interface IIntegrationPageService
    {   
        Task<IEnumerable<IntegrationservicesettingViewModel>> GetIntegrationServicesByName(string name);
        Task<IEnumerable<IntegrationservicesettingViewModel>> GetIntegrationServicesAllAsync(IntegrationservicesettingViewModel model);      
        Task<IntegrationservicesettingViewModel> GetByIdAsync(int id);      
        Task<IntegrationservicesettingViewModel> Create(IntegrationservicesettingViewModel vModel);      
        Task Update(IntegrationservicesettingViewModel model);
        Task Delete(IntegrationservicesettingViewModel model);
    }
    }

