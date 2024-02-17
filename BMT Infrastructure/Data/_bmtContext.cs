using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Eventing.Reader;
using com.blazor.bmt.core;
using com.blazor.bmt.util;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace com.blazor.bmt.infrastructure;
public partial class _bmtContext : DbContext
{
    public _bmtContext()
    {
    }

    public _bmtContext(DbContextOptions<_bmtContext> options)
        : base(options)
    {
        //this.Configuration.LazyLoadingEnabled = false;
    }
    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Alertlevel> Alertlevels { get; set; }

    public virtual DbSet<Applog> Applogs { get; set; }

    public virtual DbSet<Apptrace> Apptraces { get; set; }

    public virtual DbSet<Auditentity> Auditentities { get; set; }

    public virtual DbSet<Auditlog> Auditlogs { get; set; }

    public virtual DbSet<Bundlingpackagedetail> Bundlingpackagedetails { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Compaign> Compaigns { get; set; }

    public virtual DbSet<Compaignexecutionschedule> Compaignexecutionschedules { get; set; }

    public virtual DbSet<Compaignnetwork> Compaignnetworks { get; set; }

    public virtual DbSet<Compaignscheduleday> Compaignscheduledays { get; set; }

    public virtual DbSet<Compaigntemplate> Compaigntemplates { get; set; }

    public virtual DbSet<Configuration> Configurations { get; set; }

    public virtual DbSet<Contentcategory> Contentcategories { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<Efmigrationshistory> Efmigrationshistories { get; set; }

    public virtual DbSet<Globalnetworkdetail> Globalnetworkdetails { get; set; }

    public virtual DbSet<Intervaltype> Intervaltypes { get; set; }

    public virtual DbSet<Lead> Leads { get; set; }

    public virtual DbSet<Mediacontent> Mediacontents { get; set; }

    public virtual DbSet<Mediapicture> Mediapictures { get; set; }

    public virtual DbSet<Mediasourceinfo> Mediasourceinfos { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Network> Networks { get; set; }

    public virtual DbSet<Noimage> Noimages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Notificationlog> Notificationlogs { get; set; }

    public virtual DbSet<Notificationtype> Notificationtypes { get; set; }

    public virtual DbSet<Onlineuser> Onlineusers { get; set; }

    public virtual DbSet<Organization> Organizations { get; set; }

    public virtual DbSet<Orgpackagedetail> Orgpackagedetails { get; set; }

    public virtual DbSet<Package> Packages { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Paymenthistory> Paymenthistories { get; set; }

    public virtual DbSet<Paymentmethod> Paymentmethods { get; set; }

    public virtual DbSet<Posttype> Posttypes { get; set; }

    public virtual DbSet<Rolemenu> Rolemenus { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<Status> Statuses { get; set; }

    public virtual DbSet<Tradeunit> Tradeunits { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Userrole> Userroles { get; set; }

    public virtual DbSet<Usersaccesshistory> Usersaccesshistories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
         => optionsBuilder.UseMySQL(BlazorConstant.CONNECTION_STRING);
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("address");

            entity.Property(e => e.Address1).HasMaxLength(500);
            entity.Property(e => e.Address2).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FaxNumber).HasMaxLength(20);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.ZipPostalCode).HasMaxLength(50);
        });

        modelBuilder.Entity<Alertlevel>(entity =>
        {
            entity.HasKey(e => e.LevelId).HasName("PRIMARY");

            entity.ToTable("alertlevels");

            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Applog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("applog");

            entity.Property(e => e.LogDesc).HasMaxLength(500);
            entity.Property(e => e.LogTime).HasColumnType("datetime(3)");
            entity.Property(e => e.MachineIp)
                .HasMaxLength(20)
                .HasColumnName("MachineIP");
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<Apptrace>(entity =>
        {
            entity.HasKey(e => e.AppTraceId).HasName("PRIMARY");

            entity.ToTable("apptrace");

            entity.Property(e => e.MachineIp)
                .HasMaxLength(20)
                .HasColumnName("MachineIP");
            entity.Property(e => e.TraceDesc).HasMaxLength(500);
            entity.Property(e => e.TraceTime).HasColumnType("datetime(3)");
            entity.Property(e => e.UniqueId).HasMaxLength(20);
        });

        modelBuilder.Entity<Auditentity>(entity =>
        {
            entity.HasKey(e => e.AuditEntityId).HasName("PRIMARY");

            entity.ToTable("auditentities");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.RowVer).HasColumnType("datetime(3)");
        });

        modelBuilder.Entity<Auditlog>(entity =>
        {
            entity.HasKey(e => e.AuditLogId).HasName("PRIMARY");

            entity.ToTable("auditlog");

            entity.Property(e => e.AttributeName).HasMaxLength(150);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.KeyValue).HasMaxLength(30);
            entity.Property(e => e.NewValue).HasMaxLength(350);
            entity.Property(e => e.OldValue).HasMaxLength(350);
        });

        modelBuilder.Entity<Bundlingpackagedetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("bundlingpackagedetails");

            entity.Property(e => e.ApprovalTime).HasColumnType("datetime(3)");
            entity.Property(e => e.BundlingAllowed).HasDefaultValueSql("'1'");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.CurrentApplied).HasDefaultValueSql("'0'");
            entity.Property(e => e.FinishTime).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
            entity.Property(e => e.StartTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Tax).HasDefaultValueSql("'0'");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cities");

            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Compaign>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaigns");

            entity.Property(e => e.ApprovalTime).HasColumnType("datetime(3)");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.FinishTime).HasColumnType("datetime(3)");
            entity.Property(e => e.HashTags).HasMaxLength(2000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.OrgId).HasDefaultValueSql("'0'");
            entity.Property(e => e.Remarks).HasMaxLength(2000);
            entity.Property(e => e.StartTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Status).HasComment("0- None, 1- Paid, 2- Not Paid");
            entity.Property(e => e.TaxApplicable).HasDefaultValueSql("'0'");
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<Compaignexecutionschedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaignexecutionschedule");

