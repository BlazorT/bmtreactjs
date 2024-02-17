
namespace com.blazor.bmt.viewmodels
{
   
    public class ReportViewModel
    {
        public string UserName { get; set; }
        public string head { get; set; }
        public string keyword { get; set; }
        public DateTime RegistrationTime { get; set; }
        public DateTime ExpireTime { get; set; }
        public Double TotalAmount { get; set; }
        public Double NoOfRequest { get; set; }
        public int availableVehicles { get; set; }
        public int soldVehicles { get; set; }
        public int totalVehicles { get; set; }
        public string UserStatusStr { get; set; } 
        
        public DateTime RegistrationTimeTo { get; set; }
        public int UserStatus { get; set; }
       

    }
}
