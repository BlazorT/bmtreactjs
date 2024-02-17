using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Eventing.Reader;
using com.blazor.bmt.core;
using com.blazor.bmt.util;
using Google.Protobuf.WellKnownTypes;
using Microsoft.EntityFrameworkCore;

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
    public virtual DbSet<Applog> Applogs { get; set; }

    public virtual DbSet<Auditentity> Auditentities { get; set; }

    public virtual DbSet<AuditLog> Auditlogs { get; set; }

    public virtual DbSet<Basicconfiguration> Basicconfigurations { get; set; }

    public virtual DbSet<Businessentity> Businessentities { get; set; }

    public virtual DbSet<Businesstype> Businesstypes { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Configuration> Configurations { get; set; }
    public virtual DbSet<Dispatchment> Dispatchments { get; set; }
    public virtual DbSet<Dspstable> Dspstables { get; set; }
    public virtual DbSet<Country> Countries { get; set; }
    public virtual DbSet<Shift> Shifts { get; set; }
    public virtual DbSet<Datatype> Datatypes { get; set; }
    public virtual DbSet<Fleetrosterplan> Fleetrosterplans { get; set; }
    public virtual DbSet<Rosterplan> Rosterplans { get; set; }

    public virtual DbSet<Inspectionreport> Inspectionreports { get; set; }

    public virtual DbSet<Daverification> Daverifications { get; set; }

    public virtual DbSet<Dsp> Dsps { get; set; }

    public virtual DbSet<Dsppartner> Dsppartners { get; set; }

    public virtual DbSet<Dspstockstat> Dspstockstats { get; set; }

    public virtual DbSet<Inbounddata> Inbounddata { get; set; }

    public virtual DbSet<Inspectionitem> Inspectionitems { get; set; }

    public virtual DbSet<Integrationservicesetting> Integrationservicesettings { get; set; }

    public virtual DbSet<Inventorydetail> Inventorydetails { get; set; }

    public virtual DbSet<Mediacontent> Mediacontents { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Notificationtype> Notificationtypes { get; set; }

    public virtual DbSet<Onlineuser> Onlineusers { get; set; }

    public virtual DbSet<Outbounddata> Outbounddata { get; set; }

    //ublic virtual DbSet<Ownershiptype> Ownershiptypes { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Productgroup> Productgroups { get; set; }

    public virtual DbSet<Rolemenu> Rolemenus { get; set; }

    public virtual DbSet<Roleright> Rolerights { get; set; }

    public virtual DbSet<Servicetype> Servicetypes { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<Status> Statuses { get; set; }

    public virtual DbSet<Substatus> Substatuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Userrole> Userroles { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<Vehicleinspection> Vehicleinspections { get; set; }

    public virtual DbSet<Vehiclemake> Vehiclemakes { get; set; }

    public virtual DbSet<Vehicletype> Vehicletypes { get; set; }

    public virtual DbSet<Verificationmethod> Verificationmethods { get; set; }

    public virtual DbSet<Wfexecutionstatus> Wfexecutionstatuses { get; set; }

    public virtual DbSet<Wffield> Wffields { get; set; }

    public virtual DbSet<Workflowmapping> Workflowmappings { get; set; }

    public virtual DbSet<Workflowtask> Workflowtasks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
         => optionsBuilder.UseMySQL(BlazorConstant.CONNECTION_STRING);
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Applog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("applog");

            entity.HasIndex(e => e.Dspid, "FK_AppLog_DSPId");

            entity.Property(e => e.Dspid).HasColumnName("DSPId");
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

        modelBuilder.Entity<Inspectionreport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("inspectionreport");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Remarks)
                .HasMaxLength(500)
                .HasColumnName("remarks");
            entity.Property(e => e.VehicleId).HasColumnName("vehicleId");
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
        modelBuilder.Entity<Dispatchment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dispatchment");

            entity.Property(e => e.AssignedQty).HasDefaultValueSql("'1'");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Remarks).HasMaxLength(500);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'_utf8mb4\\\\''1\\\\'''");
        });
        modelBuilder.Entity<Dspstable>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dspstables");

            entity.Property(e => e.ColumnName).HasMaxLength(100);
            entity.Property(e => e.DataType).HasMaxLength(100);
            entity.Property(e => e.DefaultValue).HasMaxLength(100);
            entity.Property(e => e.Expression).HasMaxLength(500);
            entity.Property(e => e.FieldType).HasMaxLength(100);
            entity.Property(e => e.TableName).HasMaxLength(100);
        });
        modelBuilder.Entity<Fleetrosterplan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("fleetrosterplan");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.CustomField1).HasMaxLength(50);
            entity.Property(e => e.CustomField2).HasMaxLength(50);
            entity.Property(e => e.CustomField3).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RosterRemarks).HasMaxLength(1000);
            entity.Property(e => e.RosteredDaid).HasColumnName("RosteredDAId");
            entity.Property(e => e.Wincode).HasMaxLength(20);
        });
        modelBuilder.Entity<Shift>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("shifts");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.EndTime).HasColumnType("datetime(3)");
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Hours).HasDefaultValueSql("'0'");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.ShiftTypeId).HasDefaultValueSql("'0'");
            entity.Property(e => e.StartTime).HasColumnType("datetime(3)");
        });
        modelBuilder.Entity<Rosterplan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("rosterplan");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.CustomField1).HasMaxLength(50);
            entity.Property(e => e.CustomField2).HasMaxLength(50);
            entity.Property(e => e.CustomField3).HasMaxLength(50);
            entity.Property(e => e.LastSyncTime)
                .HasDefaultValueSql("'CURRENT_TIMESTAMP(3)'")
                .HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RosterDate).HasColumnType("datetime(3)");
            entity.Property(e => e.RosterEndDate).HasColumnType("date");
            entity.Property(e => e.RosterPlanDate).HasColumnType("date");
            entity.Property(e => e.RosterRemarks).HasMaxLength(1000);
            entity.Property(e => e.SyncStatus).HasDefaultValueSql("'0'");
            entity.Property(e => e.Week).HasMaxLength(50);
        });
        modelBuilder.Entity<AuditLog>(entity =>
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

            entity.Property(e => e.ApiAuthKey).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.DefaultDspid).HasColumnName("DefaultDSPId");
            entity.Property(e => e.DefaultDspname)
                .HasMaxLength(200)
                .HasColumnName("DefaultDSPName");
            entity.Property(e => e.DspAdminEmail)
                .HasMaxLength(200)
                .HasColumnName("dsp_admin_email");
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

        modelBuilder.Entity<Businessentity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("businessentities");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
        });

        modelBuilder.Entity<Businesstype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("businesstypes");

            entity.Property(e => e.Code).HasMaxLength(15);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
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

        modelBuilder.Entity<Configuration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("configurations");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.Key).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Value).HasMaxLength(500);
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

        modelBuilder.Entity<Datatype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("datatypes");

            entity.Property(e => e.Code).HasMaxLength(15);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Daverification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("daverification");

            entity.Property(e => e.BackPic).HasMaxLength(2000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.DocId)
                .HasMaxLength(2000)
                .HasColumnName("DocID");
            entity.Property(e => e.DocumentUri)
                .HasMaxLength(2000)
                .HasColumnName("DocumentURI");
            entity.Property(e => e.FrontPic)
                .HasMaxLength(2000)
                .HasColumnName("frontPic");
            entity.Property(e => e.HolderName).HasMaxLength(45);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Remarks).HasMaxLength(2000);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
            entity.Property(e => e.Signature).HasMaxLength(2000);
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VerificationVia)
                .HasDefaultValueSql("'0'")
                .HasComment("Via SSN, Driving License, Birthday Certificate");
        });

        modelBuilder.Entity<Dsp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dsps");

            entity.HasIndex(e => new { e.Contact, e.Name }, "Stores_Contact").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(300);
            entity.Property(e => e.Contact).HasMaxLength(50);
            entity.Property(e => e.Contact2).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Email).HasMaxLength(30);
            entity.Property(e => e.ExpiryDate).HasColumnType("datetime(3)");
            entity.Property(e => e.Fmctoken)
                .HasMaxLength(1000)
                .HasColumnName("FMCToken");
            entity.Property(e => e.IsMainDsp)
                .HasDefaultValueSql("'0'")
                .HasColumnName("isMainDSP");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.License).HasMaxLength(1000);
            entity.Property(e => e.LogoPath).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.PartnersCount).HasDefaultValueSql("'0'");
            entity.Property(e => e.RegTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Status).HasDefaultValueSql("'1'");
            entity.Property(e => e.SurfaceAddress).HasMaxLength(500);
            entity.Property(e => e.TradeName).HasMaxLength(300);
            entity.Property(e => e.VatregistrationNo)
                .HasMaxLength(20)
                .HasColumnName("VATRegistrationNo");
            entity.Property(e => e.WebAddress).HasMaxLength(100);
            entity.Property(e => e.WhatsApp).HasMaxLength(50);
        });

        modelBuilder.Entity<Dsppartner>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dsppartner");

            entity.Property(e => e.Address).HasMaxLength(3000);
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.BusinessName).HasMaxLength(100);
            entity.Property(e => e.BusinessTypeId).HasDefaultValueSql("'0'");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dob)
                .HasColumnType("datetime(3)")
                .HasColumnName("DOB");
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IdentityId)
                .HasMaxLength(500)
                .HasColumnName("IdentityID");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.PrimaryContact).HasMaxLength(14);
            entity.Property(e => e.RowVer).HasComment("Sole Proprieter, Partnership, etc");
            entity.Property(e => e.SecondaryContact).HasMaxLength(14);
            entity.Property(e => e.StateId).HasComment("States if of the country");
        });

        modelBuilder.Entity<Dspstockstat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dspstockstats");

            entity.HasIndex(e => new { e.Dspid, e.ProductDetailId }, "ConstraintDSPStockStats").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.ProductDetailId).HasColumnName("ProductDetailID");
            entity.Property(e => e.RowVer).HasDefaultValueSql("'_utf8mb4\\\\''1\\\\'''");
        });

        modelBuilder.Entity<Inbounddata>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("inbounddata");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Datatypeid)
                .HasDefaultValueSql("'0'")
                .HasColumnName("datatypeid");
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Fieldid).HasColumnName("fieldid");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Synctime)
                .HasColumnType("datetime(3)")
                .HasColumnName("synctime");
            entity.Property(e => e.Value)
                .HasMaxLength(2000)
                .HasColumnName("value");
        });

        modelBuilder.Entity<Inspectionitem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("inspectionitems");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.SubPart).HasMaxLength(100);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Value).HasMaxLength(500);
        });    

        modelBuilder.Entity<Integrationservicesetting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("integrationservicesetting");

            entity.Property(e => e.Contact).HasMaxLength(14);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.RowVer).HasComment("Sole Proprieter, Partnership, etc");
            entity.Property(e => e.ServiceTypeId).HasDefaultValueSql("'0'");
            entity.Property(e => e.ServiceUri).HasMaxLength(100);
            entity.Property(e => e.Token).HasMaxLength(100);
            entity.Property(e => e.UserName).HasMaxLength(500);
        });

        modelBuilder.Entity<Inventorydetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("inventorydetail");

            entity.Property(e => e.BarCode).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.ExpiryDate).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RowVer).HasDefaultValueSql("'_utf8mb4\\\\''1\\\\'''");
        });

        modelBuilder.Entity<Mediacontent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("mediacontent");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Daid).HasColumnName("DAId");
            entity.Property(e => e.FileName).HasMaxLength(100);
            entity.Property(e => e.IsDownloadAllowed).HasColumnName("isDownloadAllowed");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.MimeType).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(500);
            entity.Property(e => e.Remarks).HasMaxLength(1000);
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

        modelBuilder.Entity<Outbounddata>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("outbounddata");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Datatypeid).HasColumnName("datatypeid");
            entity.Property(e => e.Desc)
                .HasMaxLength(200)
                .HasColumnName("desc");
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime(3)");
            entity.Property(e => e.Fieldid).HasColumnName("fieldid");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Synctime)
                .HasColumnType("datetime(3)")
                .HasColumnName("synctime");
            entity.Property(e => e.Value)
                .HasMaxLength(2000)
                .HasColumnName("value");
        });

        //modelBuilder.Entity<Ownershiptype>(entity =>
        //{
        //    entity.HasKey(e => e.Id).HasName("PRIMARY");

        //    entity.ToTable("ownershiptypes");

        //    entity.Property(e => e.Code).HasMaxLength(15);
        //    entity.Property(e => e.Desc).HasMaxLength(1000);
        //    entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
        //    entity.Property(e => e.Name).HasMaxLength(150);
        //});

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("products");

            entity.HasIndex(e => new { e.GroupId, e.Name }, "unq_t_Products_name").IsUnique();

            entity.Property(e => e.BarCode)
                .HasMaxLength(20)
                .HasColumnName("barCode");
            entity.Property(e => e.BusinessEntityId).HasDefaultValueSql("'0'");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.ManufactureCountryId).HasDefaultValueSql("'_utf8mb4\\\\''0\\\\'''");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Picture).HasMaxLength(200);
            entity.Property(e => e.ShortCode).HasMaxLength(10);
        });

        modelBuilder.Entity<Productgroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("productgroups");

            entity.HasIndex(e => e.Name, "unq_t_productgroups_name").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime(3)");
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
           // entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.RowVer).HasDefaultValueSql("'1'");
        });

        modelBuilder.Entity<Servicetype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("servicetypes");

            entity.Property(e => e.Code).HasMaxLength(15);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
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

        modelBuilder.Entity<Substatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("substatuses");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Token, "Token_UNIQUE").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__Users__C9F28456F9478DB3").IsUnique();

            entity.HasIndex(e => e.Email, "uc_email").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(3000);
            entity.Property(e => e.Avatar).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Dob)
                .HasColumnType("datetime(3)")
                .HasColumnName("DOB");
            entity.Property(e => e.Dspid).HasColumnName("DSPID");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Fmctoken)
                .HasMaxLength(500)
                .HasColumnName("FMCToken");
            entity.Property(e => e.HasValidDrivingLicense).HasDefaultValueSql("'0'");
            entity.Property(e => e.IdentityId)
                .HasMaxLength(500)
                .HasColumnName("IdentityID");
            entity.Property(e => e.Im)
                .HasMaxLength(200)
                .HasColumnName("IM");
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.LicenseExpiryDate).HasColumnType("datetime(3)");
            entity.Property(e => e.LicenseIssueDate).HasColumnType("datetime(3)");
            entity.Property(e => e.LicenseNo).HasMaxLength(45);
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(500);
            entity.Property(e => e.PrimaryContact).HasMaxLength(14);
            entity.Property(e => e.Remarks).HasMaxLength(2000);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.SecondaryContact).HasMaxLength(14);
            entity.Property(e => e.Ssn)
                .HasMaxLength(45)
                .HasColumnName("SSN");
            entity.Property(e => e.Token).HasMaxLength(8);
            entity.Property(e => e.UserId)
                .HasMaxLength(20)
                .HasColumnName("UserID");
            entity.Property(e => e.UserName).HasMaxLength(100);
            entity.Property(e => e.VerificationMethod).HasDefaultValueSql("'0'");
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

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vehicles");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.AssignedDaid).HasColumnName("AssignedDAId");
            entity.Property(e => e.Code).HasMaxLength(8);
            entity.Property(e => e.Color).HasMaxLength(20);
            entity.Property(e => e.Contact).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.CustomField1).HasMaxLength(50);
            entity.Property(e => e.CustomField2).HasMaxLength(50);
            entity.Property(e => e.CustomField3).HasMaxLength(50);
            entity.Property(e => e.Desc).HasMaxLength(2000);
            entity.Property(e => e.Dspid).HasColumnName("DSPId");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.ExpiryDate).HasColumnType("datetime(3)");
            entity.Property(e => e.FleetCode).HasMaxLength(20);
            entity.Property(e => e.FleetJoiningDate).HasColumnType("datetime(3)");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.NumberPlate).HasMaxLength(20);
            entity.Property(e => e.Odo).HasColumnName("ODO");
            entity.Property(e => e.Remarks).HasMaxLength(1000);
            entity.Property(e => e.WhatsApp).HasMaxLength(20);
        });

        modelBuilder.Entity<Vehicleinspection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vehicleinspection");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Found).HasColumnName("found");
            entity.Property(e => e.InspectionItemId).HasColumnName("inspectionItemId");
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Remarks)
                .HasMaxLength(500)
                .HasColumnName("remarks");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Vehicleid).HasColumnName("vehicleid");
        });

        modelBuilder.Entity<Vehiclemake>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vehiclemakes");

            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Vehicletype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vehicletypes");

            entity.Property(e => e.Code).HasMaxLength(15);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Verificationmethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("verificationmethods");

            entity.Property(e => e.Code).HasMaxLength(15);
            entity.Property(e => e.Desc).HasMaxLength(1000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Wfexecutionstatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("wfexecutionstatus");

            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.RowVer)
                .HasMaxLength(8)
                .IsFixedLength();
            entity.Property(e => e.Time).HasColumnType("datetime(3)");
            entity.Property(e => e.WftaskId).HasColumnName("WFTaskId");
        });

        modelBuilder.Entity<Wffield>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("wffields");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.DefaultValue).HasMaxLength(500);
            entity.Property(e => e.Expression).HasMaxLength(500);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Workflowmapping>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("workflowmappings");

            entity.Property(e => e.AncestorTaskId).HasDefaultValueSql("'0'");
            entity.Property(e => e.CompletionExp).HasMaxLength(4000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.InitExp).HasMaxLength(4000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.PrecessorTaskId).HasDefaultValueSql("'0'");
            entity.Property(e => e.WftaskId).HasColumnName("WFTaskId");
        });

        modelBuilder.Entity<Workflowtask>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("workflowtasks");

            entity.Property(e => e.CompletionExpression).HasMaxLength(4000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.InitExpression).HasMaxLength(4000);
            entity.Property(e => e.LastUpdatedAt).HasColumnType("datetime(3)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.RowVer)
                .HasMaxLength(8)
                .IsFixedLength();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

