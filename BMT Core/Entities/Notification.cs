﻿using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Notification:EntityTransaction
{
    //public long Id { get; set; }

    public int Dspid { get; set; }

    public byte NotificationTypeId { get; set; }

    public string? Recipient { get; set; }

    public string? SendFrom { get; set; }

    public string? Body { get; set; }

    public string? Subject { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime ExpiryTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
