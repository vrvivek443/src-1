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
    // this.appservice.getMessage.subscribe(msg => this._message = msg);
    // console.log('Message:', this._message);
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
      let userString = localStorage.getItem('user');
      if (userString == null)
        this.logout();
      this._user = JSON.parse(userString);
      this._urlConstant.rolePageActions(this._user);
    } catch (error: any) {
      // Handle the error
      console.error('An error occurred:', error.message);
      console.error('Error name:', error.name);
      console.error('Stack trace:', error.stack);

      this.logout();

    }
    this.loadMessageForUser();
    this.appservice.setMessage(this._user.userProfiles);
    this.appservice.currentList.subscribe(list => {
      this._userProfile = list;
    });
    this.appservice.currentNoticeCount.subscribe(list => {
      this._newNoticeCount = list;
    });
  }
  // UpadateManageSearchProfile(id: any) {
  //   let item = this._user?.userProfiles.find(d => d.id = id);
  //   if (item != null) {
  //     jQuery('#searchProfileName').val(item.name);
  //   }
  // }
  // InitialzeUserProfiles() {
  //   let self: any = this;
  //   this._userProfileTbl = jQuery('#userProfileTbl').DataTable({
  //     columns: [{
  //       data: "name",
  //       targets: 0,
  //       render(data: any, index: any, row: any) {
  //         return '<input class="hide" id="searchproflename" data-name="' + row.id + '" value=' + data + '></input>';
  //       }
  //     },
  //     {
  //       data: "action",
  //       targets: 1,
  //       render: function (data: any, type: any, row: any) {
  //         return '<button id="editSearchProfile" href="#saveSearchModal" class="btn custom-btn btn-sm" data-name="' + row.id + '">Edit / View</button> <button id="editSearchProfile" href="#saveSearchModal" class="btn custom-btn btn-sm" data-name="' + row.id + '">Save</button>';
  //       }
  //     }]
  //   });

  // }

  // saveNewSearch() {
  //   this.SaveOrUpdateProfile();
  // }
  // SaveOrUpdateProfile() {
  //   let name = jQuery('#searchName').val();
  //   this._edituserprofile.name = name;
  //   this._caseHistoryServiceCall.saveByMethodName(this._urlConstant.UserDataModule, "userProfile", this._edituserprofile)
  //     .subscribe((response) => {
  //       if (response.status == "SUCCESS") {
  //         this._user = response.data[0];
  //         if ((this._userProfileTbl == undefined) || (this._userProfileTbl == undefined)) {
  //           this.InitialzeUserProfiles();
  //         }
  //         this._userProfileTbl.clear().rows.add(this._user?.userProfiles).draw();
  //         //this.saveLocalstore();
  //       } else {
  //         alert(response.errorMessage);
  //       }
  //     }
  //     );
  // }
  ManageSearchProfile() {
    this.router.navigateByUrl('/managesearchprofile');
    // let self: any = this;
    // if ((this._userProfileTbl == undefined) || (this._userProfileTbl == undefined)) {
    //   this.InitialzeUserProfiles();
    // }
    // this._userProfileTbl.clear().rows.add(this._user?.userProfiles).draw();

    // jQuery('#manageSearchProfile').modal('show');

    // this._userProfileTbl.on('click', 'button', function (e: any) {
    //   console.log(e.target.dataset.name);
    //   console.log(e.target.id);
    //   self._edituserprofile = self._user.userProfiles.find((v: any) => v.id == e.target.dataset.name);
    //   jQuery('#saveSearchModal').modal('show');
    //   //console.log(self._user.userProfiles.find((v: any) => v.id == e.target.dataset.name));
    // });

    // // jQuery('#editSearchProfile').on('click', 'button', function (e: any) {
    // //   console.log(e.target.dataset.name);
    // //   self.UpadateManageSearchProfile(e.target.dataset.name);
    // // });
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
    // this.router.navigateByUrl('');
  }
  setNoticeCount(newItem: string) {
    // this._user.noofnotices = newItem;
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
