namespace com.blazor.bmt.viewmodels;
    public  class AppLogViewModel
    {
    public long Id { get; set; }

    public string? MachineIp { get; set; }

    public int UserId { get; set; }

    public int? MenuId { get; set; }

    public string? LogDesc { get; set; }

    public byte? ActionType { get; set; }

    public DateTime? LogTime { get; set; }
}
