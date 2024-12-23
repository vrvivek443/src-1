import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APIURLConstant } from '../api.url.constant';
import { UserService } from '../services/user.service';
import { UserModel } from '../user/user.viewmodel';

import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';

// Required for RJXS
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
declare var jQuery: any;
@Component({
  selector: 'app-memberlogin',
  templateUrl: './memberlogin.component.html',
  styleUrls: ['./memberlogin.component.css']
})
export class MemberloginComponent {
  loginDisplay = false;
  tokenExpiration: string = '';
  private readonly _destroying$ = new Subject<void>();

  profile!: any;
  constructor(private router: Router, private _http: HttpClient,
    private _apiUrlConstant: APIURLConstant,
    private _userServiceCall: UserService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService) {

  }

  _user: UserModel = null;
  ngOnInit() {

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe((response) => {
        console.log('completed')
        this.setLoginDisplay();
      });
    //this.loginPage();
    // // Used for storing and displaying token expiration
    // this.msalBroadcastService.msalSubject$.pipe(filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)).subscribe(msg => {
    //   this.tokenExpiration = (msg.payload as any).expiresOn;
    //   localStorage.setItem('tokenExpiration', this.tokenExpiration);
    // });
    jQuery(".sidebar-wrapper").hide();
    jQuery("#nav-bar-header").hide();
    jQuery(".page-footer").hide();
    jQuery("header").hide();
    jQuery(".page-wrapper").addClass("page-wrapper-none");
    jQuery(".page-wrapper-none").removeClass("page-wrapper");
  }
  async loginPage() {
    const accounts = this.authService.instance.getAllAccounts();
    // If only one account exists, automatically sign in

    if (accounts.length === 1) {
      // Automatically select the first account and sign in
      this.loginDisplay = accounts.length > 0;
      const account = accounts[0];
      await this.authService.instance.setActiveAccount(account);
      console.log("User is already signed in:", account.username);
      this.profile = account;
    } else {
      // If multiple or no users, redirect to login
      const loginResponse = await this.authService.instance.loginPopup({
        scopes: ["User.Read"] // Include the required scopes for your app
      });
      console.log("Logged in:", loginResponse.account.username);
      this.profile = loginResponse;

    }
    this.getUser(this.profile);
  }

  getUserdetails() {
    this._http.get('https://graph.microsoft.com/v1.0/me')
      .subscribe(profile => {
        this.profile = profile;
      });

    this.tokenExpiration = localStorage.getItem('tokenExpiration')!;
    console.log('Token Expiration:', this.tokenExpiration);

  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    // if (this.loginDisplay) {
    //   // Redirect to /profile-data if the user is logged in
    //   //this.router.navigate(['/profile-data']);
    //   this.router.navigate(['/dashboard']);
    // }
  }
  loggedin() {
    // this._http.get('https://graph.microsoft.com/v1.0/me')
    //   .subscribe((response: any) => {
    //     this.profile = response;
    //   });
    this.profile = this.authService.instance.getActiveAccount();
    console.log('Profile:', this.profile);
    this.tokenExpiration = localStorage.getItem('tokenExpiration')!;
    console.log('Token Expiration:', this.tokenExpiration);
    this.getUser(this.profile)

  }
  // Log the user in and redirect them if MSAL provides a redirect URI otherwise go to the default URI
  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }
  getUser(profile: any) {
    let email = profile.username;
    //  this.router.navigateByUrl('dashboard');
    this._userServiceCall.get(this._apiUrlConstant.UserDataModule, this._apiUrlConstant.Get + "?userid=" + profile.username).subscribe((response: any) => {
      if (response.status == "SUCCESS") {
        this._user = response.data[0];

        localStorage.setItem("user", JSON.stringify(this._user));
        localStorage.setItem("username", this._user.email);
        this.router.navigateByUrl('dashboard');
      } else {
        alert('login failed');
      }
    })
  }
  // Log the user out
  logout() {
    //this.authService.logout();
    const account = this.authService.instance.getActiveAccount();
    this.authService.instance.logoutRedirect({
      account: account,
      postLogoutRedirectUri: window.location.origin + '/memberlogout'
    });

    // this.authService.logoutRedirect({
    //   postLogoutRedirectUri: 'http://localhost:4200/memberlogout'
    // });
  }


  

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }



}
