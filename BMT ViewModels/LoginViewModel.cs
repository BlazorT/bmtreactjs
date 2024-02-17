namespace com.blazor.bmt.viewmodels
{
    public class LoginViewModel 
    {
        public int Id { get; set; }
        public string userName { get; set; }
        public Int32 DspId { get; set; }
        public string FullName { get; set; }       
        public string? Email { get; set; }
        public string Password { get; set; }
        public DateTime LoginTime { get; set; }
        public DateTime? doj { get; set; }
        public string LoginMachineIp { get; set; }
        public string UserRole { get; set; }       
        public int RoleId { get; set; }
        public string UserContact { get; set; }
        public string UserStateName { get; set; }
        public int UserStateId { get; set; }
        public Int32 UserCityId { get; set; }
        public string? Avatar { get; set; }
       //public Int32 SubscriptionPackageId { get; set; }        
        public int UserStatus { get; set; }
        public int AlreadyLoginStatus { get; set; }
        public string? DspLogo { get; set; }
        public DateTime? dob { get; set; }
        public string? DspCityName { get; set; }
        public Int32 DspCityId { get; set; }
        public Int32 DspStateId { get; set; }
        public string? DspStateName { get; set; }
        public string? DspName { get; set; }
        public string? WhatsApp { get; set; }      
        public string? DspContact { get; set; }
        public string? TradeName { get; set; }
        public string? Address { get; set; }
    }
}
