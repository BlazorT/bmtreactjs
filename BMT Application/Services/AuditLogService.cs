using AutoMapper;
using Blazor.Web.Application.Interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.dsps.core.repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class AuditLogService : IAuditLogService
    {
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly IAppLogger<AuditLogService> _logger;
        private readonly IMapper _mapper;

        public AuditLogService(IAuditLogRepository auditLogRepository, IMapper mapper, IAppLogger<AuditLogService> logger)
        {
            _auditLogRepository = auditLogRepository ?? throw new ArgumentNullException(nameof(auditLogRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }       
    
        public async Task<IEnumerable<AuditLogModel>> GetAuditlogList()
        {
            var list = await _auditLogRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<AuditLogModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<AuditLogModel>> GetAuditlogBySearchKeyword(string keyword)
        {
            var list = await _auditLogRepository.GetAuditLogByKeywordAsync(keyword);
            var mapped = _mapper.Map<IEnumerable<AuditLogModel>>(list);
            return mapped;
        }
        public async Task<IEnumerable<AuditLogModel>> GetAuditlogDetails(AuditLogModel model)
        {
            var entity = _mapper.Map<Auditlog>(model);
            var list = await _auditLogRepository.GetAuditLogDetailsAsync(entity);
            var mapped = _mapper.Map<IEnumerable<AuditLogModel>>(list);
            return mapped;
        }
        public async Task<AuditLogModel> GetAuditlogById(long logId)
        {
            var address = await _auditLogRepository.GetAuditLogByIDAsync(logId);
            var mapped = _mapper.Map<AuditLogModel>(address);
            return mapped;
        }


        public async Task<IEnumerable<AuditLogModel>> GetAuditlogByUserId(int userId)
        {
            var AddressList = await _auditLogRepository.GetAuditLogByUserAsync(userId);
            var mapped = _mapper.Map<IEnumerable<AuditLogModel>>(AddressList);
            return mapped;
        }

        public async Task Create(AuditLogModel AppLogModel)
        {
            //await ValidateProductIfExist(AppLogModel);

            var mappedEntity = _mapper.Map<Auditlog>(AppLogModel);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _auditLogRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - AuditLogService");

           // var newMappedEntity = ObjectMapper.Mapper.Map<AppLogModel>(newEntity);
           // return newMappedEntity;
        }
    
    }
}
