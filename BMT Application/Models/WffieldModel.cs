﻿using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;
public partial class WffieldModel : BaseModelTransactions {
    //public long Id { get; set; }

    public int? EntityId { get; set; }

    public byte DataTypeId { get; set; }

    public int FieldTypeId { get; set; }

    public string? Name { get; set; }

    public string? Expression { get; set; }

    public int Length { get; set; }

    public string? DefaultValue { get; set; }

    //public int CreatedBy { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    //public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

   // public int RowVer { get; set; }

    public int? ServiceId { get; set; }

    public long? DspFieldId { get; set; }
}
