using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class StateModel:BaseModel
{
    //public int Id { get; set; }

    public string? Code { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int SortOrder { get; set; }

    public int? CountryId { get; set; }

    public int Status { get; set; }

    //public int? CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
