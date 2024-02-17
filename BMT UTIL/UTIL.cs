using System.ComponentModel;


namespace com.blazor.bmt.util
{
    public class UTIL
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
        public enum COMMON_STATUS
        {
            ACTIVE = 1,
            INACTIVE = 2
        }
        public enum PRODUCT_ASSIGNMENT_TYPES
        {
            [Description("Daily Assignment")]
            DAILY_ASSIGNMENT = 29,
            [Description("One Time")]
            ONE_TIME = 30           
        }
        public enum SYNCH_STATUS
        {
            [Description("New Data")]
            SYNCH_CANDIDATE = 25,
            [Description("Synched")]
            SYNCH_DONE = 26,
            [Description("Synch Failed")]
            SYNCH_FAILED = 27   ,
            [Description("Manual Synch")]
            MANUAL_SYNCH = 28
        }
        public enum ROSTER_STATUS
        {
            [Description("Planned")]
            ROSTER_PLANNED = 21,
            [Description("Current Plan")]
            SYNCH_DONE = 22,
            [Description("Executed Plan")]
            SYNCH_FAILED = 23,
            [Description("Cancelled  Plan")]
            MANUAL_SYNCH = 24
        }
        public enum VEHICLE_STATUS
        {
            [Description("OPERATIONAL")]
            OPERATIONAL = 1,
            [Description("GROUNDED")]
            GROUNDED = 2,
            [Description("MAINTENANCE")]
            MAINTENANCE = 3
        }
        public enum AUDIT_ENTITIES
        {
            [Description("DA")]
            DA = 1,
            [Description("DSP")]
            DSP = 2,
            [Description("AWSDashboard")]
            AWSDashboard = 3,
            [Description("Accurate")]
            ACCURATE = 4,
            [Description("LabCorp")]
            LAPCORP = 5,
            [Description("NetraDyne")]
            NETRADYNE = 6,
            [Description("Fleet")]
            FLEET = 7,
            [Description("Vehilce")]
            VEHICLE = 8
        }
        public enum SERVICE_TYPES
        {
            [Description("AWS")]
            AWS = 1,
            [Description("Back Ground Check")]
            BACKGROUND_CHECK = 2,
            [Description("Drug Test")]
            DRUG_TEST = 3,
            [Description("NetraDyne")]
            NETRADYNE = 4,
        }
        public enum VEHICLE_CATEGORIES {
            [Description("Car")]
            CAR = 1,
            [Description("BIKE")]
            BIKE = 2,
            [Description("VAN")]
            VAN = 3,
            [Description("TRUCK")]
            TRUCK = 4,
            [Description("BUS")]
            BUS = 5,
            [Description("JEEP")]
            JEEP = 6
        }
        public enum NOTIFICATION_TYPES
        {
            [Description("EMAIL")]
            EMAIL = 1,
            [Description("SMS")]
            SMS = 2,
            [Description("Notification")]
            NOTIFICATION = 3
        }
        public enum VEHICLE_OWNERSHIPS
        {
            [Description("Amazon")]
            AMAZON = 1,
            [Description("Partner")]
            PARTNER = 2,
            [Description("Contract")]
            CONTRACT = 3           
        }
        public enum STATUS_SUB_CATEGORY
        {
            [Description("DA")]
            DA = 1,
            [Description("Accessory Status")]
            ACCESSORY_STATUS = 2,
            [Description("Inventory Part")]
            INVENTORY_PART = 3,
            [Description("Vehicle Status")]
            VEHICLE_STATUS = 4,
            [Description("Inspection Status")]
            INSPECTION_STATUS = 5
            
        }
        public enum AVAILIBILITY_STATUS
        {
            [Description("YES")]
            YES = 1,
            [Description("NO")]
            NO = 2
        }
        public enum LOOKUP_TYPES
        {
            [Description("Statuses")]
            STATUS = 1,
            [Description("Business Types")]
            BUSINESS_TYPES = 2,
            [Description("States")]
            STATES = 3,
            [Description("VehicleTyes")]
            VEHICLETYPES = 4,
            [Description("Makes")]
            MAKES = 5,
            [Description("SERVICE_TYPES")]
            SERVICE_TYPES = 6,
            [Description("NotificationTypes")]
            NOTIFICATION_TYPE = 7,
            [Description("Categories")]
            CATEGORIES = 8,
            [Description("Product Groups")]
            PRODUCT_GROUPS = 9,      
            [Description("User Roles")]
            USER_ROLES = 10,
            [Description("Sub Statuses")]
            SUB_STATUS = 11,
            [Description("Countries")]
            COUNTRIES = 12,
            [Description("Audit Entities")]
            AUDIT_ENTITIES = 13,
            [Description("Business Entities")]
            BUSINESS_ENTITIES = 14,
            [Description("Vehicle Ownerships")]
            VEHICLE_OWNERSHIPS = 15,
            [Description("Menus")]
            MENUS = 16,

