namespace com.blazor.bmt.core.baseentity
{
    public interface IEntityBase<TId>
    {
        TId Id { get; }
    }
}
