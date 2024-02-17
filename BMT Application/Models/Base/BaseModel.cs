using System;

namespace Blazor.Web.Application.Models.Base
{
    public class BaseModel
    {
        public int id { get; set; }
        public DateTime? LastUpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? LastUpdatedBy { get; set; }
      //  public Int64? rowVersion { get; set; }
    }
}
