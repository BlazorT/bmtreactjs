using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;

namespace com.blazor.bmt.application.model;
public partial class DspModel : BaseModel
{
    //public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? TradeName { get; set; }

    public string Address { get; set; } = null!;

    public string? WhatsApp { get; set; }

    public string? Contact2 { get; set; }

    public string Email { get; set; } = null!;

    public string? SurfaceAddress { get; set; }

    public string? VatregistrationNo { get; set; }

    public string? LogoPath { get; set; }

    public string? WebAddress { get; set; }

    public int? StateId { get; set; }

    public string Contact { get; set; } = null!;

    public int? IsMainDsp { get; set; }

    public int? UpdatedBy { get; set; }

    public string? Fmctoken { get; set; }

    public string? License { get; set; }

    public int? BusinessTypeId { get; set; }

    public DateTime? RegTime { get; set; }

    public DateTime? ExpiryDate { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    //public int? CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }

    public int? PartnersCount { get; set; }
}
