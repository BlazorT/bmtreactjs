using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BMT_Web.bmtfolder;

public partial class BmtContext : DbContext
{
    public BmtContext()
    {
    }

    public BmtContext(DbContextOptions<BmtContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Alertlevel> Alertlevels { get; set; }

    public virtual DbSet<Applog> Applogs { get; set; }

    public virtual DbSet<Apptrace> Apptraces { get; set; }

    public virtual DbSet<Auditentity> Auditentities { get; set; }

    public virtual DbSet<Auditlog> Auditlogs { get; set; }

    public virtual DbSet<Basicconfiguration> Basicconfigurations { get; set; }

    public virtual DbSet<Bundlingpackagedetail> Bundlingpackagedetails { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

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

    public virtual DbSet<Roleright> Rolerights { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<Status> Statuses { get; set; }

    public virtual DbSet<Tradeunit> Tradeunits { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Userrole> Userroles { get; set; }

    public virtual DbSet<Usersaccesshistory> Usersaccesshistories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=User@Blazor;database=bmt");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("address");

            entity.Property(e => e.Address1).HasMaxLength(500);
            entity.Property(e => e.Address2).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.CustomAttributes).HasColumnType("text");
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
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Applog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("applog");

            entity.HasIndex(e => e.OrgId, "FK_AppLog_DSPId");

            entity.Property(e => e.LogDesc).HasMaxLength(500);
            entity.Property(e => e.LogTime).HasColumnType("datetime(3)");
            entity.Property(e => e.MachineIp)
                .HasMaxLength(20)
                .HasColumnName("MachineIP");
            entity.Property(e => e.Synccode)
                .HasMaxLength(45)
                .HasColumnName("synccode");
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
            entity.Property(e => e.TraceTime).HasColumnType("datetime");
            entity.Property(e => e.UniqueId).HasMaxLength(20);
        });

        modelBuilder.Entity<Auditentity>(entity =>
        {
            entity.HasKey(e => e.AuditEntityId).HasName("PRIMARY");

            entity.ToTable("auditentities");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
        });

        modelBuilder.Entity<Auditlog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("auditlog");

            entity.Property(e => e.AttributeName).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.KeyValue).HasMaxLength(100);
            entity.Property(e => e.NewValue).HasMaxLength(500);
            entity.Property(e => e.OldValue).HasMaxLength(500);
        });

        modelBuilder.Entity<Basicconfiguration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("basicconfigurations");

            entity.HasIndex(e => e.ProxyUserPwd, "proxy_user_pwd_UNIQUE").IsUnique();

            entity.Property(e => e.ApiAuthKey).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.DefaultOrgName).HasMaxLength(200);
            entity.Property(e => e.DspAdminEmail)
                .HasMaxLength(200)
                .HasColumnName("dsp_admin_email");
            entity.Property(e => e.EmailNotificationEnabled)
                .HasDefaultValueSql("'1'")
                .HasColumnName("email_notification_enabled");
            entity.Property(e => e.FcmSenderId)
                .HasMaxLength(200)
                .HasColumnName("fcmSenderId");
            entity.Property(e => e.FcmServerKey)
                .HasMaxLength(200)
                .HasColumnName("fcmServerKey");
            entity.Property(e => e.GetSmsnotificationsQuery)
                .HasMaxLength(500)
                .HasColumnName("GetSMSNotificationsQuery");
            entity.Property(e => e.InsertSmshistoryQuery)
                .HasMaxLength(500)
                .HasColumnName("InsertSMSHistoryQuery");
            entity.Property(e => e.IsProxyEnabled)
                .HasDefaultValueSql("'1'")
                .HasColumnName("isProxyEnabled");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.ProxyServer)
                .HasMaxLength(200)
                .HasColumnName("proxy_server");
            entity.Property(e => e.ProxyUserName)
                .HasMaxLength(200)
                .HasColumnName("proxy_user_name");
            entity.Property(e => e.ProxyUserPwd)
                .HasMaxLength(200)
                .HasColumnName("proxy_user_pwd");
            entity.Property(e => e.SmsNotificationEnabled)
                .HasDefaultValueSql("'1'")
                .HasColumnName("sms_notification_enabled");
            entity.Property(e => e.SmsPassword)
                .HasMaxLength(200)
                .HasColumnName("sms_password");
            entity.Property(e => e.SmsQouta).HasColumnName("sms_qouta");
            entity.Property(e => e.SmsServiceUrl)
                .HasMaxLength(200)
                .HasColumnName("sms_service_url");
            entity.Property(e => e.SmsServiceUser)
                .HasMaxLength(200)
                .HasColumnName("sms_service_user");
            entity.Property(e => e.SmtpSenderEmail).HasMaxLength(45);
            entity.Property(e => e.SmtpServer).HasMaxLength(100);
            entity.Property(e => e.SmtpUser).HasMaxLength(200);
            entity.Property(e => e.SmtpUserPwd).HasMaxLength(200);
            entity.Property(e => e.Smtpport).HasColumnName("SMTPPort");
            entity.Property(e => e.Sslenabled)
                .HasDefaultValueSql("'1'")
                .HasColumnName("SSLEnabled");
            entity.Property(e => e.UpdateSmsnotificationsQuery)
                .HasMaxLength(500)
                .HasColumnName("UpdateSMSNotificationsQuery");
        });

        modelBuilder.Entity<Bundlingpackagedetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("bundlingpackagedetails");

            entity.Property(e => e.ApprovalTime).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.FinishTime).HasColumnType("datetime");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.StartTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("categories");

            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cities");

            entity.Property(e => e.Code).HasMaxLength(3);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Compaign>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaigns");

            entity.Property(e => e.ApprovalTime).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.FinishTime).HasColumnType("datetime");
            entity.Property(e => e.HashTags).HasMaxLength(2000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Remarks).HasMaxLength(2000);
            entity.Property(e => e.StartTime).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(1000);
        });

        modelBuilder.Entity<Compaignexecutionschedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaignexecutionschedule");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.FinishTime).HasColumnType("datetime");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.StartTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Compaignnetwork>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaignnetwork");

            entity.Property(e => e.Code).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Desc).HasMaxLength(200);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Compaignscheduleday>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaignscheduledays");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
        });

        modelBuilder.Entity<Compaigntemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("compaigntemplates");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Subject).HasMaxLength(500);
            entity.Property(e => e.Template).HasMaxLength(2000);
            entity.Property(e => e.Title).HasMaxLength(500);
        });

        modelBuilder.Entity<Configuration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("configurations");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Key).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Rowver).HasColumnName("ROWVer");
            entity.Property(e => e.Value).HasMaxLength(500);
        });

        modelBuilder.Entity<Contentcategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("contentcategories");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
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
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
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
                .HasColumnName("APIKeySecret");
            entity.Property(e => e.ApprovalTime).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Custom1).HasMaxLength(2000);
            entity.Property(e => e.Custom2).HasMaxLength(2000);
            entity.Property(e => e.Desc).HasMaxLength(200);
            entity.Property(e => e.FinishTime).HasColumnType("datetime");
            entity.Property(e => e.IsCurrent).HasColumnName("isCurrent");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Pincode).HasMaxLength(2000);
            entity.Property(e => e.Pwd).HasMaxLength(2000);
            entity.Property(e => e.StartTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Intervaltype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("intervaltypes");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("leads");

            entity.Property(e => e.ApproveTime).HasColumnType("datetime");
            entity.Property(e => e.Area).HasMaxLength(200);
            entity.Property(e => e.Code)
                .HasMaxLength(200)
                .HasColumnName("code");
            entity.Property(e => e.Contact).HasMaxLength(1);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.DetailJson)
                .HasMaxLength(4000)
                .HasColumnName("DetailJSON");
            entity.Property(e => e.Gps)
                .HasMaxLength(200)
                .HasColumnName("gps");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Note).HasMaxLength(800);
            entity.Property(e => e.Tags).HasMaxLength(1000);
            entity.Property(e => e.Url)
                .HasMaxLength(1000)
                .HasColumnName("url");
        });

        modelBuilder.Entity<Mediacontent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mediacontent");

            entity.Property(e => e.ContentCode).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.EpisodeNo).HasMaxLength(45);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Mediacontentcol)
                .HasMaxLength(45)
                .HasColumnName("mediacontentcol");
            entity.Property(e => e.MetaData).HasMaxLength(45);
            entity.Property(e => e.Name).HasMaxLength(500);
            entity.Property(e => e.PosterImage).HasMaxLength(100);
            entity.Property(e => e.Remarks).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<Mediapicture>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mediapictures");

            entity.Property(e => e.AvailabilityUrl)
                .HasMaxLength(1000)
                .HasColumnName("AvailabilityURL");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FilePath).HasMaxLength(1000);
            entity.Property(e => e.FileUniqueId).HasMaxLength(300);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
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

            entity.Property(e => e.AvailabilityTime).HasColumnType("datetime");
            entity.Property(e => e.AvailabilityUrl)
                .HasMaxLength(1000)
                .HasColumnName("AvailabilityURL");
            entity.Property(e => e.ContentDesc).HasMaxLength(300);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.EpisodeNo).HasMaxLength(14);
            entity.Property(e => e.FileName).HasMaxLength(150);
            entity.Property(e => e.FileUniqueId).HasMaxLength(300);
            entity.Property(e => e.Ftppath)
                .HasMaxLength(1000)
                .HasColumnName("FTPPath");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
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
            entity.Property(e => e.Badge)
                .HasMaxLength(200)
                .HasColumnName("badge");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MenueIcon).HasMaxLength(500);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.Tag).HasMaxLength(500);
            entity.Property(e => e.Title)
                .HasMaxLength(500)
                .HasColumnName("title");
        });

        modelBuilder.Entity<Network>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("networks");

            entity.HasIndex(e => e.CategoryId, "idx_category");

            entity.HasIndex(e => e.CreatedBy, "idx_createdby");

            entity.HasIndex(e => e.LastUpdatedBy, "idx_lastupdatedby");

            entity.HasIndex(e => e.Status, "idx_status");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Noimage>(entity =>
        {
            entity.HasKey(e => e.ProfileImage).HasName("PRIMARY");

            entity.ToTable("noimage");

            entity.Property(e => e.ProfileImage).HasMaxLength(500);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("notification");

            entity.Property(e => e.Body).HasMaxLength(3000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
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

            entity.HasIndex(e => e.NotificationId, "UC_NotificationId").IsUnique();

            entity.HasIndex(e => e.NetworkId, "idx_NetworkId");

            entity.HasIndex(e => e.NotificationId, "idx_NotificationId");

            entity.Property(e => e.ArchiveTime).HasColumnType("datetime");
            entity.Property(e => e.Body).HasMaxLength(3000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Recipient).HasMaxLength(2000);
            entity.Property(e => e.SendFrom).HasMaxLength(300);
            entity.Property(e => e.Subject).HasMaxLength(200);
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Notification).WithOne(p => p.Notificationlog)
                .HasForeignKey<Notificationlog>(d => d.NotificationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NotificationId");
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

            entity.HasIndex(e => new { e.Contact, e.Name }, "Stores_Contact").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(300);
            entity.Property(e => e.CityId).HasDefaultValueSql("'0'");
            entity.Property(e => e.Contact).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Email).HasMaxLength(30);
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Fb)
                .HasMaxLength(100)
                .HasColumnName("FB");
            entity.Property(e => e.Fmctoken)
                .HasMaxLength(1000)
                .HasColumnName("FMCToken");
            entity.Property(e => e.IbanorWireTransferId)
                .HasMaxLength(500)
                .HasColumnName("IBANOrWireTransferId");
            entity.Property(e => e.Instagram).HasMaxLength(100);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LogoAvatar)
                .HasMaxLength(100)
                .HasColumnName("logoAvatar");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Status).HasDefaultValueSql("'1'");
            entity.Property(e => e.Strength)
                .HasDefaultValueSql("'0'")
                .HasColumnName("strength");
            entity.Property(e => e.WebAddress).HasMaxLength(100);
            entity.Property(e => e.WhatsApp).HasMaxLength(50);
        });

        modelBuilder.Entity<Orgpackagedetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orgpackagedetail");

            entity.HasIndex(e => e.NetworkId, "fk_NetworkId");

            entity.HasIndex(e => e.OrgId, "idx_OrgId");

            entity.Property(e => e.Apikey)
                .HasMaxLength(200)
                .HasColumnName("APIKey");
            entity.Property(e => e.ApikeySecret)
                .HasMaxLength(200)
                .HasColumnName("APIKeySecret");
            entity.Property(e => e.Apiuri)
                .HasMaxLength(200)
                .HasColumnName("APIURI");
            entity.Property(e => e.AutoReplyContent).HasMaxLength(2000);
            entity.Property(e => e.BusinessId).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Custom1).HasMaxLength(2000);
            entity.Property(e => e.Custom2).HasMaxLength(2000);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FinishTime).HasColumnType("datetime");
            entity.Property(e => e.HashTags).HasMaxLength(2000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Password).HasMaxLength(200);
            entity.Property(e => e.Sender).HasMaxLength(2000);
            entity.Property(e => e.StartTime).HasColumnType("datetime");
            entity.Property(e => e.Url)
                .HasMaxLength(100)
                .HasColumnName("URL");
            entity.Property(e => e.WebUrl)
                .HasMaxLength(100)
                .HasColumnName("WebURL");

            entity.HasOne(d => d.Network).WithMany(p => p.Orgpackagedetails)
                .HasForeignKey(d => d.NetworkId)
                .HasConstraintName("fk_NetworkId");
        });

        modelBuilder.Entity<Package>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("packages");

            entity.HasIndex(e => e.Name, "UQ_Name").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payment");

            entity.HasIndex(e => e.CustomerId, "IX_CustomerId");

            entity.HasIndex(e => e.TransactionCode, "UK_TransactionCode").IsUnique();

            entity.Property(e => e.BillingAddress).HasMaxLength(500);
            entity.Property(e => e.Birthdate).HasColumnType("datetime");
            entity.Property(e => e.CardExiry).HasMaxLength(7);
            entity.Property(e => e.CardHolderTitle).HasMaxLength(50);
            entity.Property(e => e.CardNumber).HasMaxLength(16);
            entity.Property(e => e.CustomerEmail).HasMaxLength(50);
            entity.Property(e => e.CustomerId).HasMaxLength(20);
            entity.Property(e => e.CustomerProfileId).HasMaxLength(50);
            entity.Property(e => e.Cvc)
                .HasMaxLength(3)
                .HasColumnName("CVC");
            entity.Property(e => e.DishonorTime).HasColumnType("datetime");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.InvoiceCode).HasMaxLength(20);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.ShippingAddress).HasMaxLength(500);
            entity.Property(e => e.TransactionCode).HasMaxLength(20);
            entity.Property(e => e.TransactionId).HasMaxLength(20);
            entity.Property(e => e.TransactionResponse).HasMaxLength(4000);
            entity.Property(e => e.TransactionTime).HasColumnType("datetime");
            entity.Property(e => e.ValueTime).HasColumnType("datetime");
            entity.Property(e => e.ZipCode).HasMaxLength(6);
        });

        modelBuilder.Entity<Paymenthistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("paymenthistory");

            entity.HasIndex(e => e.PaymentId, "FK_PaymentHistory_PaymentId");

            entity.HasIndex(e => e.CustomerEmail, "IX_PaymentHistory_CustomerEmail");

            entity.Property(e => e.ArchiveTime).HasColumnType("datetime");
            entity.Property(e => e.BillingAddress).HasMaxLength(500);
            entity.Property(e => e.Birthdate).HasColumnType("datetime");
            entity.Property(e => e.CardExiry).HasMaxLength(7);
            entity.Property(e => e.CardHolderTitle).HasMaxLength(50);
            entity.Property(e => e.CardNumber).HasMaxLength(16);
            entity.Property(e => e.CustomerEmail).HasMaxLength(50);
            entity.Property(e => e.CustomerId).HasMaxLength(20);
            entity.Property(e => e.CustomerProfileId).HasMaxLength(50);
            entity.Property(e => e.Cvc)
                .HasMaxLength(3)
                .HasColumnName("CVC");
            entity.Property(e => e.DishonorTime).HasColumnType("datetime");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.InvoiceCode).HasMaxLength(20);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.ShippingAddress).HasMaxLength(500);
            entity.Property(e => e.TransactionCode).HasMaxLength(20);
            entity.Property(e => e.TransactionId).HasMaxLength(20);
            entity.Property(e => e.TransactionResponse).HasMaxLength(4000);
            entity.Property(e => e.TransactionTime).HasColumnType("datetime");
            entity.Property(e => e.ValueTime).HasColumnType("datetime");
            entity.Property(e => e.ZipCode).HasMaxLength(6);

            entity.HasOne(d => d.Payment).WithMany(p => p.Paymenthistories)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PaymentHistory_PaymentId");
        });

        modelBuilder.Entity<Paymentmethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("paymentmethods");

            entity.HasIndex(e => e.Status, "IX_Status");

            entity.HasIndex(e => e.Name, "UNQ_Name").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Posttype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("posttypes");

            entity.HasIndex(e => e.Name, "UQ_Name").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime");
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

        modelBuilder.Entity<Roleright>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("roleright");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
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

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.ShortCode).HasMaxLength(50);
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.UserName, "UQ__Users__C9F28456F9478DB3").IsUnique();

            entity.HasIndex(e => e.Email, "uc_email").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(3000);
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.CityId).HasDefaultValueSql("'0'");
            entity.Property(e => e.Contact).HasMaxLength(14);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dob)
                .HasColumnType("datetime(3)")
                .HasColumnName("DOB");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Fmctoken)
                .HasMaxLength(500)
                .HasColumnName("FMCToken");
            entity.Property(e => e.GenderId).HasMaxLength(45);
            entity.Property(e => e.Gpslocation)
                .HasMaxLength(45)
                .HasColumnName("GPSLocation");
            entity.Property(e => e.Ims)
                .HasMaxLength(45)
                .HasColumnName("IMs");
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(500);
            entity.Property(e => e.RegistrationTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Remarks).HasMaxLength(2000);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.SecurityToken).HasMaxLength(200);
            entity.Property(e => e.UserCode).HasMaxLength(20);
            entity.Property(e => e.UserName).HasMaxLength(100);
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

            entity.Property(e => e.LoginTime).HasColumnType("datetime");
            entity.Property(e => e.LogoutTime).HasColumnType("datetime");
            entity.Property(e => e.MachineIp)
                .HasMaxLength(20)
                .HasColumnName("MachineIP");
            entity.Property(e => e.RecordedTime).HasColumnType("datetime");
            entity.Property(e => e.StationCode).HasMaxLength(3);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
