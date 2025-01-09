import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockupViewModel } from './mockpage/mockup.viewmodel';
import { APIURLConstant } from './api.url.constant';
import { ComplaintService } from './services/complaint.service';
import { ViolationViewModel } from './violations/violation.viewmodel';
import { NoticeView } from './app.complaintmodel'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvents, UserModel } from './user/user.viewmodel';
import { Router } from '@angular/router';
import { AppService } from './services/app.services';
import { CaseHistoryService } from './services/casehistory.service';
import { MsalService } from '@azure/msal-angular';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BaseApp';
  public _noofNotices: any = 0;
  _notices: NoticeView[] = [];
  _count: any;
  _newNoticeCount: any;
  _user: UserModel = null;
  _message: string = "";
  _searchId: any = -1;
  _userProfileTbl: any;
  _edituserprofile: any;
  _userProfile: any;

  constructor(private router: Router,
    private _http: HttpClient,
    private _fb: FormBuilder,
    private _urlConstant: APIURLConstant,
    private _complaintServiceCall: ComplaintService,
    private appservice: AppService,
    private authService: MsalService,
    private _caseHistoryServiceCall: CaseHistoryService,) {

  }


  SetNoOfNotices() {
    this._noofNotices = this._notices.length + '';
    this._count = this._notices.filter(x => x.isRead == false).length;
    this.appservice.setNoticeCount(this._count);
    this.appservice.currentNoticeCount.subscribe(list => {
      this._newNoticeCount = list;
    });
  }
  
  ngOnInit() {
    try {
      jQuery("#searchProfiles").select2({}).on('change', () => {
        this.loadSearch();
      });
  
      // Subscribe to the service to check if user data is available
      this.appservice.user$.subscribe((userData: any) => {
        if (userData) {
          try {
            console.log("User data available from app service:", userData);
            this._user = userData; // Use data from the service
        
            // Check if _user is null and log out if necessary
            if (this._user == null) {
              console.warn("User data is null. Logging out.");
              this.logout();
              return; // Exit further execution after logout
            }
        
            // Additional logic if _user is not null
            if (this._user) {
              console.log("User data is valid, proceeding with rolePageActions.");
              this._urlConstant.rolePageActions(this._user);
              this.appservice.setMessage(this._user.userProfiles);
            }
          } catch (error: any) {
            console.error("An error occurred while processing user data:", error.message);
            console.error("Error stack trace:", error.stack);
        
            // Handle error gracefully
            this.logout();
          }
        }
         else {
          console.log("No data from app service; checking local storage.");
          const userString = localStorage.getItem('user');
          if (!userString) {
            console.warn("No user data in local storage. Logging out.");
            this.logout();
          } else {
            console.log("User data found in local storage:", userString);
            this._user = JSON.parse(userString);
          }
        }
  
        // Call rolePageActions if _user is populated
        if (this._user) {
          this._urlConstant.rolePageActions(this._user);
          this.appservice.setMessage(this._user.userProfiles);
        }
      });
      
    } catch (error: any) {
      console.error("An error occurred during initialization:", error.message);
      console.error("Error name:", error.name);
      console.error("Stack trace:", error.stack);
  
      this.logout();
    }
    this.notifyProfile();
  }
  

  notifyProfile()
  {
    this.loadMessageForUser();
    this.appservice.currentList.subscribe(list => {
      this._userProfile = list;
    });
    this.appservice.currentNoticeCount.subscribe(list => {
      this._newNoticeCount = list;
    });
  }

  ManageSearchProfile() {
    this.router.navigateByUrl('/managesearchprofile');
  }

  loadSearch() {
    this._searchId = jQuery("#searchProfiles").val()
    this.router.navigate(['/casehistory'], {
      queryParams: { searchid: this._searchId }
    });
  }

  logout() {
    localStorage.clear();
    const account = this.authService.instance.getActiveAccount();
    this.authService.instance.logoutRedirect({
      account: account,
      postLogoutRedirectUri: window.location.origin + '/memberlogout'
    });
  }

  setNoticeCount(newItem: string) {
    console.log('Event Emitter called');
  }

  getTimespan(d: any) {
    if (d == null || d == undefined)
      return "";
    return "2 sec";
  }
  loadMessageForUser() {
    this._complaintServiceCall.get(this._urlConstant.UserDataModule, this._urlConstant.GetNotices).subscribe((response) => {
      this._notices = [];
      if (response.status == "SUCCESS") {
        this._notices = response.notices;
        let falseRecords = this._notices.filter(x => x.isRead == false).length;
        console.log('False Records:', falseRecords);
        // this.appservice.setMessage(falseRecords.toString());
        this.SetNoOfNotices();
      } else {
        console.log("Unable to receive notices : " + response.errorMessage)
      }
    });
  }

}
