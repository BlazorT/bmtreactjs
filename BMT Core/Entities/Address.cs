using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class Address :Entity
{
   // public int Id { get; set; }

    public int? UserId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public int? CityId { get; set; }

    public string Address1 { get; set; } = null!;

    public string? Address2 { get; set; }

    public string? ZipPostalCode { get; set; }

    public string? PhoneNumber { get; set; }

    public string? FaxNumber { get; set; }

    public int? AddressTypeId { get; set; }

    public string? CustomAttributes { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? RowVer { get; set; }
}
