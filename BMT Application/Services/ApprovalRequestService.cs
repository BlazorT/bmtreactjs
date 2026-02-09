using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class ApprovalRequestService : IApprovalRequestService
    {
        private readonly IApprovalRequestRepository _appovalRequestRepository;
        private readonly IAppLogger<ApprovalRequestService> _logger;
        private readonly IMapper _mapper;
        public ApprovalRequestService(IApprovalRequestRepository approvalRequestRepository, IMapper mapper, IAppLogger<ApprovalRequestService> logger)
        {
            _appovalRequestRepository = approvalRequestRepository ?? throw new ArgumentNullException(nameof(approvalRequestRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<ApprovalrequestModel>> GetApprovalRequestAllFiltersAsync(ApprovalrequestModel model)
        {
            var entity = _mapper.Map<Approvalrequest>(model);
            var list = await _appovalRequestRepository.GetApprovalRequestAllFiltersAsync(entity);
            var mapped = _mapper.Map<IEnumerable<ApprovalrequestModel>>(list);
            return mapped;
        }
        public async Task<ApprovalrequestModel> GetApprovalRequestById(long id)
        {
            var address = await _appovalRequestRepository.GetApprovalRequestByIdAsync(id);
            var mapped = _mapper.Map<ApprovalrequestModel>(address);
            return mapped;
        }
        public async Task<IEnumerable<ApprovalrequestModel>> GetApprovalRequestByOrgId(int orgId)
        {
            var AddressList = await _appovalRequestRepository.GetApprovalRequestByOrgAsync(orgId);
            var mapped = _mapper.Map<IEnumerable<ApprovalrequestModel>>(AddressList);
            return mapped;
        }

        public async Task<ApprovalrequestModel> Create(ApprovalrequestModel AppLogModel)
        {
            //await ValidateProductIfExist(AppLogModel);

            var mappedEntity = _mapper.Map<Approvalrequest>(AppLogModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _appovalRequestRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - ApprovalRequestService");
           // _mapper.Map<ApprovalrequestModel>(newEntity);

          //  var newMappedEntity = ObjectMapper.Mapper.Map<AppLogModel>(newEntity);
            return _mapper.Map<ApprovalrequestModel>(newEntity); ;
        }
        public async Task<ApprovalrequestModel> Update(ApprovalrequestModel model)
        {
            //await ValidateEntityIfExist(userModel);

            var edit = await _appovalRequestRepository.GetApprovalRequestByIdAsync(model.Id);
            if (edit == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<ApprovalrequestModel, Approvalrequest>(model, edit);

            await _appovalRequestRepository.UpdateAsync(edit);
            _logger.LogInformation($"Entity successfully updated - ApprovalRequestUsersService");
            return model;
        }
    }
}
