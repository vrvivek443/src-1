import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { APIURLConstant } from '../api.url.constant';
import { ComplaintService } from '../services/complaint.service';
import { AppService } from '../services/app.services';
import { CaseHistoryService } from '../services/casehistory.service';
import { map, Observable } from 'rxjs';
import { CaseHistoryViewModel } from '../case-history/case-history.viewmodel';
declare var jQuery: any;
declare var Lobibox: any;
@Component({
  selector: 'app-component',
  templateUrl: './manage-search-profile.component.html',
  styleUrls: ['./manage-search-profile.component.css']
})
export class ManageSearchProfileComponent {
  _userProfileTbl: any;
  _showdataColumn: any;
  _userProfiles: any;
  _userProfile: any;
  _user: any;
  _editSearchProfile: any;
  filterDataArray: any;
  public _masterDataList: any[] = [];
  public _streetDataList: any[] = [];
  public _programTypeList: any[] = [];
  public _statusList: any[] = [];
  public _inspectorList: any[] = [];
  public _supervisorList: any[] = [];
  public _sourceList: any[] = [];
  public _priorityType: any[] = [];
  public _cdbgType: any[] = [];
  public _violationType: any[] = [];
  public _caseHistoryViewModel: CaseHistoryViewModel;
  constructor(private router: Router,
    private _http: HttpClient,
    private _fb: FormBuilder,
    private _urlConstant: APIURLConstant,
    private _complaintServiceCall: ComplaintService,
    private appservice: AppService,
    private _caseHistoryServiceCall: CaseHistoryService,) {
  }
  ngOnInit() {
    try {
      // let userString = localStorage.getItem('user');
      // this._user = JSON.parse(userString);
      this.appservice.currentList.subscribe(list => {
        this._userProfiles = list;
      });
      console.log('User profile:', this._userProfiles);
    } catch (error: any) {
      // Handle the error
      console.error('An error occurred:', error.message);
      console.error('Error name:', error.name);
      console.error('Stack trace:', error.stack);
    }
  }
  ngAfterViewInit() {
    if (this._userProfileTbl === undefined) {
      this.loadMasterData();
      this.InitialzeUserProfiles();
    }
    this._userProfileTbl.clear().rows.add(this._userProfiles).draw();
  }
  InitialzeUserProfiles() {
    let self: any = this;
    this._userProfileTbl = jQuery('#userProfileTbl').DataTable({
      columns: [{
        data: "id",
        targets: 0
      }, {
        data: "name",
        targets: 1
      },
      {
        data: "action",
        targets: 2,
        render: function (data: any, type: any, row: any) {
          return '<button id="showeventdata" class="btn custom-btn btn-sm" data-name="' + row.id + '">Show Data</button> &nbsp; &nbsp;<button id="editSearchProfile"  class="btn custom-btn btn-sm" data-name="' + row.id + '">Edit / View</button> &nbsp &nbsp <button id="deleteSearchProfile" class="btn custom-btn btn-sm" data-name="' + row.id + '">Delete</button>';
        }
      }],
      columnDefs: [{ width: '10%', targets: [0, 2] }]
    });
    this._userProfileTbl.on('click', 'button', function (e: any) {
      console.log(e.target.dataset.name);
      console.log(e.target.id);

      if (e.target.id == "editSearchProfile") {
        console.log(e.target.dataset.name)
        self._editSearchProfile = self._userProfiles.find((v: any) => v.id == e.target.dataset.name);
        jQuery('#searchName').val(self._editSearchProfile.name).trigger('change');
        jQuery('#saveSearchModal').modal('show');
      } else if (e.target.id == "deleteSearchProfile") {
        self.deleteSearchProfile(e.target.dataset.name);
      }
      else if (e.target.id == "showeventdata") {
        jQuery('#dataDisplay').empty();  // Clear any existing content
        console.log(e.target.dataset.name);

        self._userProfile = self._userProfiles.find((v: any) => v.id == e.target.dataset.name);
        console.log(self._userProfile.profileData);
        const data1 = JSON.parse(self._userProfile.profileData);
        // const data1 = {"SearchType":"A","SimpleSearchData":{},"AdvancedSearchData":{"caseId":[''],"status":[''],"programType":[''],"inspectorId":[''],"priorityType":["E","R"],"cuDate":'',"violationType":[''],"description":"today","apn":["121"],"houseNumber":["123"],"street":[{"id":1,"streetTypeCode":"BL","status":true,"streetname":"GRAND","streettype":"BOULEVARD"},{"id":3,"streetTypeCode":"ST","status":true,"streetname":"WABASH","streettype":"STREET"}],"housingPermits":'',"sources":["P","E"],"createDate":'',"supervisorId":''}}
        
        console.log(data1);

        const data: Record<string, any> = data1.SearchType === 'A' ? data1.AdvancedSearchData : data1.SimpleSearchData;

        let displayContent = '';

        if (typeof data === 'object') {
          let count = 0;  // Count items to control row creation
          displayContent += '<table style="width: 100%";><tbody>';  // Initialize table structure

          for (const key in data) {
            if (data[key].length > 0) {
              let cellContent = '';

              switch (key) {
                case 'inspectorId':
                  const inspectorNames = data[key]
                    .map((id: string) => {
                      const inspector = self._inspectorList.find((item: any) => item.id === parseInt(id));
                      return inspector ? inspector.name : null;
                    })
                  cellContent = `<strong>Inspector(s)</strong>: ${inspectorNames.join(', ')}`;
                  break;
                case 'supervisorId':
                  const supervisorNames = data[key]
                    .map((id: string) => {

                      const supervisor = self._supervisorList.find((item: any) => item.id === parseInt(id));
                      return supervisor ? supervisor.name : null;
                    })
                  cellContent = `<strong>Supervisor(s)</strong>: ${supervisorNames.join(', ')}`;
                  break;
                case 'status':

                  const statusValues = data[key]
                    .map((id: string) => {
                      const status = self._statusList.find((code: any) => code.code === id);
                      return status ? status.value : null;
                    })

                  cellContent = `<strong>Status</strong>: ${statusValues.join(', ')}`;
                  break;

                case 'programType':

                  const programTypes = data[key]
                    .map((code: string) => {
                      const program = self._programTypeList.find((item: any) => item.code === code);
                      return program ? program.value : null;
                    })


                  cellContent = `<strong>Program Type</strong>: ${programTypes.join(', ')}`;  // Join program types with commas
                  break;

                case 'street':
                  console.log(data[key])
                  const streetNames = data[key]
                    .map((streetCode: any) => {
                      return streetCode ? `${streetCode.streetname} ${streetCode.streettype}` : null;  
                    })
                  cellContent = `<strong>Street</strong>: ${streetNames.join(', ')}`;
                  break;

                case 'priorityType':

                  const priorityTypes = data[key]
                    .map((typeCode: string) => {
                      console.log(typeCode)
                      const priority = self._priorityType.find((type: any) => type.code === typeCode);
                      return priority ? priority.value : null;
                    })


                  cellContent = `<strong>Priority Type</strong>: ${priorityTypes.join(', ')}`;
                  break;

                case 'violationType':

                  const violationDescriptions = data[key]
                    .map((violationCode: string) => {
                      const violationType = self._violationType.find((type: any) => type.violationType === violationCode);
                      return violationType ? violationType.violationdescr : null;
                    })

                  cellContent = `<strong>Violation Type</strong>: ${violationDescriptions.join(', ')}`;
                  break;

                case 'sources':

                  const sourceValues = data[key]
                    .map((ecode: string) => {
                      const source = self._sourceList.find((data: any) => data.code === ecode);
                      return source ? source.value : null;
                    })

                  cellContent = `<strong>Source</strong>: ${sourceValues.join(', ')}`;
                  break;

                default:
                  cellContent = `<strong>${key}</strong>: ${data[key]}`;
              }

              if (count % 2 === 0) {
                displayContent += '<tr>';
              }
              displayContent += `<td style="padding: 10px 20px;">${cellContent}</td>`;
              count++;

              if (count % 2 === 0) {
                displayContent += '</tr>';
              }
            }
          }

          if (count % 2 !== 0) {
            displayContent += '<td></td></tr>';
          }

          displayContent += '</tbody></table>';
        }

        jQuery('#dataDisplay').html(displayContent);
        jQuery('#filterdata').html(`Save Search - ${self._userProfile.name}`);
        jQuery('#showDataModal').modal('show');
      }


    });
  }

