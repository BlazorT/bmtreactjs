namespace com.blazor.bmt.viewmodels;
    public  class AppLogViewModel
    {
    public Int64 Id  { get; set; }
    public string? MachineIp { get; set; }

    public int UserId { get; set; }

    public int? Dspid { get; set; }

    public int? MenuId { get; set; }

    public string? LogDesc { get; set; }

    public byte? ActionType { get; set; }

    public DateTime? LogTime { get; set; }

    public string? Synccode { get; set; }


    public string? UserName { get; set; }
    public string? EntityName { get; set; }
    public string? keyword { get; set; }
  
    public DateTime? LogTimeTo { get; set; }

    // public virtual Dsp Dsp { get; set; } = null!;
}