            entity.Property(e => e.Budget).HasDefaultValueSql("'0'");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.FinishTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Interval).HasDefaultValueSql("'0'");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MessageCount).HasDefaultValueSql("'0'");
            entity.Property(e => e.NetworkId).HasDefaultValueSql("'0'");
            entity.Property(e => e.StartTime).HasColumnType("datetime(3)");
        });

        modelBuilder.Entity<Compaignnetwork>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaignnetwork");

            entity.Property(e => e.Code).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Desc).HasMaxLength(200);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
        });

        modelBuilder.Entity<Compaignscheduleday>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaignscheduledays");

            entity.HasIndex(e => e.CompaignScheduleId, "FK_CompaignScheduleDays_CompaignScheduleId");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");

            entity.HasOne(d => d.CompaignSchedule).WithMany(p => p.Compaignscheduledays)
                .HasForeignKey(d => d.CompaignScheduleId)
                .HasConstraintName("FK_CompaignScheduleDays_CompaignScheduleId");
        });

        modelBuilder.Entity<Compaigntemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaigntemplates");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Subject).HasMaxLength(500);
            entity.Property(e => e.Template).HasMaxLength(2000);
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<Configuration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("configurations");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Key).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
            entity.Property(e => e.Value).HasMaxLength(1000);
        });

        modelBuilder.Entity<Contentcategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("contentcategories");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("countries");

            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Currency>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("currencies");

            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
            entity.Property(e => e.Status).HasDefaultValueSql("'1'");
            entity.Property(e => e.Symbol).HasMaxLength(100);
        });

        modelBuilder.Entity<Efmigrationshistory>(entity =>
        {
            entity.HasKey(e => e.MigrationId).HasName("PRIMARY");

            entity.ToTable("__efmigrationshistory");

            entity.Property(e => e.MigrationId).HasMaxLength(150);
            entity.Property(e => e.ProductVersion).HasMaxLength(32);
        });

        modelBuilder.Entity<Globalnetworkdetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("globalnetworkdetails");

            entity.Property(e => e.ApikeySecret)
                .HasMaxLength(200)
                .HasDefaultValueSql("'0'")
                .HasColumnName("APIKeySecret");
            entity.Property(e => e.ApprovalTime).HasColumnType("datetime(3)");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Custom1)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.Custom2)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.Desc)
                .HasMaxLength(200)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.FinishTime).HasColumnType("datetime(3)");
            entity.Property(e => e.FreeQouta).HasDefaultValueSql("'0'");
            entity.Property(e => e.IsCurrent)
                .HasDefaultValueSql("'0'")
                .HasColumnName("isCurrent");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Pincode)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.PuechasedQouta).HasDefaultValueSql("'0'");
            entity.Property(e => e.Pwd)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.StartTime).HasColumnType("datetime(3)");
        });

        modelBuilder.Entity<Intervaltype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("intervaltypes");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("leads");

            entity.HasIndex(e => e.CompaignId, "FK_Leads_CompaignId");

            entity.HasIndex(e => e.CountryId, "FK_Leads_CountryId");

            entity.Property(e => e.ApproveTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Area).HasMaxLength(200);
            entity.Property(e => e.Code)
                .HasMaxLength(200)
                .HasColumnName("code");
            entity.Property(e => e.Contact).HasMaxLength(1);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.DetailJson)
                .HasMaxLength(4000)
                .HasColumnName("DetailJSON");
            entity.Property(e => e.Gps)
                .HasMaxLength(200)
                .HasColumnName("gps");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Note).HasMaxLength(800);
            entity.Property(e => e.Tags).HasMaxLength(1000);
            entity.Property(e => e.Url)
                .HasMaxLength(1000)
                .HasColumnName("url");

            entity.HasOne(d => d.Compaign).WithMany(p => p.Leads)
                .HasForeignKey(d => d.CompaignId)
                .HasConstraintName("FK_Leads_CompaignId");

            entity.HasOne(d => d.Country).WithMany(p => p.Leads)
                .HasForeignKey(d => d.CountryId)
                .HasConstraintName("FK_Leads_CountryId");
        });

        modelBuilder.Entity<Mediacontent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mediacontent");

            entity.Property(e => e.ContentCode).HasMaxLength(30);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.EpisodeNo).HasMaxLength(14);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MetaData).HasMaxLength(250);
            entity.Property(e => e.MimeType).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.PosterImage).HasMaxLength(500);
            entity.Property(e => e.Remarks).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<Mediapicture>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mediapictures");

            entity.Property(e => e.AvailabilityUrl)
                .HasMaxLength(1000)
                .HasColumnName("AvailabilityURL");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FilePath).HasMaxLength(1000);
            entity.Property(e => e.FileUniqueId).HasMaxLength(300);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MetaData).HasMaxLength(200);
            entity.Property(e => e.MimeType).HasMaxLength(300);
            entity.Property(e => e.Remarks).HasMaxLength(1000);
            entity.Property(e => e.ShortDesc).HasMaxLength(300);
            entity.Property(e => e.SizeInKbs).HasColumnName("SizeInKBS");
        });

        modelBuilder.Entity<Mediasourceinfo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mediasourceinfo");

            entity.Property(e => e.AvailabilityTime).HasColumnType("datetime(3)");
            entity.Property(e => e.AvailabilityUrl)
                .HasMaxLength(1000)
                .HasColumnName("AvailabilityURL");
            entity.Property(e => e.ContentDesc).HasMaxLength(300);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.EpisodeNo).HasMaxLength(14);
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FileUniqueId).HasMaxLength(300);
            entity.Property(e => e.Ftppath)
                .HasMaxLength(1000)
                .HasColumnName("FTPPath");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MetaData).HasMaxLength(200);
            entity.Property(e => e.MimeType).HasMaxLength(300);
            entity.Property(e => e.Remarks).HasMaxLength(1000);
            entity.Property(e => e.ShortDesc).HasMaxLength(300);
            entity.Property(e => e.SizeInKbs).HasColumnName("SizeInKBS");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("menus");

            entity.Property(e => e.ActionName).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MenueIcon).HasMaxLength(500);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
        });

        modelBuilder.Entity<Myuser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("myusers");

            entity.Property(e => e.Id).HasColumnName("id");
        });

        modelBuilder.Entity<Network>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("networks");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Noimage>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("noimage");

            entity.Property(e => e.ProfileImage).HasMaxLength(500);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("notification");

            entity.Property(e => e.Body).HasMaxLength(3000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Recipient).HasMaxLength(2000);
            entity.Property(e => e.SendFrom).HasMaxLength(300);
            entity.Property(e => e.Subject).HasMaxLength(200);
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<Notificationlog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("notificationlog");

            entity.Property(e => e.ArchiveTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Body).HasMaxLength(3000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Recipient).HasMaxLength(2000);
            entity.Property(e => e.SendFrom).HasMaxLength(300);
            entity.Property(e => e.Subject).HasMaxLength(200);
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<Notificationtype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("notificationtypes");

            entity.Property(e => e.Color).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Template).HasMaxLength(2500);
        });

        modelBuilder.Entity<Onlineuser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("onlineusers");

            entity.Property(e => e.LoginTime).HasColumnType("datetime(3)");
            entity.Property(e => e.LogoutTime).HasColumnType("datetime(3)");
            entity.Property(e => e.MachineIp)
                .HasMaxLength(20)
                .HasColumnName("MachineIP");
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("organizations");

            entity.Property(e => e.Address).HasMaxLength(1000);
            entity.Property(e => e.Contact).HasMaxLength(30);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Email).HasMaxLength(30);
            entity.Property(e => e.ExpiryTime)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.Fb)
                .HasMaxLength(50)
                .HasColumnName("FB");
            entity.Property(e => e.IbanorWireTransferId)
                .HasMaxLength(50)
                .HasColumnName("IBANOrWireTransferId");
            entity.Property(e => e.Instagram).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LogoAvatar)
                .HasMaxLength(500)
                .HasColumnName("logoAvatar");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Strength).HasColumnName("strength");
            entity.Property(e => e.WhatsApp).HasMaxLength(50);
        });

        modelBuilder.Entity<Orgpackagedetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orgpackagedetail");

            entity.Property(e => e.Apikey)
                .HasMaxLength(200)
                .HasColumnName("APIKey");
            entity.Property(e => e.ApikeySecret)
                .HasMaxLength(200)
                .HasDefaultValueSql("'0'")
                .HasColumnName("APIKeySecret");
            entity.Property(e => e.Apiuri)
                .HasMaxLength(200)
                .HasColumnName("APIURI");
            entity.Property(e => e.AutoReplyAllowed).HasDefaultValueSql("'0'");
            entity.Property(e => e.AutoReplyContent)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.BusinessId).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Custom1)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.Custom2)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FinishTime).HasColumnType("datetime(3)");
            entity.Property(e => e.HashTags).HasMaxLength(2000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Password)
                .HasMaxLength(200)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.ReplyMediaContentId).HasDefaultValueSql("'0'");
            entity.Property(e => e.Sender)
                .HasMaxLength(2000)
                .HasDefaultValueSql("'0'");
            entity.Property(e => e.StartTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Url)
                .HasMaxLength(100)
                .HasColumnName("URL");
            entity.Property(e => e.UsedQuota).HasComment("1- Message, 2- Post, 3- Reel, 4- Repost, 5- videa, 6- Post With Image");
            entity.Property(e => e.VirtualAccount).HasDefaultValueSql("'0'");
            entity.Property(e => e.WebUrl)
                .HasMaxLength(100)
                .HasColumnName("WebURL");
        });

        modelBuilder.Entity<Package>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("packages");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payment");

            entity.Property(e => e.BillingAddress).HasMaxLength(500);
            entity.Property(e => e.Birthdate).HasColumnType("datetime(3)");
            entity.Property(e => e.CardExiry).HasMaxLength(7);
            entity.Property(e => e.CardHolderTitle).HasMaxLength(50);
            entity.Property(e => e.CardNumber).HasMaxLength(16);
            entity.Property(e => e.CustomerEmail).HasMaxLength(50);
            entity.Property(e => e.CustomerId).HasMaxLength(20);
            entity.Property(e => e.CustomerProfileId).HasMaxLength(50);
            entity.Property(e => e.Cvc)
                .HasMaxLength(3)
                .HasColumnName("CVC");
            entity.Property(e => e.DishonorTime).HasColumnType("datetime(3)");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.InvoiceCode).HasMaxLength(20);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.ShippingAddress).HasMaxLength(500);
            entity.Property(e => e.TransactionCode).HasMaxLength(20);
            entity.Property(e => e.TransactionId).HasMaxLength(20);
            entity.Property(e => e.TransactionResponse).HasMaxLength(4000);
            entity.Property(e => e.TransactionTime).HasColumnType("datetime(3)");
            entity.Property(e => e.ValueTime).HasColumnType("datetime(3)");
            entity.Property(e => e.ZipCode).HasMaxLength(6);
        });

        modelBuilder.Entity<Paymenthistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("paymenthistory");

            entity.Property(e => e.ArchiveTime).HasColumnType("datetime(3)");
            entity.Property(e => e.BillingAddress).HasMaxLength(500);
            entity.Property(e => e.Birthdate).HasColumnType("datetime(3)");
            entity.Property(e => e.CardExiry).HasMaxLength(7);
            entity.Property(e => e.CardHolderTitle).HasMaxLength(50);
            entity.Property(e => e.CardNumber).HasMaxLength(16);
            entity.Property(e => e.CustomerEmail).HasMaxLength(50);
            entity.Property(e => e.CustomerId).HasMaxLength(20);
            entity.Property(e => e.CustomerProfileId).HasMaxLength(50);
            entity.Property(e => e.Cvc)
                .HasMaxLength(3)
                .HasColumnName("CVC");
            entity.Property(e => e.DishonorTime).HasColumnType("datetime(3)");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.InvoiceCode).HasMaxLength(20);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.ShippingAddress).HasMaxLength(500);
            entity.Property(e => e.TransactionCode).HasMaxLength(20);
            entity.Property(e => e.TransactionId).HasMaxLength(20);
            entity.Property(e => e.TransactionResponse).HasMaxLength(4000);
            entity.Property(e => e.TransactionTime).HasColumnType("datetime(3)");
            entity.Property(e => e.ValueTime).HasColumnType("datetime(3)");
            entity.Property(e => e.ZipCode).HasMaxLength(6);
        });

        modelBuilder.Entity<Paymentmethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("paymentmethods");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Posttype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("posttypes");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Rolemenu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("rolemenu");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MenuId).HasColumnName("MenuID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("states");

            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Status>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("statuses");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Tradeunit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tradeunits");

            entity.HasIndex(e => e.Name, "unq_t_TradeUnits_Name").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.ShortCode).HasMaxLength(50);
            entity.Property(e => e.Status).HasDefaultValueSql("'1'");
            entity.Property(e => e.UpdateAt).HasColumnType("datetime(3)");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.Contact).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dob)
                .HasColumnType("datetime(3)")
                .HasColumnName("DOB");
            entity.Property(e => e.Email).HasMaxLength(30);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Fmctoken)
                .HasMaxLength(500)
                .HasColumnName("FMCToken");
            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.Gpslocation)
                .HasMaxLength(50)
                .HasColumnName("GPSLocation");
            entity.Property(e => e.Ims)
                .HasMaxLength(50)
                .HasColumnName("IMs");
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Nick).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.RegistrationTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Remarks).HasMaxLength(500);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.SecurityToken).HasMaxLength(2000);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UserCode).HasMaxLength(20);
            entity.Property(e => e.UserName).HasMaxLength(50);
        });

        modelBuilder.Entity<Userrole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("userroles");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(300);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Usersaccesshistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("usersaccesshistory");

            entity.Property(e => e.LoginTime).HasColumnType("datetime(3)");
            entity.Property(e => e.LogoutTime).HasColumnType("datetime(3)");
            entity.Property(e => e.MachineIp)
                .HasMaxLength(20)
                .HasColumnName("MachineIP");
            entity.Property(e => e.RecordedTime).HasColumnType("datetime(3)");
            entity.Property(e => e.StationCode).HasMaxLength(3);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
