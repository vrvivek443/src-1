import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APIURLConstant } from '../api.url.constant';
import { UserService } from '../services/user.service';
import { UserModel } from '../user/user.viewmodel';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NoticeView } from '../app.complaintmodel';
import { AppService } from '../services/app.services';
import { ComplaintService } from '../services/complaint.service';

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
    private msalBroadcastService: MsalBroadcastService,
    private appservice: AppService) {

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
    jQuery(".sidebar-wrapper").hide();
    jQuery("#nav-bar-header").hide();
    jQuery(".page-footer").hide();
    jQuery("header").hide();
    jQuery(".page-wrapper").addClass("page-wrapper-none");
    jQuery(".page-wrapper-none").removeClass("page-wrapper");
  }

  async loginPage() {
    localStorage.setItem("login", "yes");
    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length === 1) {
      this.loginDisplay = accounts.length > 0;
      const account = accounts[0];
      await this.authService.instance.setActiveAccount(account);
      console.log("User is already signed in:", account.username);
      this.profile = account;
    } else {
      const loginResponse = await this.authService.instance.loginPopup({
        scopes: ["User.Read"] 
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
    this.loginPage();
    
  }
  loggedin() {
    this.profile = this.authService.instance.getActiveAccount();
    console.log('Profile:', this.profile);
    this.tokenExpiration = localStorage.getItem('tokenExpiration')!;
    console.log('Token Expiration:', this.tokenExpiration);
    this.getUser(this.profile)

  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  getUser(profile: any) {
    localStorage.setItem('Azure-Profile', JSON.stringify(profile));
    localStorage.setItem('tokenId', JSON.stringify(profile.idToken));
    let email = profile.username;
    this._userServiceCall.get(this._apiUrlConstant.UserDataModule, this._apiUrlConstant.Get + "?userid=" + profile.username).subscribe((response: any) => {
      if (response.status == "SUCCESS") {
        this._user = response.data[0];
        // this.userStateService.setUser(this._user);
        localStorage.setItem("user", JSON.stringify(this._user));
        localStorage.setItem("username", this._user.email);
        this.appservice.updateUser(this._user);
        this.router.navigateByUrl('dashboard');
      } else {
        localStorage.setItem('User_NA', JSON.stringify(true)); // To set true
        console.log(localStorage.getItem('NA_User'));
        alert('login failed');
        this.logout();
      }
    })
  }

  logout() {
    const account = this.authService.instance.getActiveAccount();
    localStorage.setItem("NA_User", account?.username);
    this.authService.instance.logoutRedirect({
      account: account,
      postLogoutRedirectUri: window.location.origin + '/memberlogout'
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
