using System;
using System.Collections.Generic;

namespace com.blazor.bmt.viewmodels;

public partial class DispatchmentCustomViewMode
{
    public long Id { get; set; }

    public int? Dspid { get; set; }
    public int? InventoryOf { get; set; }

    public int? assignedQty { get; set; }
    public int? availableQty { get; set; }

    public string? itemName { get; set; }

    public string? assignByName { get; set; }
    public int? assignTo { get; set; }
    public int? CreatedBy { get; set; }

    public int? isAssigned { get; set; } = 0;
    public int? LastUpdatedBy { get; set; }

    public int? productDetailId { get; set; } = 0;
    public int? VehicleId { get; set; }

    public DateTime? CreatedAt { get; set; }
    public DateTime? LastUpdatedAt { get; set; }
    public string? shortcode { get; set; }
    public string? remarks { get; set; }
    public int? status { get; set; }

    public int? RowVer { get; set; }




}
