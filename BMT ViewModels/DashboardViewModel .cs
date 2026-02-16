namespace com.blazor.bmt.viewmodels
{
   
    public class DashboardViewModel
    {      

        public String DataOfMonth { get; set; }
        public int OrganizationId { get; set; }
        public int TotalCompaigns { get; set; }
        public int MonthNumber { get; set; }
        public int NewCompaigns { get; set; }
        public Double FundsAmount { get; set; }
        public Double PercentageIncrease { get; set; }   
    }
    public class FleetDashboardViewModel
    {
        // totalActive int  , totalOpr int,   totalGrnded int, allDefct int, repairsDue int,vhlgrnded int  
        public int totalActive { get; set; }
        public int totalOpr { get; set; }
        public int totalGrnded { get; set; }       
        public int allDefct { get; set; }
        public int repairsDue { get; set; }
        public int vhlgrnded { get; set; }
        public int RemOperational { get; set; }
        public int Pre_tipDVICAStats { get; set; }     
        public Double FundsAmount { get; set; }
        public Double PercentageIncrease { get; set; }
    }
}
