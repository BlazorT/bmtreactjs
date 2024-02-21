
using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;

namespace Blazor.Web.UI.Interfaces
{
    public interface IEnumPageService
    {
        Task<IEnumerable<EnumViewModel>> GetEnumCollection(PARENT_ENUMS selectionEnum, string IncludeAll);
        //Task<EnumViewModel> GenEnumViewModel(Enum enumOption,string optionText);
        Task<EnumViewModel> GenEnumViewModel(Enum enumOption ,int Id);
       
       
    }
}
