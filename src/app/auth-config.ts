import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const b2cPolicies = {
    names: {
        signUpSignIn: "b2c_1_susi_reset_v2",
        editProfile: "b2c_1_edit_profile_v2"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://b9db0e08-c5b7-42a7-9543-0fa4e621d5c2.b2clogin.com/b9db0e08-c5b7-42a7-9543-0fa4e621d5c2.onmicrosoft.com/b2c_1_susi_reset_v2",
        },
        editProfile: {
            authority: "https://b9db0e08-c5b7-42a7-9543-0fa4e621d5c2.b2clogin.com/b9db0e08-c5b7-42a7-9543-0fa4e621d5c2.onmicrosoft.com/b2c_1_edit_profile_v2"
        }
    },
    authorityDomain: "b9db0e08-c5b7-42a7-9543-0fa4e621d5c2.b2clogin.com"
};


export const msalConfig: Configuration = {
    auth: {
        clientId: '977aa8a1-de90-4964-8dd8-d3440a7239bb',
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: '/',
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE,
    },
    system: {
        loggerOptions: {
            loggerCallback: (logLevel, message, containsPii) => {
                console.log(message);
            },
            logLevel: LogLevel.Verbose,
            piiLoggingEnabled: false
        }
    }
}

// export const protectedResources = {
//   todoListApi: {
//     endpoint: "http://localhost:5000/api/todolist",
//     scopes: ["https://b9db0e08-c5b7-42a7-9543-0fa4e621d5c2.onmicrosoft.com/api/tasks.read"],
//   },
// }
export const loginRequest: { scopes: string[] } = {
    scopes: []
};
