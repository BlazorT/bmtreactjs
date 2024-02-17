using System;

namespace Blazor.Web.Application.Models.Base
{
    public class BaseModelTransactions
    {
        public Int64 id { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public int RowVer { get; set; }


    }
}
