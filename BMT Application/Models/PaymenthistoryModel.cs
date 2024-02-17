using Blazor.Web.Application.Models.Base;
using com.blazor.bmt.core.baseentity;
using System;
using System.Collections.Generic;

namespace com.blazor.bmt.application.model;

public partial class PaymenthistoryModel : BaseModelTransactions
{
    //public long Id { get; set; }

    public long PaymentId { get; set; }

    public long? CompaignId { get; set; }

    public int? OrgId { get; set; }

    public string? TransactionCode { get; set; }

    public string? TransactionId { get; set; }

    public string? CustomerId { get; set; }

    public string? CustomerProfileId { get; set; }

    public string? ZipCode { get; set; }

    public string? InvoiceCode { get; set; }

    public double? DeliveryCharges { get; set; }

    public double? TaxAmount { get; set; }

    public double? TotalChargedAmnt { get; set; }

    public byte PaymentMethodId { get; set; }

    public DateTime? Birthdate { get; set; }

    public string? ShippingAddress { get; set; }

    public string? BillingAddress { get; set; }

    public string LastName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string CustomerEmail { get; set; } = null!;

    public string? CardExiry { get; set; }

    public string? Cvc { get; set; }

    public string? CardNumber { get; set; }

    public string? CardHolderTitle { get; set; }

    public DateTime? DishonorTime { get; set; }

    public DateTime? ValueTime { get; set; }

    public string? TransactionResponse { get; set; }

    public string? Note { get; set; }

    public DateTime? TransactionTime { get; set; }

    public DateTime? ArchiveTime { get; set; }

    public int Status { get; set; }
}
