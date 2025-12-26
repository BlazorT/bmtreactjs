using com.blazor.bmt.core.baseentity;
using System;
namespace com.blazor.bmt.core;

public partial class Templatevariable: EntityTransaction
{
  //  public long Id { get; set; }

    public int? Networkid { get; set; }

    public int? Orgid { get; set; }

    public byte DataTypeId { get; set; }

    public int FieldTypeId { get; set; }
    public int? isMandatory { get; set; }
    
    public string? Name { get; set; }

    public string? Expression { get; set; }

    public int? Length { get; set; }

    public string? DefaultValue { get; set; }

    public Int32? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int Status { get; set; }

    public int RowVer { get; set; }
}
