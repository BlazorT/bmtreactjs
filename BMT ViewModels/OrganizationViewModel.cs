namespace com.blazor.bmt.viewmodels;

public partial class OrganizationViewModel 
{
     public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int? Strength { get; set; }
    public string? FMCToken { get; set; }
    public string? Address { get; set; }
    public string? Signature { get; set; }

    public string? Contact { get; set; }
    public string? PackageName { get; set; }
    public string? Email { get; set; }

    public string? IbanorWireTransferId { get; set; }

    public string? Fb { get; set; }

    public string? WhatsApp { get; set; }
    public string? WebAddress { get; set; }
    
    public string? LogoAvatar { get; set; }

    public string? Instagram { get; set; }
	public string? CountryCode { get; set; }

	public int? CurrencyId { get; set; }

    public int? CityId { get; set; }
	public int? CountryId { get; set; }

	public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? ExpiryTime { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
    public int? NetworkId { get; set; }
    public string? CurrencyName { get; set; }
    public int? CompaignsCount { get; set; }
    public string? CityName { get; set; }
    public string? StateName { get; set; }
    public string? UserName { get; set; }
    public int? StateId { get; set; }
}
