using System.ComponentModel;
using static System.Net.Mime.MediaTypeNames;
using System.Text;
namespace com.blazor.bmt.util
{
    public enum CacheEnums
    {
        UserBasicInfo = 1,
        UserMenu = 2,
    }
    public enum MESSAGE_RESPONSE_TYPES
    {
        OK = 1,
        CONFIRM = 2,
        CANCEL = 3,
    }
    public enum REGISTRATION_SOURCE
    {
        WEB = 1,
        MOBILE = 2,
        THIRD_Party = 3
    }
    public enum COMMON_STATUS
    {
        [Description("Active")]
        ACTIVE = 1,
        [Description("In-active")]
        IN_ACTIVE = 2,
        [Description("Invited")]
        INVITED = 3

    }
    public enum STATUS_ADMIN_USERS
    {
        [Description("Active")]
        ACTIVE = 1,
        [Description("In-active")]
        IN_ACTIVE = 2
    }

    public enum MEDIA_NETWORKS
    {
        [Description("SMS")]
        SMS = 1,
        [Description("WHATSAPP")]
        WHATSAPP = 2,
        [Description("EMAIL")]
        EMAIL = 3,
        [Description("TWITTER")]
        TWITTER = 4,
        [Description("FACEBOOK")]
        FACEBOOK = 5,
        [Description("INSTAGRAM")]
        INSTAGRAM = 6,
        [Description("LINKEDIN")]
        LINKEDIN = 7,
        [Description("TIKTOK")]
        TIKTOK = 8,
        [Description("SNAPCHAT")]
        SNAPCHAT = 9
    }
    public enum INTERVAL_TYPES
    {
        [Description("ONE TIME")]
        One_Time = 1,
        [Description("DAILY")]
        Daily = 2,
        [Description("WEEKLY")]
        Weeklly = 3,
        [Description("MONTHLY")]
        Monthly = 4,
        [Description("YEARLT")]
        Yearly = 5,
        [Description("CUSTOM")]
        Custom = 6
    }
    public enum POST_TYPES
    {
        [Description("POST MESSAGE")]
        POST_MESSAGE = 1,
        [Description("FB POST")]
        FBPOST = 2,
        [Description("POST & REPLY")]
        POST_REPLY = 3,
        [Description("AWARENESS MESSAGE")]
        AWAREBESS_MESSAGE = 4,
        [Description("PUBLIC MESSAGE")]
        PUBLIC_MESSAGE = 4,
        [Description("SCHEDULEED MESSAGE")]
        SCHEDULED_MESSAGE = 5
    }
    public enum PARENT_ENUMS
    {
        PACKAGES = 1,
        STATUS_BUSINESS_PLAN = 2,
        STATUS_NOTIFICATION = 3,
        STATUS_MERCHANTS = 4,
        STATUS_USERS = 5,
        USERROLES = 6,
        USER_TYPES = 7,
        PAYMENT_METHODS = 8,
        RESPONSE_STATUS = 9,
        GENDER = 11,
        STATUS_TYPE = 12,
        LOGIN_ACTIVITY = 13,
        MESSAGE_RESPONSE_TYPES = 14,
        TRANSACTION_TYPES = 15,
        COMMON_STATUS = 16,
        STATUS_ADMIN_USERS = 18,
        COMPAIGNS_STATUS = 19,
        MEDIA_NETWORKS = 20,
        INTERVAL_TYPES = 21,
        POST_TYPES = 22
    }
    public enum USERROLES
    {
        [Description("Super Admin")]
        SUPERADMIN = 1,
        [Description("Admin")]
        ADMIN = 2,
        [Description("Supervisor")]
        SUPERVISOR = 3,
        [Description("Staff")]
        STAFF = 4,
        [Description("Public User")]
        PUBLIC_USER = 5,
        [Description("Organization Admin")]
        ORG_ADMIN = 6,

    }
    public enum COMMON_STATUS_ALL
    {
        [Description("All")]
        ALL = 0
    }

    public enum USER_TYPES
    {
        [Description("Admin")]
        ADMIN = 1,
        [Description("Org Users")]
        SCHOOL_USERS = 2

    }
    public enum CookieEnums
    {
        ProfileCookie = 1,
    }
    public enum LANGUAGES
    {
        [Description("English")]
        ENGLISH = 1,
        [Description("Spanich")]
        SPANICH = 2,
    }

