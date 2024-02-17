using com.blazor.bmt.util;
using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.ui.interfaces
{
    public interface IEnumPageService
    {
        Task<IEnumerable<EnumViewModel>> GetEnumCollection(UTIL.PARENT_ENUMS selectionEnum, string IncludeAll);
        //Task<EnumViewModel> GenEnumViewModel(Enum enumOption,string optionText);
        Task<EnumViewModel> GenEnumViewModel(Enum enumOption ,int Id);
       
       
    }
}
