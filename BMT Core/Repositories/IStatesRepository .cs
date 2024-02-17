using com.blazor.bmt.core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace com.blazor.bmt.core.repositries
{
    public interface IStatesRepository 
    {
        Task<IEnumerable<State>> GetStatesListByStatusAsync(int status);       
        Task<IEnumerable<State>> GetStatesByNameAsync(string name);
        
    }
}
