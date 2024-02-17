using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace com.blazor.bmt.authentication
{
    public class PoliciesAuthorizationHandler : AuthorizationHandler<BlazorUserRequireClaim>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            BlazorUserRequireClaim requirement)
        {
            if (context.User == null || !context.User.Identity.IsAuthenticated)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var hasClaim = context.User.Claims.Any(x => x.Type == requirement.ClaimType);

            if (hasClaim)
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            context.Fail();
            return Task.CompletedTask;
        }
    }
}

public class BlazorUserRequireClaim : IAuthorizationRequirement
{
    public string ClaimType { get; }
    public BlazorUserRequireClaim(string claimType)
    {
        ClaimType = claimType;
    }
}