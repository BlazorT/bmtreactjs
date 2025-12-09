using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Efmigrationshistory
{
    public string MigrationId { get; set; } = null!;

    public string ProductVersion { get; set; } = null!;
}
