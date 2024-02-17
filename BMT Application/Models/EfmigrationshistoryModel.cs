using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class EfmigrationshistoryModel
{
    public string MigrationId { get; set; } = null!;

    public string ProductVersion { get; set; } = null!;
}
