using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.core;

public partial class User:Entity
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string? FirstName { get; set; }

    public string UserName { get; set; } = null!;

    public int? StateId { get; set; }

    public string? Fmctoken { get; set; }

    public string? Im { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? Dspid { get; set; }

    public int RoleId { get; set; }

    public string? Avatar { get; set; }

    public string? Address { get; set; }

    public string PrimaryContact { get; set; } = null!;

    public string? SecondaryContact { get; set; }

    public string? IdentityId { get; set; }

    public int? HasValidDrivingLicense { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public byte? RegistrationSource { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public string? Token { get; set; }

    public DateTime? Dob { get; set; }

    public string? LicenseNo { get; set; }

    public int? IssuingStateId { get; set; }

    public DateTime? LicenseIssueDate { get; set; }

    public DateTime? LicenseExpiryDate { get; set; }

    public string? Ssn { get; set; }

    public int? VerificationMethod { get; set; }

    public string? Remarks { get; set; }
}
