import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseManagementComponent } from './case-management/case-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MemberloginComponent } from './memberlogin/memberlogin.component';
import { MockpageComponent } from './mockpage/mockpage.component';
import { NewComplaintComponent } from './new-complaint/new-complaint.component';
import { ManageComplaintsComponent } from './manage-complaints/manage-complaints.component';
import { FormsModule } from '@angular/forms';
import { CaseTypeComponent } from './case-type/case-type.component';
import { NoticeTemplateComponent } from './notice-template/notice-template.component';
import { ViolationsComponent } from './violations/violations.component';
import { FineComponent } from './fine/fine.component';
import { CaseHistoryComponent } from './case-history/case-history.component';
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
import { MsalGuard } from '@azure/msal-angular';
import { ProfileDataComponent } from './profile-data/profile-data.component';
const routes: Routes = [
  {
    path: "", component: MemberloginComponent,
    canActivate: [
      MsalGuard
    ]
  },
  // { path: "", component: UserComponent, canActivate: [MsalGuard] },
  { path: "profile-data", component: ProfileDataComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "casemanagement", component: CaseManagementComponent, canActivate: [MsalGuard] },
  { path: "complaint", component: ComplaintComponent, canActivate: [MsalGuard] },
  { path: "mockpage", component: MockpageComponent, canActivate: [MsalGuard] },
  { path: "casetype", component: CaseTypeComponent, canActivate: [MsalGuard] },
  { path: "noticetemplate", component: NoticeTemplateComponent, canActivate: [MsalGuard] },
  { path: "violation", component: ViolationComponent, canActivate: [MsalGuard] },
  { path: "fine", component: FineComponent, canActivate: [MsalGuard] },
  { path: "action", component: ActionComponent, canActivate: [MsalGuard] },
  { path: "category", component: CategoryComponent, canActivate: [MsalGuard] },
  { path: 'casehistory', component: CaseHistoryComponent, canActivate: [MsalGuard] },
  { path: 'inspectormapping', component: InspectormappingComponent, canActivate: [MsalGuard] },
  { path: 'usernotifications', component: NotificationComponent, canActivate: [MsalGuard] },
  { path: 'user', component: UserComponent, canActivate: [MsalGuard] },
  { path: 'viewallnotification', component: ViewAllNotificationComponent, canActivate: [MsalGuard] },
  { path: 'aisearch', component: AiSearchComponent, canActivate: [MsalGuard] },
  { path: 'managesearchprofile', component: ManageSearchProfileComponent, canActivate: [MsalGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule],
  declarations: [
    ManageComplaintsComponent
  ]
})
export class AppRoutingModule { }
