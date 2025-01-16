import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MemberloginComponent } from './memberlogin/memberlogin.component';
import { DataTablesModule } from 'angular-datatables';
import { MockpageComponent } from './mockpage/mockpage.component';
import { FormsModule } from '@angular/forms';
import { CaseManagementComponent } from './case-management/case-management.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NewComplaintComponent } from './new-complaint/new-complaint.component';
import { CaseTypeComponent } from './case-type/case-type.component';
import { NoticeTemplateComponent } from './notice-template/notice-template.component';
import { ViolationsComponent } from './violations/violations.component';
import { FineComponent } from './fine/fine.component';
import { CaseHistoryComponent } from './case-history/case-history.component';
import { APIURLConstant } from './api.url.constant';
import { ComplaintService } from './services/complaint.service';
import { ComplaintComponent } from './complaint/complaint.component';
import { NotificationComponent } from './notification/notification.component';
import { UserComponent } from './user/user.component';
import { ViewAllNotificationComponent } from './view-all-notification/view-all-notification.component';
import { ViolationComponent } from './violation/violation.component';
import { ActionComponent } from './action/action.component';
import { CategoryComponent } from './category/category.component';
import { InspectormappingComponent } from './inspectormapping/inspectormapping.component';
import { AiSearchComponent } from './ai-search/ai-search.component';
import { ManageSearchProfileComponent } from './manage-search-profile/manage-search-profile.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Required for MSAL
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { MemberlogoutComponent } from './memberlogout/memberlogout.component';
import { environment } from 'src/environments/environment';


const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      // 'Application (client) ID' of app registration in the Microsoft Entra admin center - this value is a GUID
      clientId: "977aa8a1-de90-4964-8dd8-d3440a7239bb",
      // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
      authority: "https://login.microsoftonline.com/b9db0e08-c5b7-42a7-9543-0fa4e621d5c2",
      // Must be the same redirectUri as what was provided in your app registration.
      // redirectUri: "https://localhost:4200/dashboard",
      redirectUri: environment.redirectUri,
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE
    }
  });
}

// MSAL Interceptor is required to request access tokens in order to access the protected resource (Graph)
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

// MSAL Guard is required to protect routes and require authentication before accessing protected routes
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    MemberloginComponent,
    MockpageComponent,
    NewComplaintComponent,
    CaseManagementComponent,
    CaseTypeComponent,
    NoticeTemplateComponent,
    ViolationsComponent,
    FineComponent,
    CaseHistoryComponent,
    ComplaintComponent,
    NotificationComponent,
    UserComponent,
    ViewAllNotificationComponent,
    ViolationComponent,
    ActionComponent,
    CategoryComponent,
    InspectormappingComponent,
    AiSearchComponent,
    ManageSearchProfileComponent,
    ProfileDataComponent,
    MemberlogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule,
    MsalModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    APIURLConstant,
    ComplaintService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
