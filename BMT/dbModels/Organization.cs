using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Organization
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string Address { get; set; } = null!;

    public string Contact { get; set; } = null!;

    public string? WhatsApp { get; set; }

    public int? Strength { get; set; }

    public string Email { get; set; } = null!;

    public string? IbanorWireTransferId { get; set; }

    public string? LogoAvatar { get; set; }

    public string? WebAddress { get; set; }

    public string? Instagram { get; set; }

    public string? Fb { get; set; }

    public int? CurrencyId { get; set; }

    public int? CityId { get; set; }

    public int? UpdatedBy { get; set; }

    public string? Fmctoken { get; set; }

    public DateTime? ExpiryTime { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }
}
