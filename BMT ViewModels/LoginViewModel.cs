namespace com.blazor.bmt.viewmodels
{
    public class LoginViewModel 
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime LoginTime { get; set; }
        public string LoginMachineIp { get; set; }
        public string UserRole { get; set; }
        public int RoleId { get; set; }
        public int UserStatus { get; set; }
        public int AlreadyLoginStatus { get; set; }
    }
}
