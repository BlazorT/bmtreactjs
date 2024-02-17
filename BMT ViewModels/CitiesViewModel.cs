using System;

namespace com.blazor.bmt.viewmodels
{
    public partial class CitiesViewModel :BaseViewModel
    {

        public string Name { get; set; } = null!;
        public string? Code { get; set; }
        public string Description { get; set; } = null!;
        public int SortOrder { get; set; }
        public int StateId { get; set; }
        public int Status { get; set; }
        //public int? CreatedBy { get; set; }
        //public DateTime? CreatedAt { get; set; }
        //public int? LastUpdatedBy { get; set; }
        //public DateTime LastUpdatedAt { get; set; }
        public int RowVer { get; set; }


    }
    public partial class CitiesAndStatesViewModel  {
        public string cityName { get; set; } = null!;
        public string? StateName { get; set; }   
        public int CityId { get; set; }
        public int Status { get; set; }
        public int StateId { get; set; }
    }
}
