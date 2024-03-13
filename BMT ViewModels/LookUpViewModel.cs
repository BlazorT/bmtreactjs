namespace com.blazor.bmt.viewmodels
{
   
    public class LookUpViewModel
    {
        public int Id { get; set; }         
        public string Name { get; set; }
        public string Code { get; set; }
        public string Desc { get; set; }
        public int  LVType { get; set; }    
        public int SortOrder { get; set; }
       

    }
    public class networkidvalues
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public int? CreatedBy { get; set; }
    }
}
