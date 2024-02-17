namespace com.blazor.bmt.viewmodels
{

    public partial class StatusesViewModel: BaseViewModel
    {
        //public Statuses()
        //{
        //    Configrations = new HashSet<Configrations>();
        //    ContentCategories = new HashSet<ContentCategories>();
        //    MediaContent = new HashSet<MediaContent>();
        //    MediaSourceInfo = new HashSet<MediaSourceInfo>();
        //    Menus = new HashSet<Menus>();
        //    Notification = new HashSet<Notification>();
        //    States = new HashSet<States>();
        //}
        
        public byte? StatusCategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
       
        public int SortOrder { get; set; }
        public int RowVer { get; set; }

        //public virtual ICollection<Configrations> Configrations { get; set; }
        //public virtual ICollection<ContentCategories> ContentCategories { get; set; }
        //public virtual ICollection<MediaContent> MediaContent { get; set; }
        //public virtual ICollection<MediaSourceInfo> MediaSourceInfo { get; set; }
        //public virtual ICollection<Menus> Menus { get; set; }
        //public virtual ICollection<Notification> Notification { get; set; }
        //public virtual ICollection<States> States { get; set; }
    }
}