    public enum TRANSACTION_TYPES
    {
        [Description("Credit")]
        CREDIT = 1,
        [Description("Debit")]
        DEBIT = 2,
    }
    public enum PAYMENT_METHODS
    {
        [Description("Credit Card")]
        CREDIT_CARD = 1,
        [Description("Account Transfer")]
        E_TRAINSACTION = 2
    }
    public enum RESPONSE_RESULT
    {
        SUCCESS = 1,
        ERROR = 2,
        WARNING = 3,
        MESSAGE = 1,
    }

    public enum VIEW_COUNT_INTERVALS
    {
        SHORT = 30,
        LONG = 60
    }

    public enum GENDER
    {
        [Description("Male")]
        MALE = 1,
        [Description("Female")]
        FEMALE = 2,

    }
    public enum COMPAIGNS_STATUS
    {
        DEFAULT = 0,
        NEW = 1,
        INACTIVE = 2,
        CLOSED = 10,
        DELIVERED = 15,
        DROPPED = 12
    }

    public enum AUDIT_ENTITIES
    {
        USERS = 1,
        MERCHANTS = 2,
        PAYMENTS = 3
    }


    public enum STATUS_USERS
    {
        [Description("Active")]
        ACTIVE = 1,
        [Description("In-active")]
        INACTIVE = 2,
        [Description("Invited")]
        INVITED = 3,
        [Description("Blocked")]
        ACCESS_BLOCKED = 4,

    }

