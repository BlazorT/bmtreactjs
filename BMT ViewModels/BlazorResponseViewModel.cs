
namespace com.blazor.bmt.viewmodels
{
    public class BlazorResponseViewModel : BaseViewModel
    {
        public bool status { get; set; } = false;
        public string keyValue { get; set; } = string.Empty;
        public int effectedRows { get; set; } = 0;
        public string keyElement { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public DateTime updateTime { get; set; } = DateTime.Now;
        public string returnURL { get; set; } = string.Empty;  
        public object data { get; set; }  

    }
}
