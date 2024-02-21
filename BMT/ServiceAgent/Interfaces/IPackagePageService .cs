using com.blazor.bmt.viewmodels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Blazor.Web.UI.Interfaces
{
    public interface IPackagePageService
    {
        Task UpdatePackage(PackageViewModel packagesViewModel);
    }
}
