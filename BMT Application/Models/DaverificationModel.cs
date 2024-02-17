using Blazor.Web.Application.Models.Base;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class DaverificationModel : BaseModel
{
   // public int Id { get; set; }

    public int UserId { get; set; }

    /// <summary>
    /// Via SSN, Driving License, Birthday Certificate
    /// </summary>
    public int? VerificationVia { get; set; }

    public string? DocId { get; set; }

    public int? IssuingStateId { get; set; }

    public int? OfferAccepted { get; set; }

    public string? DocumentUri { get; set; }

    public string? Signature { get; set; }

    public string? FrontPic { get; set; }

    public string? BackPic { get; set; }

    public string? Remarks { get; set; }

    public int Status { get; set; }

    //public int? CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public string? HolderName { get; set; }
}
