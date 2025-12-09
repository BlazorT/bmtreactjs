using Blazor.Web.Application.Models.Base;
namespace com.blazor.bmt.application.model;

public partial class CompaignrecipientModel : BaseModel
{
   // public long Id { get; set; }

    public int? NetworkId { get; set; }

    public string ContentId { get; set; } = null!;
    public string[]? Contentlst { get; set; } 

    public int? SourceId { get; set; }
    public int? albumid { get; set; }
    public string? Desc { get; set; }

    public int? OrgId { get; set; }

    //public int CreatedBy { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public int? LastUpdatedBy { get; set; }

    //public DateTime LastUpdatedAt { get; set; }

    public int RowVer { get; set; }

    public int? Status { get; set; }
}
