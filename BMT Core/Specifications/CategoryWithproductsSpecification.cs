using Blazor.Web.Core.Entities;
using Blazor.Web.Core.Specifications.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace Blazor.Web.Core.Specifications
{
    public sealed class CategoryWithProductsSpecification : BaseSpecification<Category>
    {
        public CategoryWithProductsSpecification(int categoryId)
            : base(b => b.Id == categoryId)
        {
            AddInclude(b => b.Products);
        }
    }    
}
