namespace com.blazor.bmt.viewmodels
{
    public  class WebApiFilters
    {
        public string? dspid { get; set; }
        public string? name { get; set; }
        public string? email { get; set; }
        public string? remarks { get; set; }
        public string? id { get; set; }
        public string? userId { get; set; }
        public string? roleId { get; set; }
        public System.DateTime datefrom { get; set; } = DateTime.Now.AddMonths(-1);
        public System.DateTime dateto { get; set; } = DateTime.Now;
        public string? status { get; set; }

    }
}
