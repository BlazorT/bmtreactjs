using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class User:Entity
{
    //  public int Id { get; set; }

    public string UserCode { get; set; } = null!;

    public int? PaymentDetailId { get; set; }

    public int? OrgId { get; set; }

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string? FirstName { get; set; }

    public string UserName { get; set; } = null!;

    public string? Fmctoken { get; set; }

    public string? Avatar { get; set; }

    public string? SecurityToken { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int RoleId { get; set; }

    public string? Address { get; set; }

    public string Contact { get; set; } = null!;

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public byte? RegistrationSource { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public DateTime? Dob { get; set; }

    public string? Remarks { get; set; }

    public string? Gpslocation { get; set; }

    public string? Ims { get; set; }

    public int? AddressId { get; set; }

    public string? GenderId { get; set; }

    public float? BusinessVolume { get; set; }

    public DateTime? RegistrationTime { get; set; }

    public int? CityId { get; set; }
}
