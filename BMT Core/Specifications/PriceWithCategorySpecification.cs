using Blazor.Web.Core.Entities;
using Blazor.Web.Core.Specifications.Base;

namespace Blazor.Web.Core.Specifications
{
    public class PriceWithCategorySpecification : BaseSpecification<Price>
    {
        public PriceWithCategorySpecification(string PriceName) 
         : base(p => p.detail.ToLower().Contains(PriceName.ToLower()))
        {
           // AddInclude(p => p.Category);
        }

        public PriceWithCategorySpecification() : base(null)
        {
           // AddInclude(p => p.Category);
        }
    }
}
