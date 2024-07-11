using System;
using System.Collections.Generic;

namespace BMT_Web.bmtfolder;

public partial class Compaignscheduleday
{
    public long Id { get; set; }

    public long CompaignScheduleId { get; set; }

    public int? DayNumber { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
