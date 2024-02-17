using System;
using System.Collections.Generic;

namespace Blazor.Web.ViewModels
{
    public partial class ReportConfigurationsViewModel
    {
        public int Id { get; set; }
        public string ReportName { get; set; }
        public string StoreProcedureName { get; set; }
        public string Parameters { get; set; }
        public int Status { get; set; }
        public string ReportParameters { get; set; }
    }
}
