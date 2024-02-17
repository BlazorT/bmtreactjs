
using AutoMapper;
using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;

namespace com.blazor.bmt.ui.services
{
    public class IndexPageService : IIndexPageService
    {
       // private readonly IProductService _productAppService;
        private readonly IMapper _mapper;

        public IndexPageService(IMapper mapper)
        {
           // _productAppService = productAppService ?? throw new ArgumentNullException(nameof(productAppService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<VehicleViewModel>> GetProducts()
        {
           // var list = await _productAppService.GetProductList();
           // var mapped = _mapper.Map<IEnumerable<ProductViewModel>>(list);
            return null;
        }
    }
}

