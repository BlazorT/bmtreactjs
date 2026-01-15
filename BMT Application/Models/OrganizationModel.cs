using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class OrganizationModel : BaseModel
{
    // public int Id { get; set; }
    public string? Name { get; set; }

    public string? Description { get; set; }
    public string? FMCToken { get; set; }
    public int? Strength { get; set; }

    public string? Address { get; set; }
    public string? Signature { get; set; }
    public string? Contact { get; set; }

    public string? Email { get; set; }

    public string? IbanorWireTransferId { get; set; }

    public string? Fb { get; set; }

    public string? WhatsApp { get; set; }

    public string? LogoAvatar { get; set; }

    public string? Instagram { get; set; }

    public int? CurrencyId { get; set; }
    public string? WebAddress { get; set; }
    public int? CityId { get; set; }

    public int Status { get; set; }
    
    public int RowVer { get; set; }  

    public DateTime? ExpiryTime { get; set; }

   
}
