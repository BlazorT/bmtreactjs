using com.blazor.bmt.ui.interfaces;
using com.blazor.bmt.viewmodels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
namespace com.blazor.bmt.authentication
{
    public class BlazorBasicAuthentication : AuthenticationHandler<AuthenticationSchemeOptions>
    {
       // private readonly IUserService _userService;
        private readonly IBlazorRepoPageService _blazorRepoPageService;

        public BlazorBasicAuthentication(
            IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger,
        UrlEncoder encoder,
            ISystemClock clock,  IBlazorRepoPageService blazorRepoPageService
            )
            : base(options, logger, encoder, clock)
        {
           // _userService = userService;
            _blazorRepoPageService = blazorRepoPageService;
        }
        protected async override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            UserViewModel user;
            try
            {
                var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 3);
                var username = credentials[0];
                var password = credentials[1];
                var storeid = credentials[2];
                // user = await _userService.Authenticate(username, password, storeid);
                var usr = new UserViewModel();// await _blazorRepoPageService.GetUserVerificationData(new UserViewModel { password = password, storeid = storeid,  email = username, username= username });
                //  return AuthenticateResult.Success("Congratulation ! Connection established");
                if (usr == null) throw new Exception("User Name, password, or store info not valid!!!");
                var userClaims = new List<Claim>()
                    {
                        new Claim("username", ""+usr.UserName),
                        new Claim("loginname", ""+usr.UserName),
                        new Claim("userid", ""+usr.Id),
                        new Claim("roleid", ""+usr.RoleId),
                        new Claim("Dspid", ""+usr.Dspid),
                        new Claim(ClaimTypes.Name, ""+usr.UserName),
                        new Claim(ClaimTypes.Email, "info@blzaortech.com"),
                        new Claim(ClaimTypes.DateOfBirth,System.DateTime.Now.ToLongDateString() )

                     };

                var identity = new ClaimsIdentity(userClaims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);

                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                return AuthenticateResult.Success(ticket);
            }
            catch
            {
                return AuthenticateResult.Fail("Error Occured.Authorization failed.");
            }

            if (user == null)
                return AuthenticateResult.Fail("Invalid Credentials");
        }
    }
}
