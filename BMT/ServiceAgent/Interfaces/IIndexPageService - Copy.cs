using com.blazor.bmt.viewmodels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
    // NOTE : This is the whole page service, it could be include all categories and products
    // this is the razor page based service
    public interface IIndexPageService
    {
        Task<IEnumerable<VehicleViewModel>> GetProducts();        
    }
}
