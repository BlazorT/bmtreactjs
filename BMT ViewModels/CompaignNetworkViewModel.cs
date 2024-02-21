using System;
namespace com.blazor.bmt.viewmodels
{
    public partial class CompaignNetworkViewModel : BaseViewModelTransaction
    {
       // public long Id { get; set; }
        public long? CompaignId { get; set; }
        public int NetworkId { get; set; }
        public string? Desc { get; set; }
        public string? Code { get; set; }
        //public int? CreatedBy { get; set; }
        //public DateTime CreatedAt { get; set; }
        //public int? LastUpdatedBy { get; set; }
        //public DateTime? LastUpdatedAt { get; set; }
        public int Status { get; set; }
        public int RowVer { get; set; }
    }
}
