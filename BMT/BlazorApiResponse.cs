using System;

namespace com.blazor.bmt
{
    public class BlazorApiResponse
    {
        public bool status { get; set; } = false;
        public string keyValue { get; set; } = string.Empty;
        public int effectedRows { get; set; } = 0;
        public string keyElement { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public string errorCode { get; set; } = "0";
        public DateTime updateTime { get; set; } = DateTime.Now;
        public object data { get; set; }
    }
}
