
namespace com.blazor.bmt.viewmodels
{
    public partial class StatesViewModel:BaseViewModel
    {
        //public States()
        //{
        //    Cities = new HashSet<Cities>();
        //}


        public string? Code { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int SortOrder { get; set; }
        public int? CountryId { get; set; }
        public int Status { get; set; }
        //public int? CreatedBy { get; set; }
        //public DateTime CreatedAt { get; set; }
        //public int? LastUpdatedBy { get; set; }
        //public DateTime? LastUpdatedAt { get; set; }
        public int RowVer { get; set; }

        //public virtual Statuses StatusNavigation { get; set; }
        //public virtual ICollection<Cities> Cities { get; set; }
    }
}
