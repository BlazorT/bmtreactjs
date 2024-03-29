﻿using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class ConfigurationModel:BaseModel
{
    //public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? OrganizationId { get; set; }

    public int? NetworkId { get; set; }

    public string Description { get; set; } = null!;

    public string Key { get; set; } = null!;

    public string Value { get; set; } = null!;

    public int Status { get; set; }

    //public int? CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
