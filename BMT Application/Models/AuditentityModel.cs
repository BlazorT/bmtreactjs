﻿using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class AuditentityModel
{
    public int AuditEntityId { get; set; }

    public string? Name { get; set; }

    public int? CreatedBy { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

    public DateTime? RowVer { get; set; }
}
