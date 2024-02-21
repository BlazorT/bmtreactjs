using AutoMapper;
using com.blazor.bmt.application.interfaces;
using com.blazor.bmt.application.model;
using com.blazor.bmt.core;
using com.blazor.bmt.core.interfaces;
using com.blazor.bmt.core.repositries;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.application.services
{
    // TODO : add validation , authorization, logging, exception handling etc. -- cross cutting activities in here.
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepository;
        private readonly IAppLogger<UsersService> _logger;
        private readonly IMapper _mapper;
        public UsersService(IUsersRepository usersRepository, IMapper mapper, IAppLogger<UsersService> logger)
        {
            _userRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }       
        public async Task<IEnumerable<UserModel>> GetAllUsersList(UserModel model)
        {
            var umodal = _mapper.Map<User>(model);
            var ulist = await _userRepository.GetUsersAllFiltersAsync(umodal);
            var mapped = _mapper.Map<IEnumerable<UserModel>>(ulist);
            return mapped;
        }       
        public async Task<IEnumerable<UserModel>> GetMobileUsersByAllFiltersAsync(UserModel model) {
            var umodal = _mapper.Map<User>(model);
            var ulist = await _userRepository.GetOrgMobileUsersAllFiltersAsync(umodal);
            var mapped = _mapper.Map<IEnumerable<UserModel>>(ulist);
            return mapped;
        }
        public async Task<IEnumerable<UserModel>> GetAllDspUsersList(UserModel model) {
            var umodal = _mapper.Map<User>(model);
            var ulist = await _userRepository.GetOrgUsersAllFiltersAsync(umodal);           
            var mapped = _mapper.Map<IEnumerable<UserModel>>(ulist);
            return mapped;
        }
        public async Task<IEnumerable<UserModel>> GetUsersList()
        {
            var priceList = await _userRepository.GetAllAsync();          
            var mapped = _mapper.Map<IEnumerable<UserModel>>(priceList);
            return mapped;
        }
        public async Task<IEnumerable<UserModel>> GetUsersByName(string name)
        {
            var lst = await _userRepository.GetUsersByNameAsync(name);
            var mapped = _mapper.Map<IEnumerable<UserModel>>(lst);
            return mapped;
        }
      
        public async Task<UserModel> GetUsersById(int id)
        {
            var model = await _userRepository.GetByIdAsync(id);
            var mapped = _mapper.Map<UserModel>(model);
            return mapped;
        }


        public async Task<IEnumerable<UserModel>> GetUsersByDspAndRole(int roleId, int dspId = 0)
        {
            var PriceList = await _userRepository.GetUsersByRoleAsync(roleId, dspId);
            var mapped = _mapper.Map<IEnumerable<UserModel>>(PriceList);
            return mapped;
        }

        public async Task<UserModel> Create(UserModel model)
        {
            await ValidateProductIfExist(model);

            var mappedEntity = _mapper.Map<UserModel, User>(model);
            if (mappedEntity == null)
                throw new ApplicationException($"Entity could not be mapped.");
           
            var newEntity = await _userRepository.AddAsync(mappedEntity);
           // _logger.LogInformation($"Entity successfully added - Users Service");

            var newMappedEntity = _mapper.Map<UserModel>(newEntity);
            return newMappedEntity;
        }

        public async Task Update(UserModel model)
        {
            //ValidateProductIfNotExist(model);
            
            var editPrice = await _userRepository.GetByIdAsync(model.id);
            if (editPrice == null)
                throw new ApplicationException($"Entity could not be loaded.");

            _mapper.Map<UserModel, User>(model, editPrice);

            await _userRepository.UpdateAsync(editPrice);
           // _logger.LogInformation($"Entity successfully updated - Users Service");
        }

        public async Task Delete(UserModel model)
        {
            ValidateProductIfNotExist(model);
            var deletedMdl = await _userRepository.GetByIdAsync(model.id);
            if (deletedMdl == null)
                throw new ApplicationException($"Entity could not be loaded.");

            await _userRepository.DeleteAsync(deletedMdl);
           // _logger.LogInformation($"Entity successfully deleted - Users Service");
        }

        private async Task ValidateProductIfExist(UserModel model)
        {
            var existingEntity = await _userRepository.GetByIdAsync(model.id);
            if (existingEntity != null)
                throw new ApplicationException($"{model.ToString()} with this id already exists");
        }

        private void ValidateProductIfNotExist(UserModel model)
        {
            var existingEntity = _userRepository.GetByIdAsync(model.id);
            if (existingEntity == null)
                throw new ApplicationException($"{model.ToString()} with this id is not exists");
        }
    }
}