    public enum STATUS_NOTIFICATION
    {
        [Description("Candidate")]
        CANDIATE_FOR_DELIVERY = 9,
        [Description("Delivered")]
        DELIVERY_SUCCESS = 10,
        [Description("Not Delivered")]
        DELIVERY_FAILED = 11,
        [Description("Dropped")]
        DROPPED_NO_MORE_DELIVERY = 12
    }
    public enum STATUS_VIEDO
    {
        [Description("Candidate")]
        VIDEO_UPLOAD_CANDIDATE = 13,
        [Description("Uploaded")]
        UPLOADED_SUCCESSFULLY = 14,
        [Description("Failed")]
        UPLOAD_FAILED = 15,
        [Description("Dropped")]
        DROPPED_NO_MORE_UPLOAD = 16
    }
    public enum STATUS_BUSINESS_PLAN
    {
        [Description("New")]
        NEW = 5,
        [Description("Under Review")]
        Under_Moderation = 6,
        [Description("Approved")]
        Approved = 7,
        [Description("Rejected")]
        REJECTED = 8,
        [Description("Paid")]
        PAID = 9,
        [Description("Closed")]
        CLOSED = 10
    }
    public enum LOOKUP_TYPES
    {
        [Description("Statuses")]
        STATUS = 1,
        [Description("Alert Levels")]
        ALERT_LEVELS = 2,
        [Description("States")]
        STATES = 3,
        [Description("Networks")]
        NETWORKS = 4,
        [Description("IntervalTypes")]
        INTERVAL_TYPES = 5,
        [Description("NotificationTypes")]
        NOTIFICATION_TYPE = 6,
        [Description("Packages")]
        PACKAGE = 7,
        [Description("Currencies")]
        CURRENCIES = 8,
        [Description("Countries")]
        COUNTRIES = 9,
        [Description("Post Types")]
        POST_TYPES = 10,
        [Description("USER_ROLES")]
        USER_ROLES = 22
    }
    public enum STATUS_TYPE
    {
        USERS = 1,
        MERCHANTS = 2,
        MESSAGE = 3,
        DONORS = 4

    }
    public enum LOGIN_ACTIVITY
    {
        [Description("Logged In")]
        LOGGED_IN = 1,
        [Description("Logged Out")]
        LOGGED_OUT = 2

    }
    public enum PACKAGES
    {
        [Description("FREE")]
        FREE = 1,
        [Description("Monthly")]
        MONTHLY = 2,
        [Description("Half Yearly")]
        HALF_YEARLY = 3,
        [Description("Yearly")]
        YEARLY = 4,

    }
    public class CatgeryLegend
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public static class PackageUtil
    {
        //public static string MakeThumbnail(byte[] myImage)
        //{
        //    if (myImage == null || myImage.Length <= 10) return "";
        //    using (MemoryStream ms = new MemoryStream())
        //    using (Image thumbnail = Image.FromStream(new MemoryStream(myImage)).GetThumbnailImage(100, 100, null, new IntPtr()))
        //    {
        //        thumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
        //        return Convert.ToBase64String(ms.ToArray());
        //    }
        //}
        public static string VideoMimeType(string videoWithExtension)
        {
            return videoWithExtension.Contains(".") ? "video/" + videoWithExtension.Split(".")[1].ToString() : "video/mp4";
        }

        //public static byte[] CompressProfileImage(MemoryStream ms)
        //{
        //    if (ms == null || ms.Length <= 10) return null;
        //    Image actual = Image.FromStream(ms);
        //    // using (MemoryStream ms = new MemoryStream())
        //    //  System.Drawing.Size size = GetThumbnailSize(actual);           
        //    using (Image thumbnail = actual.GetThumbnailImage(100, 120, null, new IntPtr()))
        //    {

        //        var qualityEncoder = System.Drawing.Imaging.Encoder.Quality;
        //        var quality = (long)100; //Image Quality 
        //        var ratio = new EncoderParameter(qualityEncoder, quality);
        //        var codecParams = new EncoderParameters(1);
        //        codecParams.Param[0] = ratio;
        //        //Rightnow I am saving JPEG only you can choose other formats as well
        //        var codecInfo = GetEncoder(ImageFormat.Jpeg);


        //        //   thumbImage.Save(thumbnailPath, codecInfo, codecParams);

        //        thumbnail.Save(ms, codecInfo, codecParams);
        //        return ms.ToArray();
        //    }
        //}
        //private static ImageCodecInfo GetEncoder(ImageFormat format)
        //{
        //    ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
        //    foreach (ImageCodecInfo codec in codecs)
        //    {
        //        if (codec.FormatID == format.Guid)
        //        {
        //            return codec;
        //        }
        //    }
        //    return null;
        //}
        //static System.Drawing.Size GetThumbnailSize(Image original)
        //{
        //    // Maximum size of any dimension.
        //    const int maxPixels = 40;

        //    // Width and height.
        //    int originalWidth = original.Width;
        //    int originalHeight = original.Height;

        //    // Compute best factor to scale entire image based on larger dimension.
        //    double factor;
        //    if (originalWidth > originalHeight)
        //    {
        //        factor = (double)maxPixels / originalWidth;
        //    }
        //    else
        //    {
        //        factor = (double)maxPixels / originalHeight;
        //    }

        //    // Return thumbnail size.
        //    return new System.Drawing.Size((int)(originalWidth * factor), (int)(originalHeight * factor));
        //}
        public static int GenerateRandomNo()
        {
            int _min = 1000;
            int _max = 9999;
            Random _rdm = new Random();
            return _rdm.Next(_min, _max);
        }
        public static int getPackageDays(int packageId)
        {
            int days = 0;
            switch (packageId)
            {
                case 1:
                    days = 365;
                    break;
                case 2:
                    days = 30;
                    break;
                case 3:
                    days = 7;
                    break;
            }
            return days;
        }
        //public static System.Data.DataTable excelToDataTable(Stream excelFile)
        //{
        //    System.Data.DataTable dt = new System.Data.DataTable();
        //    //Checking file content length and Extension must be .xlsx  
        //    string readRange = "1:6";
        //    //  string path = excelFile;

        //    //Started reading the Excel file.  
        //    using (XLWorkbook workbook = new XLWorkbook(excelFile))
        //    {
        //        IXLWorksheet worksheet = workbook.Worksheet(1);
        //        bool FirstRow = true;

        //        FirstRow = true;
        //        //Range for reading the cells based on the last cell used.  
        //        int skipRows = 3, currentRow = 1;

        //        foreach (IXLRow row in worksheet.RowsUsed())
        //        {
        //            currentRow += 1;
        //            if (currentRow <= skipRows)
        //                continue;
        //            //If Reading the First Row (used) then add them as column name  
        //            if (FirstRow)
        //            {
        //                //Checking the Last cellused for column generation in datatable  
        //                readRange = string.Format("{0}:{1}", 1, row.LastCellUsed().Address.ColumnNumber);
        //                foreach (IXLCell cell in row.Cells(readRange))
        //                {
        //                    dt.Columns.Add(cell.Value.ToString());
        //                }
        //                FirstRow = false;
        //            }//    if (FirstRow)
        //            else
        //            {
        //                // Perform validation for data
        //                if (row.LastCellUsed().Address.ColumnNumber != 6)
        //                {
        //                    break;
        //                    throw new Exception("Excel file is not correct, please download template & just fill video sheet data..!");
        //                }
        //                if (Convert.ToString(row.Cell(2).Value).Trim() != string.Empty)
        //                {
        //                    //Adding a Row in datatable  
        //                    dt.Rows.Add();
        //                    int cellIndex = 0;
        //                    //Updating the values of datatable  
        //                    foreach (IXLCell cell in row.Cells(readRange))
        //                    {

        //                        if (cell.HasDataValidation)
        //                            dt.Rows[dt.Rows.Count - 1][cellIndex] = cell.Value.ToString();
        //                        else
        //                            dt.Rows[dt.Rows.Count - 1][cellIndex] = cell.Value.ToString();
        //                        cellIndex++;
        //                    }

        //                }// if(Convert.ToString(row.Cell(2).Value).Trim() != string.Empty) {
        //            }
        //        }

        //    }

        //    return dt;


        //}
        //public static XDocument ExcelToXMLDocument(Stream excelFile)
        //{
        //    System.Data.DataTable dt = new System.Data.DataTable("Merchants");
        //    //Checking file content length and Extension must be .xlsx 
        //    XDocument xDoc = new XDocument();
        //    try
        //    {

        //        string readRange = "1:7";
        //        //  string path = excelFile;

        //        //Started reading the Excel file.  
        //        using (XLWorkbook workbook = new XLWorkbook(excelFile))
        //        {
        //            IXLWorksheet worksheet = workbook.Worksheet(1);
        //            bool FirstRow = true;

        //            FirstRow = true;
        //            //Range for reading the cells based on the last cell used.  
        //            int skipRows = 3, currentRow = 1;

        //            foreach (IXLRow row in worksheet.RowsUsed())
        //            {
        //                currentRow += 1;
        //                if (currentRow <= skipRows)
        //                    continue;
        //                //If Reading the First Row (used) then add them as column name  
        //                if (FirstRow)
        //                {
        //                    //Checking the Last cellused for column generation in datatable  
        //                    readRange = string.Format("{0}:{1}", 1, row.LastCellUsed().Address.ColumnNumber);
        //                    foreach (IXLCell cell in row.Cells(readRange))
        //                    {
        //                        dt.Columns.Add(cell.Value.ToString());
        //                    }
        //                    FirstRow = false;
        //                }//    if (FirstRow)
        //                else
        //                {
        //                    // Perform validation for data
        //                    if (row.LastCellUsed().Address.ColumnNumber != 7)
        //                    {
        //                        break;
        //                        throw new Exception("Excel file is not readable, please download template & just fill video sheet data..!");
        //                    }
        //                    if (Convert.ToString(row.Cell(2).Value).Trim() != string.Empty)
        //                    {
        //                        //Adding a Row in datatable  
        //                        dt.Rows.Add();
        //                        int cellIndex = 0;
        //                        //Updating the values of datatable  
        //                        foreach (IXLCell cell in row.Cells(readRange))
        //                        {

        //                            if (cell.HasDataValidation)
        //                                dt.Rows[dt.Rows.Count - 1][cellIndex] = cell.Value.ToString();
        //                            else
        //                                dt.Rows[dt.Rows.Count - 1][cellIndex] = cell.Value.ToString();
        //                            cellIndex++;
        //                        }

        //                    }// if(Convert.ToString(row.Cell(2).Value).Trim() != string.Empty) {
        //                }
        //            }

        //        }

        //        //xDoc.Declaration = new XDeclaration("1.0", "utf-16", null);//Optional: SQL-Server already stores XML using UTF-16.  The default for XDocument is also UTF-16 when the Declaration is null. - 07/26/2018 - MCR.

        //        if (dt.Rows.Count > 0)
        //        {
        //            XElement xRoot = new XElement("merchants");

        //            xRoot.Add(dt.AsEnumerable()
        //    .Where(r => r.Field<string>("email") != "")//Optional: Add Filter.  This works.
        //    .Select(dr => new XElement("merchant",
        //                             new XAttribute("id", Convert.ToInt16(dr["sr"])),
        //                                  new XAttribute("first_name", "" + dr["first_name"]),
        //                                  new XAttribute("last_name", "" + dr["last_name"]),
        //                                  new XAttribute("email", "" + dr["email"]), new XAttribute("grade", "" + dr["grade"]),
        //                                  new XAttribute("gpa", Convert.ToDouble(dr["gpa"])),
        //                                  new XAttribute("dob", Convert.ToDateTime(dr["dob"]))
        //                             )
        //           )
        // );

        //            xDoc.Add(xRoot);

        //        }
        //        else
        //        {
        //            throw new Exception("Load failed or empty file");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return xDoc;
        //}

        public enum REPORTS
        {
            SUBSCRIBER_STAT_REPORT = 1

        }
        public static Boolean IsBase64(this String str)
        {
            if ((str.Length % 4) != 0)
            {
                return false;
            }
            //decode - encode and compare
            try
            {
                string decoded = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(str));
                string encoded = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(decoded));
                if (str.Equals(encoded, StringComparison.InvariantCultureIgnoreCase))
                {
                    return true;
                }
            }
            catch { }
            return false;
        }
        public static string DecodeText(string text)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(text));
        }     

    }
}