  loadMasterData() {
    this._masterDataList = [];
    this._programTypeList = [];
    this._inspectorList = [];
    this._sourceList = [];
    this._cdbgType = [];
    this._priorityType = [];
    var observable1$ = this._caseHistoryServiceCall.getAll(this._urlConstant.CategoryModule)
      .subscribe({
        next: (response) => {
          this._masterDataList = response.data;

          this._masterDataList.forEach((e) => {
            if (e.status == true) {
              switch (e.category) {
                case this._urlConstant.ProgramType:
                  this._programTypeList.push(e);
                  break;
                case this._urlConstant.StatusType:
                  this._statusList.push(e);
                  break;
                case this._urlConstant.SourceType:
                  this._sourceList.push(e);
                  break;
                case this._urlConstant.PriorityType:
                  this._priorityType.push(e);
                  break;
                case this._urlConstant.CBDGType:
                  this._cdbgType.push(e);
                  break;
              }
            }
          });

        },
        complete: () => { console.log('On Subscribe Master Data:', this._masterDataList); }
      });
    console.log('Case Master View Model1:', this._caseHistoryViewModel);
    var observable2$ = this._caseHistoryServiceCall.getAll(this._urlConstant.StreetMasterTypeModule)
      .subscribe((response) => {
        this._streetDataList = response.data;
      });
    this._caseHistoryServiceCall.getByModuleAndMethod(this._urlConstant.InspectorModule, this._urlConstant.GetAllInspector)
      .subscribe((response) => {
        this._inspectorList = response.data;
        // console.log('Inspector Data:', this._inspectorList);
      });
    this._caseHistoryServiceCall.getByModuleAndMethod(this._urlConstant.InspectorModule, this._urlConstant.GetAllSupervisor)
      .subscribe((response) => {
        this._supervisorList = response.data;
        // console.log('Inspector Data:', this._inspectorList);
      });
    this._caseHistoryServiceCall.getByModuleAndMethod(this._urlConstant.ViolationTypeModule, this._urlConstant.GetAll)
      .subscribe((response) => {
        let res = response.data.filter((d: any) => d.status == true);
        this._violationType = res;
        // console.log('Violation Type Data:', this._violationType);
      });
    console.log('Priority Type:', this._priorityType);

    Promise.all([observable1$, observable2$]).then((response: any) => {
      console.log('Promise all Response:', response);
      console.log('Promise Master Data:', this._masterDataList);
    });
  }



