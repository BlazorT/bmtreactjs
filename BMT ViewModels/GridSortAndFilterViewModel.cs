namespace com.blazor.bmt.viewmodels
{
    public partial class GridSortAndFilterViewModel 
    {

        public string sord { get; set; }
        public string sidx { get; set; }
        public int page { get; set; } =1;
        public int rows { get; set; } = 1;
        public bool _search { get; set; } = false;
        public string searchFiled { get; set; } 
        public string searchString { get; set; }
        public string searchOper { get; set; }


    }
}
