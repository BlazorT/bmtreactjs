using Blazor.Web.Application.Interfaces;
using Blazor.Web.Application.Models;
using Blazor.Web.UI.Interfaces;
using Blazor.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using com.blazor.bmt.viewmodels;
using com.blazor.bmt.application.model;

namespace Blazor.Web.UI.Services
{
    public class PackagePageService : IPackagePageService
  
    {
        private readonly PackagePageService _PackagePageService;
        private readonly IMapper _mapper;
        private readonly ILogger<PackagePageService> _logger;
        public PackagePageService(PackagePageService PackagePageService, IMapper mapper, ILogger<UsersPageService> logger)
        {
            _PackagePageService = PackagePageService ?? throw new ArgumentNullException(nameof(PackagePageService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }


        public async Task UpdatePackage(PackageViewModel packagesViewModel)
    {
        var mapped = _mapper.Map<PackageModel>(packagesViewModel);
        if (mapped == null)
            throw new Exception($"Entity could not be mapped.");

        await _PackagePageService.UpdatePackage(packagesViewModel);
        _logger.LogInformation($"Entity successfully added - PackagePageService");
    }

}
}
