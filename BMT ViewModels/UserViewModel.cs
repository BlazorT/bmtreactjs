﻿namespace com.blazor.bmt.viewmodels;

public partial class UserViewModel
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string? FirstName { get; set; }

    public string UserName { get; set; } = null!;
    public string? DspName { get; set; } = null!;

    public string? Performance { get; set; } = null!;
    public int? Violations { get; set; }
    public int? StateId { get; set; }

    public string? Fmctoken { get; set; }

    public string? Im { get; set; }

    public string? keyword { get; set; }
    
    public string? userRole { get; set; }

    public string? stateName { get; set; }

    public string? issuingstate { get; set; } 

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? Dspid { get; set; }

    public int RoleId { get; set; }

    public string? Avatar { get; set; }

    public string? Address { get; set; }

    public string PrimaryContact { get; set; } = null!;

    public string? SecondaryContact { get; set; }

    public string? IdentityId { get; set; }

    public int? HasValidDrivingLicense { get; set; } = 0;

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public byte? RegistrationSource { get; set; } = 0;

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; } = 1;

    public string? Token { get; set; }

    public DateTime? Dob { get; set; }

    public string? LicenseNo { get; set; }

    public int? IssuingStateId { get; set; }

    public DateTime? LicenseIssueDate { get; set; }

    public DateTime? LicenseExpiryDate { get; set; }

    public string? Ssn { get; set; }

    public int? VerificationMethod { get; set; } = 0;

    public string? Remarks { get; set; }
}
