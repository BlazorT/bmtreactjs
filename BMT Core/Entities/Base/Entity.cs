using System;

namespace com.blazor.bmt.core.baseentity
{
    public abstract class Entity : EntityBase<int>
    {
    }
    public abstract class EntityTransaction : EntityBase<Int64>
    {
    }
}
