namespace com.blazor.bmt.viewmodels;

public partial class CampaignRecipientsViewModel 
{
     public Int64 Id { get; set; }

    public string? ContentId { get; set; }
    public int NetworkId { get; set; }
    public int OrgId { get; set; }
    public string? Desc { get; set; }

    public int? SourceId { get; set; }

    public int Status { get; set; }
    public int? albumid { get; set; }
    
    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
