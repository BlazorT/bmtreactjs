using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Efmigrationshistory 
{
    public string MigrationId { get; set; } = null!;

    public string ProductVersion { get; set; } = null!;
}
