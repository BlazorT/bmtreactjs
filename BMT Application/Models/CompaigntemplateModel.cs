using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class CompaigntemplateModel : BaseModel
{
    //public int Id { get; set; }

    public string? Name { get; set; }

    public string? Title { get; set; }

    public string? Subject { get; set; }

    public string? Template { get; set; }

    public int? NetworkId { get; set; }

    public int Status { get; set; }

    //public int? CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
