using System;
using System.Collections.Generic;

namespace bmt.web.dbModels;

public partial class Payment
{
    public long Id { get; set; }

    public long? CompaignId { get; set; }

    public int? OrgId { get; set; }

    public string? TransactionCode { get; set; }

    public string? TransactionId { get; set; }

    public string? CustomerId { get; set; }

    public string? CustomerProfileId { get; set; }

    public string? ZipCode { get; set; }

    public string? InvoiceCode { get; set; }

    public float? DeliveryCharges { get; set; }

    public float? TaxAmount { get; set; }

    public float? TotalChargedAmnt { get; set; }

    public int PaymentMethodId { get; set; }

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

    public int Status { get; set; }

    public virtual ICollection<Paymenthistory> Paymenthistories { get; set; } = new List<Paymenthistory>();
}
