﻿namespace com.blazor.bmt.viewmodels;

public partial class CompaigntemplateViewModel 
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Title { get; set; }

    public string? Subject { get; set; }

    public string? Template { get; set; }
	public string? TemplateJson { get; set; }
	public int? NetworkId { get; set; }

    public int Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? LastUpdatedBy { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    public int RowVer { get; set; }
}
