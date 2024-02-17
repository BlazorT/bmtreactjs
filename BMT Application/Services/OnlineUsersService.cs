using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositories;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class OnlineUsersService : IOnlineUsersService
    {
        private readonly IOnlineUsersRepository _onlineUsersRepository;
        private readonly IAppLogger<OnlineUsersService> _logger;
        private readonly IMapper _mapper;
        public OnlineUsersService(IOnlineUsersRepository onlineUsersRepository, IMapper mapper, IAppLogger<OnlineUsersService> logger)
        {
            _onlineUsersRepository = onlineUsersRepository ?? throw new ArgumentNullException(nameof(onlineUsersRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        //Task<IEnumerable<OnlineUsersModel>> GetListByStatusAsync(int status, DateTime dtFrom, DateTime dtTo);


        //Task<OnlineUsersModel> GetOnlineUserByIdAsync(int userId);

        //Task<OnlineUsersModel> Create(OnlineUsersModel onlineUsersModel);
        //Task Update(OnlineUsersModel onlineUsersModel);


        public async Task<IEnumerable<OnlineuserModel>> GetListByStatusAsync(int status , DateTime dtFrom, DateTime dtTo)
        {
            var list = await _onlineUsersRepository.GetListByStatusAsync(status, dtFrom, dtTo);          
            var mapped = _mapper.Map<IEnumerable<OnlineuserModel>>(list);
            return mapped;
        }
        public async Task<OnlineuserModel> GetOnlineUserByIdAsync(int userId)
        {
            var userList = await _onlineUsersRepository.GetOnlineUserByIdAsync(userId);
            var mapped = _mapper.Map<OnlineuserModel>(userList);
            return mapped;
        }

        public async Task<OnlineuserModel> Create(OnlineuserModel model)
        {
           // await ValidateEntityIfExist(model);

            var mappedEntity = _mapper.Map<Onlineuser>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _onlineUsersRepository.AddAsync(mappedEntity);
            _logger.LogInformation($"Entity successfully added - OnlineUsersService");

            var newMappedEntity = _mapper.Map<OnlineuserModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(OnlineuserModel model)
        {
           // ValidateEntityIfExist(model);
            
            var editModel = await _onlineUsersRepository.GetOnlineUserByIdAsync(model.UserId);
            if (editModel == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<OnlineuserModel, Onlineuser>(model, editModel);

            await _onlineUsersRepository.UpdateAsync(editModel);
            _logger.LogInformation($"Entity successfully updated - OnlineUsersService");
        }

        //private async Task ValidateEntityIfExist(OnlineUsersModel model)
        //{
        //    var existingEntity = await _onlineUsersRepository.GetOnlineUserByIdAsync(model.UserId);
        //    if (existingEntity != null)
        //        throw new ApplicationException($"{model.ToString()} with this id already exists");
        //}

        //private async Task ValidateEntityIfNotExist(OnlineUsersModel model)
        //{
        //    var existingEntity = await _onlineUsersRepository.GetOnlineUserByIdAsync(model.UserId);
        //    if (existingEntity == null)
        //        throw new ApplicationException($"{model.ToString()} with this id is not exists");
        //}
    }
}
