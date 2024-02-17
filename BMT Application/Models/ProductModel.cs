using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class ProductModel:BaseModel
{
   // public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ShortCode { get; set; }

    public string? BarCode { get; set; }

    public string? Description { get; set; }

    public int? CategoryId { get; set; }
    public int? BusinessEntityId { get; set; } = 0;
    public int? AssignmentType { get; set; }
    public int ManufactureCountryId { get; set; }

    public int GroupId { get; set; }

    //public int CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? UpdatedBy { get; set; }

    //public DateTime? UpdatedAt { get; set; }

    public string? Picture { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }
}
