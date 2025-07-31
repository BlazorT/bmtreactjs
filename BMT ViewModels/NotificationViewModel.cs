
using System.Text.Json.Serialization;

namespace com.blazor.bmt.viewmodels
{
    public class NotificationViewModel
    {
        //    [JsonPropertyName("deviceId")]
        //    public string DeviceId { get; set; }
        //    [JsonPropertyName("isAndroiodDevice")]
        //    public bool IsAndroiodDevice { get; set; }

        public long Id { get; set; }

        public int NetworkId { get; set; }

        public int? ComaignId { get; set; }

        public int? OrganizationId { get; set; }

        public byte NotificationTypeId { get; set; }

        public string? MessageRefId { get; set; }
        public int? DeliveryStatus { get; set; }


        public string? Recipient { get; set; }

        public string? SendFrom { get; set; }

        public string? Body { get; set; }

        public string? Subject { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }
        public int? likesCount { get; set; }
        public int? sharesCount { get; set; }
        public int? clicksCount { get; set; }
        public int? commentsCount { get; set; }
        public int? readCount { get; set; }
        public int? viewsCount { get; set; }
        public int CreatedBy { get; set; }

        public DateTime ExpiryTime { get; set; }

        public int? LastUpdatedBy { get; set; }

        public DateTime? LastUpdatedAt { get; set; }

        public DateTime CreatedAt { get; set; }

        public int Status { get; set; }

        public int RowVer { get; set; }
        //public virtual User CreatedByNavigation { get; set; } = null!;
        //public virtual User LastUpdatedByNavigation { get; set; }
    }
}
