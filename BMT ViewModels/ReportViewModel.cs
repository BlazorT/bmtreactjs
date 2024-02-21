
namespace com.blazor.bmt.viewmodels
{
   
    public class ReportViewModel
    {
        public int? OrgId { get; set; }
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
        public string OrgName { get; set; }
        public string StatusStr { get; set; }

        public int? Status { get; set; }
        public DateTime? ExpiryTime { get; set; }
        public double budget { get; set; }
         
        public DateTime RegistrationTimeTo { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastUpdatedAt { get; set; }

        public int UserStatus { get; set; }
       

    }
}