            [Description("Common Status")]
            COMMON_STATUS = 17,
            [Description("Inventory Categories")]
            INVENTORY_CATEGORIES = 18,
            [Description("Vehicle Status")]
            VEHICLE_STATUS = 19,
            [Description("Inspection Status")]
            INSPECTION_STATUS = 20,
            [Description("Inspection Items")]
            INSPECTION_ITEMS = 21,
            [Description("Data Types")]
            DATE_TYPES = 22,
            [Description("Field Types")]
            FIELD_TYPES = 23,

            [Description("Synch Status")]
            SYNCH_STATUS = 24,
            [Description("Roster Status")]
            ROSTER_STATUS = 25,
            [Description("DB Tables")]
            DS_TABLES = 26,
            [Description("Assignment Types")]
            ASSIGNMENT_TYPES = 27


        }
        public enum META_DATA_TYPES
        {
            [Description("MAKES")]
            MAKES = 1,
            [Description("TRANSMISSIONS")]
            TRANSMISSIONS = 2,
            [Description("FUEL TYPE")]
            FUELTYPES = 4,
            [Description("CURRENCY")]
            CURRENCY = 5,
            [Description("STORES")]
            STORES = 7,

        }       
        public enum STATUS_ADMIN_USERS
        {
            [Description("Active")]
            ACTIVE = 1,
            [Description("In-active")]
            IN_ACTIVE = 2
        }     
 
        public enum PARENT_ENUMS
        {
            COMMON_STATUS = 1,
            VEHICLE_STATUS = 2,
            AUDIT_ENTITIES = 3,
            
            SERVICE_TYPES = 5,
            VEHICLE_CATEGORIES = 6,
            AVAILIBILITY_STATUS = 7,
            LOOKUP_TYPES = 8,
            META_DATA_TYPES = 9,
            STATUS_ADMIN_USERS = 10,
            USER_ROLES = 11,
            BUSINESS_ENTITIES = 12,
            BUSINESS_TYPES = 13,
            USER_TYPES = 14,
            TRANSACTION_TYPES = 15,
            AD_SOURCE = 16,
            GENDER = 17,
            STATUS_USERS = 18 ,
            STATUS_NOTIFICATION=19,
            VEHICLE_OWNERSHIPS = 20
        }

        public enum USER_ROLES
        {
            [Description("Super Admin")]
            SUPERADMIN = 1,
            [Description("DA")]
            DA = 2,
            [Description("HR")]
            SUPERVISOR = 3,            
            [Description("Operation Manager")]
            OPERATION_MANAGER = 4,
            [Description("SuperVisor fleet")]
            SUPERVISOR_FLEET =5,
            [Description("Supervisor Opr")]
            SUPERVISOR_OPR = 6,
            [Description("Helper Driver")]
            HELPER_DRIVER = 7,
            [Description("DRIVER")]
            DRIVER = 8
        }
        public enum BUSINESS_ENTITIES
        {
            [Description("DA")]
            DA = 1,
            [Description("Vehicle")]
            VEHICLE = 2           
        }

        public enum BUSINESS_TYPES
        {
            [Description("Sole Proprieter")]
            SP= 1, 
            [Description("LLC")]
            LLC = 2,
            [Description("Partnership")]
            PARTNERSHIP = 3,
            [Description("Corporation(c, s)")]
            CORP = 4
            
        }
       
        public enum COMMON_STATUS_ALL
        {
            [Description("All")]
            ALL = 0
        }
        public enum USER_TYPES
        {
            [Description("Admin")]
            BLAZOR_ADMIN = 1,
            [Description("APP Users")]
            APP_USER = 2,
            [Description("DSP Admin")]
            SHOWROOM_ADMIN = 3

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
        public enum RESPONSE_STATUS
        {
            SUCCESS = 1,
            ERROR = 2
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
        public enum AD_SOURCE
        {
            [Description("Web")]
            WEB = 1,
            [Description("Android")]
            Android = 2,
            [Description("iOS")]
            iOS= 3,
            [Description("3rd Party")]
            External = 4,

        }        

        public enum STATUS_USERS
        {
            [Description("ACTIVE")]
            ACTIVE = 1,
            [Description("INACTIVE")]
            INACTIVE = 2,
            [Description("DELETED")]
            DELETED = 4,
            [Description("BLOCKED")]
            BLOCKED = 3,

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
      
        public enum LOGIN_ACTIVITY
        {
            [Description("Logged In")]
            LOGGED_IN = 1,
            [Description("Logged Out")]
            LOGGED_OUT = 2

        }
    }
}