  deleteSearchProfile(id: string) {
    let url = this._urlConstant.UserDataModule + this._urlConstant.DeleteUserProfile;
    this._caseHistoryServiceCall.removeWithID(url, parseInt(id))
      .subscribe((response) => {
        if (response.status == "SUCCESS") {
          this._user = response.data[0];
          this.saveLocalstore();
          this.appservice.setMessage(this._user.userProfiles);
          this.appservice.currentList.subscribe(list => {
            this._userProfiles = list;
          });
          if ((this._userProfileTbl == undefined) || (this._userProfileTbl == undefined)) {
            this.InitialzeUserProfiles();
          }
          this._userProfileTbl.clear().rows.add(this._userProfiles).draw();
          Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Search profile deleted successfully'
          });
        } else {
          alert(response.errorMessage);
        }
      }
      );
  }

  saveNewSearch(profileName: string) {
    this._editSearchProfile.name = profileName;
    console.log('Edited Profile:', this._editSearchProfile);
    this._caseHistoryServiceCall.saveByMethodName(this._urlConstant.UserDataModule, "userProfile", this._editSearchProfile)
      .subscribe((response) => {
        if (response.status == "SUCCESS") {
          this._user = response.data[0];
          this.saveLocalstore();
          this.appservice.setMessage(this._user.userProfiles);
          this.appservice.currentList.subscribe(list => {
            this._userProfiles = list;
          });
          if ((this._userProfileTbl == undefined) || (this._userProfileTbl == undefined)) {
            this.InitialzeUserProfiles();
          }
          this._userProfileTbl.clear().rows.add(this._userProfiles).draw();
          Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Search profile updated.'
          });
          //this.saveLocalstore();
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: response.errorMessage
          });
        }
      }
      );
    this.SaveOrUpdateProfile();
  }
  saveLocalstore(): void {
    localStorage.setItem("user", JSON.stringify(this._user));
    this._caseHistoryServiceCall.saveByMethodName(this._urlConstant.UserDataModule, "userProfile", this._editSearchProfile)
      .subscribe((response) => {
        if (response.status == "SUCCESS") {
          this._user = response.data[0];
          //this.saveLocalstore();
          this.appservice.setMessage(this._user.userProfiles);
          this.appservice.currentList.subscribe(list => {
            this._userProfiles = list;
          });
          if ((this._userProfileTbl == undefined) || (this._userProfileTbl == undefined)) {
            this.InitialzeUserProfiles();
          }
          this._userProfileTbl.clear().rows.add(this._userProfiles).draw();
          //this.saveLocalstore();
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: response.errorMessage
          });
        }
      }
      );
  }
  SaveOrUpdateProfile() {
    this._caseHistoryServiceCall.saveByMethodName(this._urlConstant.UserDataModule, "userProfile", this._editSearchProfile)
      .subscribe((response) => {
        if (response.status == "SUCCESS") {
          this._user = response.data[0];
          this.saveLocalstore();
          this.appservice.setMessage(this._user.userProfiles);
          this.appservice.currentList.subscribe(list => {
            this._userProfiles = list;
          });
          if ((this._userProfileTbl == undefined) || (this._userProfileTbl == undefined)) {
            this.InitialzeUserProfiles();
          }
          this._userProfileTbl.clear().rows.add(this._userProfiles).draw();
          //this.saveLocalstore();
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: response.errorMessage
          });
        }
      }
      );
  }
  updateFilterDataArray(key: any, value: any) {
    this.filterDataArray.push({ key: key, value: value });
  }
}
