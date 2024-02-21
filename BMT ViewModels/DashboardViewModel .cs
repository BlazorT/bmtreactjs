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
}
