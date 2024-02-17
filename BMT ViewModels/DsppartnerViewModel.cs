namespace com.blazor.bmt.viewmodels;

public partial class DsppartnerViewModel
{

    public int Id { get; set; }

    public int Dspid { get; set; }

    public string? FullName { get; set; }

    public string BusinessName { get; set; } = null!;

    /// <summary>
    /// States if of the country
    /// </summary>
    public int? StateId { get; set; }

    public string Email { get; set; } = null!;

    public DateTime? Dob { get; set; }

    public string? Avatar { get; set; }

    public string? Address { get; set; }

    public string PrimaryContact { get; set; } = null!;

    public string? SecondaryContact { get; set; }

    public string? IdentityId { get; set; }

    public int? DecisionMakingAuthority { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    /// <summary>
    /// Sole Proprieter, Partnership, etc
    /// </summary>
    public int RowVer { get; set; }

    public uint? BusinessTypeId { get; set; }

}
