﻿using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Inbounddata
{
    public long Id { get; set; }

    public int Dspid { get; set; }

    public uint Fieldid { get; set; }

    public string? Value { get; set; }

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime ExpiryTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }

    public int? Datatypeid { get; set; }

    public DateTime? Synctime { get; set; }
}
