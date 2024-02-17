using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class UserModel:BaseModel
{
    //public int Id { get; set; }

    public int Id { get; set; }

    public int? PaymentDetailId { get; set; }

    public int? OrgId { get; set; }

    public string UserCode { get; set; } = null!;

    public int? RegistrationSource { get; set; }

    public string? Fmctoken { get; set; }

    public int? CityId { get; set; }

    public string? UserName { get; set; }

    public string? SecurityToken { get; set; }

    public string? Contact { get; set; }

    public string FirstName { get; set; } = null!;

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string? Nick { get; set; }

    public string Email { get; set; } = null!;

    public string? Password { get; set; }

    public int RoleId { get; set; }

    public string? Gpslocation { get; set; }

    public string? Ims { get; set; }

    public int? AddressId { get; set; }

    public int GenderId { get; set; }

    public string? Avatar { get; set; }

    public string? Remarks { get; set; }

    public string? Title { get; set; }

    public int Status { get; set; }

    public decimal? BusinessVolume { get; set; }

    public DateTime? Dob { get; set; }

    public DateTime? RegistrationTime { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
