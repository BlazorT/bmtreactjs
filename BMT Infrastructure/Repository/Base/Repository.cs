using com.blazor.bmt.core.baseentity;
using com.blazor.bmt.core.repositries;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace com.blazor.bmt.infrastructure.repositories
{
    public class Repository<T> : IRepository<T> where T : Entity
    {
        protected readonly _bmtContext _dbContext;

        public Repository(_bmtContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        //public async Task<IReadOnlyList<T>> GetAsync(ISpecification<T> spec)
        //{
        //    return await ApplySpecification(spec).ToListAsync();
        //}

        ////public async Task<int> CountAsync(ISpecification<T> spec)
        ////{
        ////    return await ApplySpecification(spec).CountAsync();
        ////}

        ////private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        ////{
        ////    return SpecificationEvaluator<T>.GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
        ////}

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeString = null, bool disableTracking = true)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            if (disableTracking) query = query.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(includeString)) query = query.Include(includeString);

            if (predicate != null) query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).ToListAsync();
            return await query.ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<Expression<Func<T, object>>> includes = null, bool disableTracking = true)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            if (disableTracking) query = query.AsNoTracking();

            if (includes != null) query = includes.Aggregate(query, (current, include) => current.Include(include));

            if (predicate != null) query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).ToListAsync();
            return await query.ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {

            var result = Task.Run(async () => await _dbContext.Set<T>().FindAsync(id)).Result;
            // return await _dbContext.Set<T>().FindAsync(id);
            return result;
        }

        public async Task<T> AddAsync(T entity)
        {
            _dbContext.Set<T>().Add(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(T entity)
        {

            _dbContext.Entry(entity).State = EntityState.Modified;
            // _dbContext.Entry(entity).State = EntityState.Detached;
            //_dbContext.Entry(entity).CurrentValues.SetValues(entity);
            // _dbContext.Entry(entity).State = EntityState.Modified;
            var result = Task.Run(async () => await _dbContext.SaveChangesAsync()).Result;
            //await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            // context.Entry(author).State = EntityState.Deleted;
            _dbContext.Entry(entity).State = EntityState.Deleted;
            // _dbContext.Set<T>().Remove(entity);
            var result = Task.Run(async () => await _dbContext.SaveChangesAsync()).Result;
            // await _dbContext.SaveChangesAsync();
        }
    }
    public class RepositoryTransaction<T> : IRepositoryTransaction<T> where T : EntityTransaction
    {
        protected readonly _bmtContext _dbContext;

        public RepositoryTransaction(_bmtContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        //public async Task<IReadOnlyList<T>> GetAsync(ISpecification<T> spec)
        //{
        //    return await ApplySpecification(spec).ToListAsync();
        //}

        //public async Task<int> CountAsync(ISpecification<T> spec)
        //{
        //    return await ApplySpecification(spec).CountAsync();
        //}

        ////private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        ////{
        ////    return null;
        ////   // return SpecificationEvaluator<T>.GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
        ////}

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeString = null, bool disableTracking = true)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            if (disableTracking) query = query.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(includeString)) query = query.Include(includeString);

            if (predicate != null) query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).ToListAsync();
            return await query.ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, List<Expression<Func<T, object>>> includes = null, bool disableTracking = true)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            if (disableTracking) query = query.AsNoTracking();

            if (includes != null) query = includes.Aggregate(query, (current, include) => current.Include(include));

            if (predicate != null) query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).ToListAsync();
            return await query.ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {

            var result = Task.Run(async () => await _dbContext.Set<T>().FindAsync(id)).Result;
            // return await _dbContext.Set<T>().FindAsync(id);
            return  result;
        }

        public async Task<T> AddAsync(T entity)
        {
            _dbContext.Set<T>().Add(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(T entity)
        {

            _dbContext.Entry(entity).State = EntityState.Modified;
            // _dbContext.Entry(entity).State = EntityState.Detached;
            //_dbContext.Entry(entity).CurrentValues.SetValues(entity);
            // _dbContext.Entry(entity).State = EntityState.Modified;
            var result = Task.Run(async () => await _dbContext.SaveChangesAsync()).Result;
            //await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
           // context.Entry(author).State = EntityState.Deleted;
            _dbContext.Entry(entity).State = EntityState.Deleted;
            // _dbContext.Set<T>().Remove(entity);
            var result = Task.Run(async () => await _dbContext.SaveChangesAsync()).Result;
           // await _dbContext.SaveChangesAsync();
        }
    }
}
