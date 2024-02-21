namespace com.blazor.bmt.viewmodels;
    public  class WebApiFilters
    {
        public string? orgId { get; set; }
        public string? name { get; set; }
    public string? email { get; set; }
    
        public string? remarks { get; set; }
        public string? id { get; set; }
        public string? userId { get; set; }
    public string? roleId { get; set; }
    public string? demand { get; set; }
        public System.DateTime datefrom { get; set; } = System.DateTime.Now.AddDays(-1);
        public System.DateTime dateto { get; set; } = System.DateTime.Now;
        public string? status { get; set; }

    }

