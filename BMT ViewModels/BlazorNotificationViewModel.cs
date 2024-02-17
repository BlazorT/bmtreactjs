using Blazor.Web.ViewModels;

namespace com.blazor.bmt.viewmodels
{
    public class BlazorNotificationViewModel : BaseViewModel
    {
        public int NotificationId { get; set; }
        public int TypeId { get; set; }
        public string color { get; set; }
        public string Body { get; set; }
        public string Subject { get; set; }
        public string NotificationBaseColor { get; set; }
        public string Discription { get; set; }
        public string Date { get; set; }
        public string compareDate { get; set; }
        public string CurrentDate { get; set; }
        public string DateStr { get; set; }
        public int Priority { get; set; }
        public int CurrentStatus { get; set; }
        public DateTime Time { get; set; }
        public int ContractId { get; set; }
        public int InvoiceId { get; set; }
    }
}
