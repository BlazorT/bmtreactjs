using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class WorkflowtaskModel:BaseModel
{
   // public int Id { get; set; }

    public int? DspId { get; set; }

    public string Name { get; set; } = null!;

    public string? InitExpression { get; set; }

    public string? CompletionExpression { get; set; }

    public int? TaskTypeId { get; set; }

    public string? Description { get; set; }
    public int? AncestorTaskId { get; set; }

    // public int CreatedBy { get; set; }

    public int? PredesessorTaskId { get; set; }

    //public int? LastModifiedBy { get; set; }

    //public DateTime? LastModifiedOn { get; set; }

    //public DateTime CreatedOn { get; set; }

    public int CurrentStatus { get; set; }

    public int RowVer { get; set; } = 1;
}
