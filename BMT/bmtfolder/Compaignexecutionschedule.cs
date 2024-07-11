﻿using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Compaignexecutionschedule
{
    public long Id { get; set; }

    public int? NetworkId { get; set; }

    public long CompaignDetailId { get; set; }

    public float? Budget { get; set; }

    public int? Interval { get; set; }

    public int? IntervalTypeId { get; set; }

    public long? MessageCount { get; set; }

    public DateTime? FinishTime { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
