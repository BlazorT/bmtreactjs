using System;

namespace com.blazor.bmt.infrastructure.exception
{
    public class BlazorException : Exception
    {
        internal BlazorException(string businessMessage)
               : base(businessMessage)
        {
        }

        internal BlazorException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
