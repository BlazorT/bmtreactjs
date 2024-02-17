using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Dspstable:EntityTransaction
{
    //public long Id { get; set; }

    public int Tid { get; set; }

    public string? ColumnName { get; set; }

    public string? TableName { get; set; }

    public string? DataType { get; set; }

    public string? FieldType { get; set; }

    public string? Expression { get; set; }

    public int? CharacterLength { get; set; }

    public int ColumnOrdinal { get; set; }

    public int Nullable { get; set; }

    public string? DefaultValue { get; set; }

    public int Status { get; set; }
}
