﻿using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Inventorydetail: EntityTransaction
{
    // public long Id { get; set; }

    public int Dspid { get; set; }

    public int ProductDetailId { get; set; }

    public string BarCode { get; set; } = null!;

    public double? SoldQty { get; set; }

    public double PurchasedQty { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? Status { get; set; }

    public int RowVer { get; set; }

    public int? AssignedTo { get; set; }

    public int? AssignedQty { get; set; }
}
