
namespace com.blazor.bmt.viewmodels
{
    public class BaseViewModel
    {
        public int id { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? LastUpdatedBy { get; set; }
       // public Int64? rowVersion { get; set; }
       // public object entity { get; set; }

    }
    public class BaseViewModelTransaction
    {
        public Int64 Id { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? LastUpdatedBy { get; set; }
        // public Int64? rowVersion { get; set; }
        // public object entity { get; set; }

    }
}
