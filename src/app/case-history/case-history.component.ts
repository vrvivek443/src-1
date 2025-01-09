import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CaseHistoryViewModel, SimpleSearchExViewModel, CaseSearchResult, AdvancedSearchViewModel } from './case-history.viewmodel';
import { CaseHistoryService } from '../services/casehistory.service';
import { APIURLConstant } from '../api.url.constant';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SearchProfileData, UserModel, UserProfile } from '../user/user.viewmodel';
import { AppService } from '../services/app.services';
import { event } from 'jquery';
declare var jQuery: any;
declare var Lobibox: any;
@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
  styleUrls: ['./case-history.component.css']
})
export class CaseHistoryComponent implements AfterViewInit {
  public caseHistoryDataList: any;
  _selectedInspectorItems: any[] = [];
  _selectedProgramsItems: any[] = [];
  _selectedStatusItems: any[] = [];
  _selectedStreetItems: any[] = [];
  _selectedSourceItems: any[] = [];
  _selectedViolationTypes: any[] = [];
  _selectedCDBG: any[] = [];
  public _searchProfileData: SearchProfileData = new SearchProfileData();
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
  //public _simpleSearchViewModel: SimpleSearchViewModel;
  public _simpleSearchExViewModel: SimpleSearchExViewModel;
  public _advancedSearchViewModel: AdvancedSearchViewModel;
  public _advanced: {};
  public _caseSearchResults: Array<CaseSearchResult> = [];
  public _caseSearchResult: any = null;
  public casetbl: any;
  public _tblCols: any[] = [];
  public ids: any;
  isCustom: boolean = false;
  public starIds: any[] = [];
  public unStarIds: any[] = [];
  public assignInspectorId: string;
  public filterDataArray: any[] = [];
  public isSimpleSearch = true;
  public lowerParams: any = {};
  public queryStringValue: boolean = false;
  public _user: UserModel = null;
  public _searchProfile: UserProfile = new UserProfile();
  Date = new Date();
  constructor(
    private _http: HttpClient,
    private _apiUrlConstant: APIURLConstant,
    private _caseHistoryServiceCall: CaseHistoryService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private appSerivce: AppService) {
  }
  ngOnInit() {
    try {

      let userString = localStorage.getItem('user');
      if (userString == null)
        this.logout();
      this._user = JSON.parse(userString);

    } catch (error: any) {
      console.error('An error occurred:', error.message);
      console.error('Error name:', error.name);
      console.error('Stack trace:', error.stack);

      this.logout();
    }
    //console.log('ngOnInit');
    this.isSimpleSearch = true;
    this.resetMockViewModel();
    this.loadMasterData();

    // console.log('Set Search Query Parameter');
    // this.SetStatus(this._caseHistoryViewModel.status);
    this.assignInspectorId = "";
    if (this.isSimpleSearch) {
      this.simpleSearch()
    } else {
      this.advancedSearch();
    }

    jQuery(".custom-template").hide();
    jQuery('.custom-template_a').hide();

    this._tblCols.push("Case No");
    this._tblCols.push("Address");
    jQuery(document).ready(function () {
      var selectedRows: any[] = [];
      $('#caseHistoryTbl tbody').on('click', 'tr', function () {
        var table = $('#caseHistoryTbl').DataTable();
        $(this).toggleClass('selected');
        var pos = table.row(this).index();
        var row = table.row(pos).data();
        selectedRows.push(row);
        console.log(row);
      });
    });


    jQuery('#selectrecent_s').on('change', function (event: any) {
      console.log(event.target.value);
      const currentDate = new Date();
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const daterangepickerElement = jQuery('#daterange').data('daterangepicker');
      if (event.target.value === "custom") {
        jQuery('#daterange').val(null).trigger('change')
        jQuery('.dropdown_s').hide();
        jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
        jQuery(".custom-template").show();
      }
      else if (event.target.value === 'Week') {
        
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); 
        const lastDayOfWeek = new Date(currentDate.setDate(firstDayOfWeek.getDate() + 6)); 
    
        
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); 
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
    
        const formattedStartDate = formatDate(firstDayOfWeek);
        const formattedEndDate = formatDate(lastDayOfWeek);
    
        
        daterangepickerElement.setStartDate(formattedStartDate);
        daterangepickerElement.setEndDate(formattedEndDate);
    
        
        jQuery('.dropdown_s').hide();
        jQuery('#daterange').val(`${formattedStartDate} to ${formattedEndDate}`).trigger('change');
        jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
        jQuery(".custom-template").show();
      } 
      else if (event.target.value === 'Month') {
        
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month
    
        const formattedStartDate = formatDate(firstDayOfMonth);
        const formattedEndDate = formatDate(lastDayOfMonth);
    
        daterangepickerElement.setStartDate(formattedStartDate);
        daterangepickerElement.setEndDate(formattedEndDate);
        jQuery('.dropdown_s').hide();
        jQuery('#daterange').val(`${formattedStartDate} to ${formattedEndDate}`).trigger('change');
        jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
        jQuery(".custom-template").show();
      } 
      else if (event.target.value === 'Year') {
       
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1); 
        const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31); 
    
        const formattedStartDate = formatDate(firstDayOfYear);
        const formattedEndDate = formatDate(lastDayOfYear);

        daterangepickerElement.setStartDate(formattedStartDate);
        daterangepickerElement.setEndDate(formattedEndDate);
        jQuery('.dropdown_s').hide();
        jQuery('#daterange').val(`${formattedStartDate} to ${formattedEndDate}`);
        jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
        jQuery(".custom-template").show();
      } 
      else {
        jQuery('.custom-template').hide();

      }
    })

    jQuery('#daterange').daterangepicker({
      autoUpdateInput: false, // Keep empty until user selects a range
      locale: {
        format: 'YYYY-MM-DD',
        cancelLabel: 'Clear',
      },
      opens: 'center'
    });

    // Update input when range is selected
    jQuery('#daterange').on('apply.daterangepicker', (ev: any, picker: { startDate: { format: (arg0: string) => string; }; endDate: { format: (arg0: string) => string; }; }) => {
      jQuery('#daterange').val(picker.startDate.format('YYYY-MM-DD') + ' to ' + picker.endDate.format('YYYY-MM-DD'));
    });

    // Clear input when canceled
    jQuery('#daterange').on('cancel.daterangepicker', () => {
      jQuery(this).val('');
    });
    this.AdvancesearchDate();
  }

  
AdvancesearchDate() {

  jQuery('#selectrecent').on('change', function (event: any) {
    console.log(event.target.value);
    const currentDate = new Date();
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const daterangepickerElement = jQuery('#daterange_a').data('daterangepicker');
    if (event.target.value === "custom") {
      jQuery('#daterange_a').val(null).trigger('change')
      jQuery('.dropdown_a').hide();
      jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
      jQuery(".custom-template_a").show();
    }
    else if (event.target.value === 'Week') {
      
      const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); 
      const lastDayOfWeek = new Date(currentDate.setDate(firstDayOfWeek.getDate() + 6)); 
  
      
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
  
      const formattedStartDate = formatDate(firstDayOfWeek);
      const formattedEndDate = formatDate(lastDayOfWeek);
  
      
      daterangepickerElement.setStartDate(formattedStartDate);
      daterangepickerElement.setEndDate(formattedEndDate);
  
      
      jQuery('.dropdown_a').hide();
      jQuery('#daterange_a').val(`${formattedStartDate} to ${formattedEndDate}`).trigger('change');
      jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
      jQuery(".custom-template_a").show();
    } 
    else if (event.target.value === 'Month') {
      
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month
  
      const formattedStartDate = formatDate(firstDayOfMonth);
      const formattedEndDate = formatDate(lastDayOfMonth);
  
      daterangepickerElement.setStartDate(formattedStartDate);
      daterangepickerElement.setEndDate(formattedEndDate);
      jQuery('.dropdown_a').hide();
      jQuery('#daterange_a').val(`${formattedStartDate} to ${formattedEndDate}`).trigger('change');
      jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
      jQuery(".custom-template_a").show();
    } 
    else if (event.target.value === 'Year') {
     
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1); 
      const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31); 
  
      const formattedStartDate = formatDate(firstDayOfYear);
      const formattedEndDate = formatDate(lastDayOfYear);

  
      daterangepickerElement.setStartDate(formattedStartDate);
      daterangepickerElement.setEndDate(formattedEndDate);
      jQuery('.dropdown_a').hide();
      jQuery('#daterange_a').val(`${formattedStartDate} to ${formattedEndDate}`);
      jQuery('.daterangepicker.ltr.show-calendar.openscenter').removeClass('hidden-date-picker');
      jQuery(".custom-template_a").show();
    } 
    else {
      jQuery('.custom-template').hide();

    }
  })

  jQuery('#daterange_a').daterangepicker({
    autoUpdateInput: false, 
    locale: {
      format: 'YYYY-MM-DD',
      cancelLabel: 'Clear',
    },
    opens: 'center'
  });

  
  jQuery('#daterange_a').on('apply.daterangepicker', (ev: any, picker: { startDate: { format: (arg0: string) => string; }; endDate: { format: (arg0: string) => string; }; }) => {
    jQuery('#daterange_a').val(picker.startDate.format('YYYY-MM-DD') + ' to ' + picker.endDate.format('YYYY-MM-DD'));
  });

  
  jQuery('#daterange_a').on('cancel.daterangepicker', () => {
    jQuery('#daterange_a').val('');
  });
}//end of Advance search Data

  changeAdvanceSelection()
  {
    jQuery('.custom-template_a').hide();
    jQuery('#selectrecent').val(null).trigger('change');
    jQuery('.daterangepicker.ltr.show-calendar.openscenter').addClass('hidden-date-picker');
    jQuery('.dropdown_a').show();
  }

  changeSelection() {
    jQuery('.custom-template').hide();
    jQuery('#selectrecent_s').val(null).trigger('change');
    jQuery('.daterangepicker.ltr.show-calendar.openscenter').addClass('hidden-date-picker');
    jQuery('.dropdown_s').show();
  }


  logout() {
    localStorage.clear();
    this.router.navigateByUrl('');
  }
  getData(this: any, code: any, value: any) {
    let program: any = this._programTypeList.find((v: any) => v == value).value;
  }
  SetStar(star: boolean = false) {
    this.ids = jQuery.map(this.casetbl.rows('.selected').data(), function (item: any) {
      return item.id;
    });
    if (star) {
      var jsonString = JSON.stringify(this.ids);
      this._caseHistoryServiceCall.caseSearch('casemaster', '/starCase', jsonString.toString()).subscribe((response) => {
        console.log('Star Case\'s:', response);
        if (response.status == 'SUCCESS') {
          console.log('Case records Starred Successfully:', JSON.stringify(this._caseHistoryViewModel));
          this.fetchSearchResult();
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Bookmark case:' + response.errorMessage
          });
          //alert(response.errorMessage);
        }
      });
    } else {
      var jsonString = JSON.stringify(this.ids);
      this._caseHistoryServiceCall.caseSearch('casemaster', '/unstarCase', jsonString.toString()).subscribe((response) => {
        console.log('Un Star Case\'s:', response);
        if (response.status == 'SUCCESS') {
          console.log('Case records Un Starred Successfully:', JSON.stringify(this._caseHistoryViewModel));
          this.fetchSearchResult();
        } else {
          alert(response.errorMessage);
        }
      });
    }


  }

  searchParamsSetting(params: any): any {
    this.resetAdvancedSearchViewModel();
    this.advancedSearch();
    // var dataFound = false;
    let caseid = params['caseid']
    if (caseid !== undefined) {
      this._caseHistoryViewModel.caseno = caseid;
      this.queryStringValue = true;
      this.updateFilterDataArray("Case No", this._caseHistoryViewModel.caseno);
    }

    let inspector = params['inspector'];
    if (inspector !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.inspector = inspector;
    }

    let status = params['status'];
    if (status !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.status = status;
      this.setData(this._caseHistoryViewModel.status, 'selectStatus');
      this._caseHistoryViewModel.status = status;
    }

    let programCode = params['program'];
    if (programCode !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.program = programCode;
      this.setData(this._caseHistoryViewModel.program, 'selectProgram');
    }

    let source = params['source'];
    if (source !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.source = source;
      this.setData(this._caseHistoryViewModel.source, 'selectSource');
    }
    let casepriority = params['casepriority'];
    if (casepriority !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.casepriority = casepriority;
      this.setData(this._caseHistoryViewModel.casepriority, 'selectCasePriority');
    }

    let violationtype = params['violationtype'];
    if (violationtype !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.violationtype = violationtype;
      this.setData(this._caseHistoryViewModel.violationtype, 'selectViolationtype');
    }

    let casedescription = params['casedescription'];
    if (casedescription !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.casedescription = casedescription;
    }

    let apn = params['apn'];
    if (apn !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.apn = apn;
    }

    let number = params['number'];
    if (number !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.addressnumber = number;
    }

    let street = params['street'];
    if (street !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.street = street;
      this.setData(this._caseHistoryViewModel.street, 'selectStreet');
    }

    let housingpermit = params['housingpermit'];
    if (housingpermit !== undefined) {
      this.queryStringValue = true;
      this._caseHistoryViewModel.housingpermit = housingpermit;
    }
    if (this.queryStringValue === true) {
      this.isSimpleSearch = false;
      this.search();
    }
    //console.log('Search Param settings:', this._caseHistoryViewModel);
  }

  ngAfterViewInit() {
    let self = this;

    jQuery('#selectInspector_s').select2({}).on('select2:open', () => {
      jQuery('#selectInspector_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectInspector_s').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectSupervisor_s').select2({}).on('select2:open', () => {
      jQuery('#selectSupervisor_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectSupervisor_s').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectSupervisor').select2({}).on('select2:open', () => {
      jQuery('#selectSupervisor').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectSupervisor').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectInspector_p').select2({ dropdownParent: $("#selectInspector") }).on('change', function (e: any) {
      self.assignInspectorId = e.currentTarget.value;
      console.log('OnChange:', self.assignInspectorId);
    }).on('select2:open', () => {
      jQuery('#selectInspector_p').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectInspector_p').next('.select2-container').removeClass('focused');
    });

    jQuery('.select2-selection__rendered').css('color', 'green');
    jQuery('.select2-selection__rendered').css('font-weight', 400);
    jQuery('.select2-selection__rendered').css('font-size', '1rem');
    jQuery('.select2-selection__choice').css('background-color', '#fffcfc');
    jQuery(document).ready(function () {
      $('#caseHistoryTbl thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#caseHistoryTbl thead');
      self.initializeDatatable();
    });
    setTimeout(() => {
      this._activatedRoute.queryParamMap.subscribe((q: any) => {
        if (Object.keys(q.params).length > 0) {
          this.lowerParams = this.toLower(q.params);
          if (this.lowerParams["searchid"] != undefined) {
            this.loadSearchProfile(this.lowerParams["searchid"]);
          } else {
            this.searchParamsSetting(this.lowerParams);
          }
        }
      });
    }, 2000);

    //this.SetStatus(this._caseHistoryViewModel.status);
  }
  saveLocalstore(): void {
    localStorage.setItem("user", JSON.stringify(this._user));
  }
  saveNewSearch() {
    this.SaveOrUpdateProfile();
  }
  saveSearch(): void {
    var d = this.getSearchData();
    this._searchProfile.profileData = d;
    if ((jQuery('#searchProfiles').val() == -1) || jQuery('#searchProfiles').val() == null) {
      this._searchProfile.id = -1;
      this._searchProfile.status = true;
      this._searchProfile.profileType = 'search';
      this._searchProfile.name = '';
      this.casetbl.clear();
      //this.close();
      if (JSON.parse(d).SearchType == 'S') {
        this.isSimpleSearch = true;
        this.simpleSearch();
      } else if (JSON.parse(d).SearchType == 'A') {
        this.isSimpleSearch = false;
        this.advancedSearch();
      }

      jQuery('#saveSearchModal').modal('show');
    } else {
      this._searchProfile.id = jQuery('#searchProfiles').val();
      this._searchProfile.status = true;
      this._searchProfile.profileType = 'search';
      this.SaveOrUpdateProfile();
    }

  }
  SaveOrUpdateProfile() {
    this._caseHistoryServiceCall.saveByMethodName(this._apiUrlConstant.UserDataModule, "userProfile", this._searchProfile)
      .subscribe((response) => {
        if (response.status == "SUCCESS") {
          this._user = response.data[0];
          this.saveLocalstore();
          this.appSerivce.setMessage(this._user.userProfiles);
          // this.appSerivce.currentList.subscribe(list => {
          //   this._searchProfileData = list;
          // });
          Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Search profile updated.'
          });
        } else {
          //alert(response.errorMessage);
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Save Or Update Profile:' + response.errorMessage
          });
        }
      }
      );
  }
  getSearchData(): string {
    var d = {
      "SearchType": this.isSimpleSearch ? "S" : "A",
      "SimpleSearchData": {},
      "AdvancedSearchData": {}
    };
    if (this.isSimpleSearch) {
      this.assignSimpleSearchModel();
      d.SimpleSearchData = this._simpleSearchExViewModel;
    } else if (this.isSimpleSearch == false) {
      this.assignAdvancedSearchModel();
      d.AdvancedSearchData = this._advancedSearchViewModel;
    }

    return JSON.stringify(d);
  }
  loadSearchProfile(id: any): void {
    if (id == -1) {
      if (this.casetbl === undefined) {
        this.initializeDatatable();
      }
      this.casetbl.clear();
      this.close();
    }
    var up = this._user.userProfiles.find(x => x.id == id);
    if (up != undefined && up != null) {
      this._searchProfile = up;
      this._searchProfileData = JSON.parse(up.profileData);
      $('#searchProfiles').val(id);
      if (this._searchProfileData.SearchType == 'S') {
        this.isSimpleSearch = true;
        this.simpleSearch();
        this.setSimpleSearchParameters(this._searchProfileData.SimpleSearchData);
      } else {
        this.isSimpleSearch = false;
        this.advancedSearch();
        this.setAdvancedSearchData(this._searchProfileData.AdvancedSearchData);
      }
    }
  }
  setSimpleSearchParameters(d: any): void {
    this.resetSimpleSearchViewModel();
    this.filterDataArray = [];
    this._simpleSearchExViewModel.caseId = d.caseId;
    this._caseHistoryViewModel.caseno = d.caseId;
    jQuery('#caseno_c').val(this._caseHistoryViewModel.caseno).trigger('change');
    if (d.caseId?.length > 0) {
      this.filterDataArray.push({ key: "Case No", value: this._caseHistoryViewModel.caseno });
    }

    this._simpleSearchExViewModel.houseNumber = d.houseNumber;
    this._caseHistoryViewModel.housingpermit = d.houseNumber;
    jQuery('#addressNumber').val(this._caseHistoryViewModel.housingpermit).trigger('change');;
    if (d.houseNumber?.length > 0)
      this.filterDataArray.push({ key: "House Number", value: d.houseNumber });

    this._simpleSearchExViewModel.supervisorId = d.supervisorId;
    this._caseHistoryViewModel.supervisor = d.inspectorId;

    this._caseHistoryViewModel.inspector = d.inspectorId;
    jQuery('#selectInspector_s').val(this._caseHistoryViewModel.inspector).trigger('change');

    this._selectedInspectorItems = this._simpleSearchExViewModel.inspectorId;
    if (this._selectedInspectorItems?.length > 0) {
      let inspectorNameList: string = '';
      this._selectedInspectorItems.forEach((i: any) => {
        this._inspectorList.find((v: any) => {
          if (v.id == i) {
            inspectorNameList += v.name + ','
          }
        })
      })
      this.filterDataArray.push({ key: "Inspector", value: inspectorNameList.trim() });
    }

    this._simpleSearchExViewModel.supervisorId = d.supervisorId;
    this._caseHistoryViewModel.supervisor = d.supervisorId;
    jQuery('#selectSupervisor_s').val(this._caseHistoryViewModel.supervisor).trigger('change');

    if (d.supervisorId?.length > 0) {
      d.supervisorId.forEach((element: any) => {
        this.filterDataArray.push({ key: "Supervisor", value: this._supervisorList.find((v: any) => v.id == element)?.name });
      });
    }

    //Program
    this._simpleSearchExViewModel.programType = d.programType;
    this._caseHistoryViewModel.program = d.programType;
    jQuery('#selectProgram_s').val(this._caseHistoryViewModel.program).trigger('change')
    if (d.program?.length > 0) {
      d.program.array.forEach((element: any) => {
        this.filterDataArray.push({ key: "Supervisor", value: this._programTypeList.find((v: any) => v.id == element)?.value });
      });
    }

    this._simpleSearchExViewModel.status = d.status;
    this._caseHistoryViewModel.status = d.status;
    jQuery('#selectStatus_s').val(this._caseHistoryViewModel.status).trigger('change');

    let selectedStatus = d.status;
    if (selectedStatus?.length > 0) {
      selectedStatus.forEach((e: any) => {
        //console.log('Status COde:', this._statusList.find(v1 => v1.code == e).value);
        this.filterDataArray.push({ key: "status", value: this._statusList.find(v1 => v1.code == e).value });
      });
    }

    if (d.street != null && d.street.length > 0) {
      var st: string[] = [];
      d.street.forEach((x: any, index: any) => {
        st.push(x.streetTypeCode);
      });
      jQuery('#selectstreet_s').val(st).trigger('change');
    }

    this.fetchSearchResult();
    jQuery('#caseHistorySearchPanel').collapse('hide');
    jQuery('#caseHistorySearchResult').collapse('show');
  }

  setAdvancedSearchData(d: any): void {
    this.resetAdvancedSearchViewModel();
    this.filterDataArray = [];

    //1.Case Number
    this._advancedSearchViewModel.caseId = d.caseId;
    this._caseHistoryViewModel.caseno = d.caseId;
    jQuery('#caseno').val(this._caseHistoryViewModel.caseno).trigger('change');
    if (d.caseId?.length > 0) {
      this.filterDataArray.push({ key: "Case No", value: this._caseHistoryViewModel.caseno });
    }

    //2.Status
    this._advancedSearchViewModel.status = d.status;
    this._caseHistoryViewModel.status = d.status;
    jQuery('#selectStatus').val(this._caseHistoryViewModel.status).trigger('change');

    let selectedStatus = d.status;
    if (selectedStatus?.length > 0) {
      selectedStatus.forEach((e: any) => {
        //console.log('Status COde:', this._statusList.find(v1 => v1.code == e).value);
        this.filterDataArray.push({ key: "status", value: this._statusList.find(v1 => v1.code == e).value });
      });
    }

    //3.Supervisor
    this._advancedSearchViewModel.supervisorId = d.supervisorId;
    this._caseHistoryViewModel.supervisor = d.supervisorId;
    jQuery('#selectSupervisor').val(this._caseHistoryViewModel.supervisor).trigger('change');

    if (d.supervisorId?.length) {
      d.supervisorId.forEach((element: any) => {
        this.filterDataArray.push({ key: "Supervisor", value: this._supervisorList.find((v: any) => v.id == element)?.name });
      });
    }

    //4.Program
    //Program
    this._advancedSearchViewModel.programType = d.programType;
    this._caseHistoryViewModel.program = d.programType;
    jQuery('#selectProgram').val(this._caseHistoryViewModel.program).trigger('change')
    if (d.program?.length > 0) {
      d.program.array.forEach((element: any) => {
        this.filterDataArray.push({ key: "Supervisor", value: this._programTypeList.find((v: any) => v.id == element)?.value });
      });
    }

    //5.Source - selectSource
    this._advancedSearchViewModel.sources = d.sources;
    this._caseHistoryViewModel.source = d.sources;
    jQuery('#selectSource').val(this._caseHistoryViewModel.source).trigger('change')
    if (d.sources?.length > 0) {
      d.sources.array.forEach((element: any) => {
        this.filterDataArray.push({ key: "Supervisor", value: this._sourceList.find((v: any) => v.id == element)?.value });
      });
    }

    //6.Inspector
    this._advancedSearchViewModel.inspectorId = d.inspectorId;
    this._caseHistoryViewModel.inspector = d.inspectorId;
    jQuery('#selectInspector').val(this._caseHistoryViewModel.inspector).trigger('change');

    this._selectedInspectorItems = this._advancedSearchViewModel.inspectorId;
    if (this._selectedInspectorItems?.length > 0) {
      let inspectorNameList: string = '';
      this._selectedInspectorItems.forEach((i: any) => {
        this._inspectorList.find((v: any) => {
          if (v.id == i) {
            inspectorNameList += v.name + ','
          }
        })
      })
      this.filterDataArray.push({ key: "Inspector", value: inspectorNameList.trim() });
    }

    //7.Supervisor
    this._advancedSearchViewModel.supervisorId = d.supervisorId;
    this._caseHistoryViewModel.supervisor = d.supervisorId;
    jQuery('#selectSupervisor').val(this._caseHistoryViewModel.supervisor).trigger('change');

    if (d.supervisorId?.length > 0) {
      d.supervisorId.forEach((element: any) => {
        this.filterDataArray.push({ key: "Supervisor", value: this._supervisorList.find((v: any) => v.id == element)?.name });
      });
    }

    //8.Case Priority - selectCasePriority
    this._advancedSearchViewModel.priorityType = d.priorityType;
    this._caseHistoryViewModel.casepriority = d.priorityType;
    jQuery('#selectCasePriority').val(this._caseHistoryViewModel.casepriority).trigger('change');

    if (this._caseHistoryViewModel.casepriority?.length > 0) {
      let priorityValue: any[] = [];
      d.priorityType.forEach((v: any) => {
        priorityValue.push(this._priorityType.find(e => e.code == v).value);
      });
      this.filterDataArray.push({ key: "Case Priority", value: priorityValue.join(',').trim() });
    }

    //9.Case Description
    if (d.description?.length > 0) {
      this._advancedSearchViewModel.description = d.description;
      this._caseHistoryViewModel.casedescription = d.description;
      jQuery('#casedescription').val(this._caseHistoryViewModel.casedescription).trigger('change');
      this.filterDataArray.push({ key: "Case Description", value: this._caseHistoryViewModel.casedescription });
    }

    //10 APN

    this._advancedSearchViewModel.apn = d.apn;
    this._caseHistoryViewModel.apn = d.apn;
    jQuery('#apn').val(this._caseHistoryViewModel.apn).trigger('change');
    if (d.apn?.length > 0) {
      this.filterDataArray.push({ key: "APN", value: this._caseHistoryViewModel.apn });
    }

    //11.House number
    this._advancedSearchViewModel.houseNumber = d.houseNumber;
    this._caseHistoryViewModel.addressnumber = d.houseNumber;
    jQuery('#addressNumber').val(this._caseHistoryViewModel.addressnumber).trigger('change');;
    if (d.houseNumber?.length > 0)
      this.filterDataArray.push({ key: "House Number", value: d.houseNumber });

    //12. Street

    if (d.street != null && d.street.length > 0) {
      var st: string[] = [];
      var streetnames: string[] = [];
      d.street.forEach((x: any, index: any) => {
        st.push(x.streetTypeCode);
        streetnames.push(x.streetname + ' ' + x.streetTypeCode);
      });
      jQuery('#selectStreet').val(st).trigger('change');
      if (streetnames?.length > 0) {
        this.filterDataArray.push({ key: "Street", value: streetnames.join(',').trim() });
      }
    }

    jQuery('#caseHistorySearchPanel').collapse('hide');
    jQuery('#caseHistorySearchResult').collapse('show');
    this.fetchSearchResult();
  }

  SetQueryStringValue() {
    console.log('Inspector List from ngAfterViewInit:', this._inspectorList);
  }

  assignInspector() {
    let self = this;
    // console.log('Selected Row:', this.casetbl.row.selected.data);
    let table = jQuery('#caseHistoryTbl').DataTable();
    this.ids = jQuery.map(table.rows('.selected').data(), function (item: any) {
      return item.id;
    });
    console.log('ids:', this.ids);
    jQuery('#selectInspectorModel').modal('show');
  }
  SaveChanges() {
    console.log('Selected Inspector Id:', this.assignInspectorId);
    let refresh = false;
    this.assignInspectorId = jQuery('#selectInspector_m').val()
    if (typeof this.assignInspectorId != 'undefined' && this.assignInspectorId && this.assignInspectorId !== "0") {

      var request: any = {};
      request.caseId = this.ids;
      request.inspectorId = this.assignInspectorId;

      var jsonString = JSON.stringify(request);
      this._caseHistoryServiceCall.caseSearch('casemaster', '/updateCaseInspector', jsonString.toString()).subscribe((response) => {
        console.log('Update Inspector:', response);
        if (response.status == 'SUCCESS') {
          console.log('Case History View Model in Assign Inspector:', JSON.stringify(this._caseHistoryViewModel));
          this.fetchSearchResult();
          jQuery('#selectInspectorModel').modal('hide');
        } else {
          alert(response.errorMessage);
        }
      });
    } else {
      alert('Inspector Select');
    }
  }
  initializeDatatable() {
    let self = this;
    var cols = [
      {
        data: "id",
        targets: 0,
        render: function (data: any, type: any, row: any) {
          if (row.isStarred == true) {
            return `<i class="bx bxs-star"></i>&nbsp; <a href='complaint?caseId=${row.id}'>${row.id}</a>`;
          }
          return `<i class="bx bx-star"></i>&nbsp; <a href='complaint?caseId=${row.id}'>${row.id}</a>`;
        }
      },
      {
        data: "address",
        targets: 1,
        render: function (data: any, type: any, row: any) {
          var addr = "";
          if (row.caseaddress?.houseNumber != null) { addr += row.caseaddress?.houseNumber + " " }
          if (row.caseaddress?.streetName != null) { addr += row.caseaddress?.streetName + " " }
          //
          if (row.caseaddress?.streetType != null) { addr += row.caseaddress?.streetType + " " }
          return addr;
        }
      },
      {
        data: "programcode",
        targets: 2,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "cudate",
        targets: 3,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "casestatus",
        targets: 4,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "opendate",
        targets: 5,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "closedate",
        targets: 6,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "inspector1id",
        targets: 7,
        render: function (data: any, type: any, row: any) {
          if (data != null) {
            return data;
          } else {
            return "";
          }
        }
      },
      {
        data: "caseaddress.district",
        targets: 8,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "description",
        targets: 9,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      }];

    this.casetbl = jQuery('#caseHistoryTbl').DataTable({
      paging: true,
      columns: cols,
      scrollX: true,
      // scrollY: true,
      columnDefs: [
        //   {
        //   width: 100,
        //   targets: 0,
        //   // render: function (data: any, type: any, row: any) {
        //   //   console.log('Row:', row);
        //   //   // if (row.isStarred == true) {
        //   //   //   return ' <i class="bx bxs-star"></i>&nbsp;' + data;
        //   //   // } else {
        //   //   //   return ' <i class="bx bx-star"></i>&nbsp;' + data;
        //   //   // }
        //   // }
        // },
        { className: "dt-left", targets: "_all" }],
      fixedColumns: true,
      initComplete: function () {
        var api = this.api();
        api
          .columns()
          .eq(0)
          .each(function (colIdx: any) {
            // Set the header cell to contain the input element
            var cell = jQuery('.filters th').eq(
              jQuery(api.column(colIdx).header()).index()
            );
            var title = jQuery(cell).text();
            jQuery(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            jQuery(
              'input',
              jQuery('.filters th').eq(jQuery(api.column(colIdx).header()).index())
            )
              .off('keyup change')
              .on('change', function (this: any, e: any) {
                // Get the search value
                jQuery(this).attr('title', jQuery(this).val());
                var regexr = '({search})'; //$(this).parents('th').find('select').val();

                var cursorPosition = this.selectionStart;
                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ''
                      ? regexr.replace('{search}', '(((' + this.value + ')))')
                      : '',
                    this.value != '',
                    this.value == ''
                  )
                  .draw();
              })
              .on('keyup', function (this: any, e: any) {
                e.stopPropagation();

                jQuery(this).trigger('change');
                jQuery(this)
                  .focus()[0]
                //.setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      },
      layout: {
        topStart: {
          buttons: [
            {
              extend: 'collection',
              text: 'Book Mark',
              autoClose: true,
              className: 'btn btn-primary',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button');
                $(node).addClass('custom-btn');
              },
              buttons: [
                {
                  text: 'Star',
                  action: function (e: any, dt: any, node: any, config: any) {
                    self.SetStar(true);
                  }
                },
                {
                  text: 'Unstar',
                  action: function (e: any, dt: any, node: any, config: any) {
                    self.SetStar(false);
                  }
                },
              ],
              dropup: true,
            },
            {
              extend: 'copyHtml5',
              // text: '<i class="fa fa-files-o"></i>',
              text: 'Copy All',
              className: 'btn btn-primary',
              titleAttr: 'Copy',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button');
                $(node).addClass('custom-btn');
              },
            }, {
              extend: 'csv',
              className: 'btn btn-primary',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button');
                $(node).addClass('custom-btn');
              },
            },
            {
              extend: 'pdf',
              className: 'btn btn-primary',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button');
                $(node).addClass('custom-btn');
              },
            },
            {
              title: 'Assign Inspector',
              text: "Assign Inspector",
              className: 'btn btn-primary',
              action: function (data: any, row: any) {
                self.assignInspector();
              },
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button');
                $(node).addClass('custom-btn');
              },
              render: function (data: any, e: any) {
                var $select = $("<select></select>", {
                  "id": "start",
                  "value": "d"
                });
                // $.each(times, function (k, v) {
                var $option = $("<option></option>", {
                  "text": "Amadhu",
                  "value": 1
                });

                $select.append($option);
                var $option = $("<option></option>", {
                  "text": "Amuthan",
                  "value": 2
                });
                $select.append($option);
                // });
                return $select.prop("outerHTML");
              }
            },

          ]
        }
      },
      language: {
        buttons: {
          copyTitle: 'Copy all cases',
          copyKeys:
            'Appuyez sur <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> pour copier les données du tableau à votre presse-papiers. <br><br>Pour annuler, cliquez sur ce message ou appuyez sur Echap.',
          copySuccess: {
            _: '%d Cases copied',
            1: '1 Case Copied'
          }
        }
      }
    });

  }
  setData(data: any, element: string) {
    console.log('Set Status');
    var s: [] = data.split(',');
    element = '#' + element;
    //jQuery('#selectStatus').val(s).trigger('change');
    jQuery(element).val(s).trigger('change');
  }

  loadMasterData() {
    this._masterDataList = [];
    this._programTypeList = [];
    this._inspectorList = [];
    this._sourceList = [];
    this._cdbgType = [];
    this._priorityType = [];
    var observable1$ = this._caseHistoryServiceCall.getAll(this._apiUrlConstant.CategoryModule)
      .subscribe({
        next: (response) => {
          this._masterDataList = response.data;

          this._masterDataList.forEach((e) => {
            if (e.status == true) {
              switch (e.category) {
                case this._apiUrlConstant.ProgramType:
                  this._programTypeList.push(e);
                  break;
                case this._apiUrlConstant.StatusType:
                  this._statusList.push(e);
                  break;
                case this._apiUrlConstant.SourceType:
                  this._sourceList.push(e);
                  break;
                case this._apiUrlConstant.PriorityType:
                  this._priorityType.push(e);
                  break;
                case this._apiUrlConstant.CBDGType:
                  this._cdbgType.push(e);
                  break;
              }
            }
          });

        },
        complete: () => { console.log('On Subscribe Master Data:', this._masterDataList); }
      });
    console.log('Case Master View Model1:', this._caseHistoryViewModel);
    var observable2$ = this._caseHistoryServiceCall.getAll(this._apiUrlConstant.StreetMasterTypeModule)
      .subscribe((response) => {
        this._streetDataList = response.data;
      });
    this._caseHistoryServiceCall.getByModuleAndMethod(this._apiUrlConstant.InspectorModule, this._apiUrlConstant.GetAllInspector)
      .subscribe((response) => {
        this._inspectorList = response.data;
        // console.log('Inspector Data:', this._inspectorList);
      });
    this._caseHistoryServiceCall.getByModuleAndMethod(this._apiUrlConstant.InspectorModule, this._apiUrlConstant.GetAllSupervisor)
      .subscribe((response) => {
        this._supervisorList = response.data;
        // console.log('Inspector Data:', this._inspectorList);
      });
    this._caseHistoryServiceCall.getByModuleAndMethod(this._apiUrlConstant.ViolationTypeModule, this._apiUrlConstant.GetAll)
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

  resetMockViewModel() {
    this._caseHistoryViewModel = {
      caseno: "",
      inspector: "",
      program: "",
      violationtype: "",
      supervisor: "",
      housingpermit: "",
      apn: "",
      admincitation: "",
      source: "",
      tpd: "",
      addressnumber: "",
      direction: "",
      name: "",
      type: "",
      unit: "",
      crossstreet: "",
      status: "",
      responsibleparty: "",
      caseperson: "",
      casepriority: "",
      cdbg: "",
      casedescription: "",
      street: "",
      casedate: ""
    }

  }
  resetSimpleSearchViewModel() {
    this._simpleSearchExViewModel = {
      caseId: [],
      houseNumber: [],
      supervisorId: [],
      inspectorId: [],
      programType: [],
      status: [],
      street: [],
      // cuDate: '',
      // createDate: '',
      // modifiedDate: ''
    }
  }
  resetAdvancedSearchViewModel() {
    this._advancedSearchViewModel = {
      caseId: [],
      status: [],
      programType: [],
      inspectorId: [],
      priorityType: [],
      cuDate: null,
      violationType: [],
      // cdbg: [],
      // adminCitation: [],
      description: null,
      apn: [],
      houseNumber: [],
      street: [],
      housingPermits: null,
      // responsibleParty: [],
      sources: [],
      //addressNumber: []
      createDate: null,
      supervisorId: null
      // starred: null,
    }
  }
  assignSimpleSearchModel() {
    try {
      this.resetSimpleSearchViewModel();
      this.filterDataArray = [];
      // this._simpleSearchExViewModel.cuDate = jQuery('#cudate_s').val();
      // this._simpleSearchExViewModel.createDate = jQuery('#created_s').val();
      // this._simpleSearchExViewModel.modifiedDate = jQuery('#modified_s').val();
      //case number
      if ((this._caseHistoryViewModel.caseno != null) && (this._caseHistoryViewModel.caseno.length > 0)) {
        this._simpleSearchExViewModel.caseId = this._caseHistoryViewModel.caseno.split(',');
        this.filterDataArray.push({ key: "Case No", value: this._caseHistoryViewModel.caseno });
        //this._advancedSearchViewModel.caseId.push(this._caseHistoryViewModel.caseno);
      }
      this._caseHistoryViewModel.caseno = this._caseHistoryViewModel.caseno;

      //Address Number
      if ((this._caseHistoryViewModel.addressnumber != null) && (this._caseHistoryViewModel.addressnumber.length > 0)) {
        this._simpleSearchExViewModel.houseNumber = this._caseHistoryViewModel.addressnumber.split(',');
        this.filterDataArray.push({ key: "House Number", value: this._caseHistoryViewModel.addressnumber });
      }

      //Inspector
      this._selectedInspectorItems = [];
      this._selectedInspectorItems = jQuery('#selectInspector_s').val();
      this._simpleSearchExViewModel.inspectorId = this._selectedInspectorItems;

      let inspectorNameList: string = '';
      this._selectedInspectorItems.forEach((i: any) => {
        this._inspectorList.find((v: any) => {
          if (v.id == i) {
            inspectorNameList += v.name + ','
          }
        })
      })
      if (inspectorNameList.length > 0) {

        this.filterDataArray.push({ key: "Inspector", value: inspectorNameList.slice(0, (inspectorNameList.length - 1)) });
      }

      // Supervisor
      this._simpleSearchExViewModel.supervisorId = jQuery('#selectSupervisor_s').val();
      let supervisorNameList: string = '';
      this._simpleSearchExViewModel.supervisorId.forEach((v: any) => {
        supervisorNameList += this._supervisorList.find(c => c.id == v).name + ',';
      });
      if (supervisorNameList.length > 0) {
        this.filterDataArray.push({ key: "Supervisor", value: supervisorNameList.slice(0, (supervisorNameList.length - 1)) });
      }
      console.log(supervisorNameList);
      //Status
      this._selectedStatusItems = [];
      let selectedStatus = jQuery('#selectStatus_s option:selected').toArray().map((i: { text: any; }) => i.text);
      if (selectedStatus.length > 0) {
        this.filterDataArray.push({ key: "status", value: selectedStatus.join(', ') });
        selectedStatus.forEach((element: any) => {
          console.log('Status COde:', this._statusList.find(v1 => v1.value == element).code);
          this._simpleSearchExViewModel.status.push(this._statusList.find(v1 => v1.value == element).code);
          this._caseHistoryViewModel.status = element;
          console.log('Status Element:', JSON.stringify(element));
        });
      }

      //Street
      this._selectedStreetItems = [];
      let selectedStreets = jQuery('#selectstreet_s option:selected').toArray().map((i: { text: any; }) => i.text);
      if (selectedStreets.length > 0) {
        this.filterDataArray.push({ key: "street", value: selectedStreets.join(', ') });
        selectedStreets.forEach((element: any) => {
          this._simpleSearchExViewModel.street.push(this._streetDataList.find(v1 => (v1.streetname + ' ' + v1.streettype) === element));
          this._caseHistoryViewModel.street = element;
        });
      }

      //Program
      this._selectedProgramsItems = [];
      let selectedPrograms = jQuery('#selectProgram_s option:selected').toArray().map((i: { text: any; }) => i.text);
      if (selectedPrograms.length > 0) {
        this.filterDataArray.push({ key: "program", value: selectedPrograms.join(', ') });
        selectedPrograms.forEach((element: any) => {
          this._simpleSearchExViewModel.programType.push(this._programTypeList.find(v1 => v1.value == element).code);
          this._caseHistoryViewModel.program = element;
        });
      }

      console.log('Case History View Model:', this._caseHistoryViewModel);
      console.log('Filter Data Array:', this.filterDataArray);
    } catch (error) {
      console.log('Error:', JSON.stringify(error));
    }

  }
  assignAdvancedSearchModel() {
    this.resetAdvancedSearchViewModel();
    this.filterDataArray = [];

    //case number
    if ((this._caseHistoryViewModel.caseno != null) && (this._caseHistoryViewModel.caseno.length > 0)) {
      this._advancedSearchViewModel.caseId = this._caseHistoryViewModel.caseno.split(',');
      this.filterDataArray.push({ key: "Case No", value: this._caseHistoryViewModel.caseno });
    }
    this._caseHistoryViewModel.caseno = this._caseHistoryViewModel.caseno;

    //Status
    this._selectedStatusItems = [];
    let selectedStatus = jQuery('#selectStatus option:selected').toArray().map((i: { text: any; }) => i.text);
    if (selectedStatus.length > 0) {
      this.filterDataArray.push({ key: "status", value: selectedStatus.join(', ') });
      selectedStatus.forEach((element: any) => {
        console.log('Status Code:', this._statusList.find(v1 => v1.value == element).code);
        this._advancedSearchViewModel.status.push(this._statusList.find(v1 => v1.value == element).code);
        this._caseHistoryViewModel.status = element;
        console.log('Status Element:', JSON.stringify(element));
      });
    }

    //Program
    this._selectedProgramsItems = [];
    let selectedPrograms = jQuery('#selectProgram option:selected').toArray().map((i: { text: any; }) => i.text);
    if (selectedPrograms.length > 0) {
      this.filterDataArray.push({ key: "program", value: selectedPrograms.join(', ') });
      selectedPrograms.forEach((element: any) => {
        this._advancedSearchViewModel.programType.push(this._programTypeList.find(v1 => v1.value == element).code);
        this._caseHistoryViewModel.program = element;
      });
    }

    //Inspector
    this._selectedInspectorItems = [];
    let selectedInspectors = jQuery('#selectInspector option:selected').toArray().map((i: { text: any; }) => i.text);
    if (selectedInspectors.length > 0) {
      console.log("selectedInspectors:", selectedInspectors.length);
      this.filterDataArray.push({ key: "Inspector", value: selectedInspectors.join(', ') });
      let ins = '';
      selectedInspectors.forEach((v: any) => {
        this._selectedInspectorItems.push(v);
        ins += v + ',';
      });
      this._caseHistoryViewModel.inspector = ins.substring(0, ins.length - 1);
      console.log('Inspector:', ins.substring(1, ins.length - 1));
      this._selectedInspectorItems.push(selectedInspectors);
      this._selectedInspectorItems.forEach((v: string) => {
        this._advancedSearchViewModel.inspectorId.push(this._inspectorList.find(ele => ele.name == v)?.id);
      }
      );
    }

    //Source
    this._selectedSourceItems = [];
    let selectedSources = jQuery('#selectSource option:selected').toArray().map((i: { text: any; }) => i.text);
    if (selectedSources.length > 0) {
      this.filterDataArray.push({ key: "Source", value: selectedSources.join(', ') });
      selectedSources.forEach((element: any) => {
        this._advancedSearchViewModel.sources.push(this._sourceList.find(v1 => v1.value == element).code);
        this._caseHistoryViewModel.source = element;
      });
    }

    //Case Priority
    this._selectedSourceItems = [];
    let selectedCasePriority = jQuery('#selectCasePriority option:selected').toArray().map((i: { text: any; }) => i.text);
    if (selectedCasePriority.length > 0) {
      this.filterDataArray.push({ key: "Case Priority", value: selectedCasePriority.join(', ') });
      selectedCasePriority.forEach((element: any) => {
        this._advancedSearchViewModel.priorityType.push(this._priorityType.find(v1 => v1.value == element).code);
        this._caseHistoryViewModel.casepriority = element;
      });
    }

    //Violation Type
    this._selectedViolationTypes = [];
    let selectedViolationType = jQuery('#selectViolationtype option:selected').toArray().map((i: { text: any; }) => i.text);
    console.log('Selected Violation Type:', selectedViolationType);
    if (selectedViolationType.length > 0) {
      this.filterDataArray.push({ key: "Violation Type", value: selectedViolationType.join(', ') });
      selectedViolationType.forEach((element: any) => {
        this._advancedSearchViewModel.violationType.push(this._violationType.find(v1 => v1.violationdescr == element).violationcode);
        this._caseHistoryViewModel.violationtype = element;
      });
    }

    //Case Description
    if ((this._caseHistoryViewModel.casedescription != null) && (this._caseHistoryViewModel.casedescription.length > 0)) {
      this._advancedSearchViewModel.description = this._caseHistoryViewModel.casedescription;
      this.filterDataArray.push({ key: "Case Description", value: this._caseHistoryViewModel.casedescription });
    }

    //APN
    if ((this._caseHistoryViewModel.apn != null) && (this._caseHistoryViewModel.apn.length > 0)) {
      this._advancedSearchViewModel.apn = this._caseHistoryViewModel.apn.split(',');
      this.filterDataArray.push({ key: "APN", value: this._caseHistoryViewModel.apn });
    }

    //Address Number
    if ((this._caseHistoryViewModel.addressnumber != null) && (this._caseHistoryViewModel.addressnumber.length > 0)) {
      this._advancedSearchViewModel.houseNumber = this._caseHistoryViewModel.addressnumber.split(',');
      this.filterDataArray.push({ key: "Address Number", value: this._caseHistoryViewModel.addressnumber });
    }

    //House Permit
    if ((this._caseHistoryViewModel.housingpermit != null) && (this._caseHistoryViewModel.housingpermit.length > 0)) {
      this._advancedSearchViewModel.housingPermits = this._caseHistoryViewModel.housingpermit.split(',');
      this.filterDataArray.push({ key: "House Permit", value: this._caseHistoryViewModel.housingpermit });
    }

    //Street
    this._selectedStreetItems = [];
    let selectedStreets = jQuery('#selectStreet option:selected').toArray().map((i: { text: any; }) => i.text);
    if (selectedStreets.length > 0) {
      this.filterDataArray.push({ key: "street", value: selectedStreets.join(', ') });
      selectedStreets.forEach((element: any) => {
        this._advancedSearchViewModel.street.push(this._streetDataList.find(v1 => (v1.streetname + ' ' + v1.streettype) === element));
        this._caseHistoryViewModel.street = element;
      });
    }
    this._caseHistoryViewModel.housingpermit = this._caseHistoryViewModel.housingpermit;

    console.log('Advanced search model:', this._advancedSearchViewModel);
  }
  updateFilterDataArray(key: any, value: any) {
    this.filterDataArray.push({ key: key, value: value });
  }
  search() {
    console.log('Search Model');
    if (this.isSimpleSearch) {
      this.assignSimpleSearchModel();
    } else if (this.isSimpleSearch == false) {
      this.assignAdvancedSearchModel();
    }
    this.casetbl.rows().remove().draw();
    this.fetchSearchResult();
    jQuery('#caseHistorySearchPanel').collapse('hide');
    jQuery('#caseHistorySearchResult').collapse('show');
  }
  fetchSearchResult() {
    let jsonString: any;
    this._caseSearchResults = [];
    this.caseHistoryDataList = [];
    if (this.isSimpleSearch) {
      console.log(jsonString);
      jsonString = JSON.stringify(this._simpleSearchExViewModel);

    } else if (this.isSimpleSearch == false) {
      jsonString = JSON.stringify(this._advancedSearchViewModel);
    }
    if (jsonString.length > 0) {
      //http://localhost:8080/api/casemaster/search
      this._caseHistoryServiceCall.caseSearch('casemaster', '/search', jsonString.toString()).subscribe((response) => {
        if (response.status == "SUCCESS") {
          var data = response.data;
          console.log(data);
          this.caseHistoryDataList = data;
          this.caseHistoryDataList.forEach((v: any, index: any) => {

            let inspectorId = v.inspector1id;
            let inspectorname = this._inspectorList.find((v1: any, index: any) => v1.id == inspectorId)?.name;
            this.caseHistoryDataList[index].inspector1id = inspectorname;


            //sourcecode
            let casestatus = v.casestatus;
            let _casestatus = this._statusList.find((v1: any, index: any) => v1.code == casestatus)?.value;
            this.caseHistoryDataList[index].casestatus = _casestatus;

            let programcode = v.programcode;
            let _programcode = this._programTypeList.find((v1: any, index: any) => v1.code == programcode)?.value;
            this.caseHistoryDataList[index].programcode = _programcode;
          })
          if (this.casetbl === undefined) {
            this.initializeDatatable();
          }


          this.casetbl.clear().rows.add(this.caseHistoryDataList).draw();
        } else if (response.status == "ERROR") {
          alert('Error:' + response.errorMessage);
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: response.errorMessage
          });
        }
      });
    }
  }

  close() {
    //this.simpleSearch();
    jQuery('#detailsFilter').removeClass('hide');
    jQuery('#detailsFilter').removeClass('show');
    jQuery('#detailsFilter').addClass('hide');
    // jQuery('#simpleFilter').addClass('show');
    jQuery('#simpleFilter').removeClass('hide');
    jQuery('#simpleFilter').removeClass('show');
    jQuery('#simpleFilter').addClass('show');
    // jQuery('#simpleFilter').removeClass('hide');
    // jQuery('#simpleFilter').addClass('show');
    jQuery('#btnCompressedSearch').addClass('hide');
    jQuery('#btnAdvancedSearch').removeClass('hide');
    jQuery('#btnAdvancedSearch').addClass('show');
    jQuery('#caseHistorySearchPanel').collapse('show');
    this._caseHistoryViewModel.casedescription = null;
    this._caseHistoryViewModel.caseno = null;
    this._caseHistoryViewModel.housingpermit = null;
    this._caseHistoryViewModel.apn = null;
    this._caseHistoryViewModel.addressnumber = null;
    this.casetbl.rows().remove().draw();
    jQuery('#selectStatus').val(null).trigger('change');
    jQuery('#selectProgram').val(null).trigger('change');
    jQuery('#selectSource').val(null).trigger('change');
    jQuery('#selectInspector').val(null).trigger('change');
    jQuery('#selectInspector_s').val(null).trigger('change');
    jQuery('#selectSupervisor_s').val(null).trigger('change');
    jQuery('#selectSupervisor').val(null).trigger('change');
    jQuery('#selectViolationType').val('null').trigger('change')
    jQuery('#selectCDBG').select2('data', null);
    jQuery('#selectStreet').val(null).trigger('change');
    jQuery('#selectCasePriority').val(null).trigger('change');
    jQuery('#selectProgram_s').val(null).trigger('change');
    jQuery('#selectStatus_s').val(null).trigger('change');
    jQuery('#selectstreet_s').val(null).trigger('change');

    this.filterDataArray = [];
  }

  open() {
    jQuery('#caseHistorySearchPanel').collapse('show');
  }

  advancedSearch() {
    this.isSimpleSearch = false;
    jQuery('#detailsFilter').removeClass('hide');
    jQuery('#simpleFilter').addClass('hide');
    jQuery('#btnCompressedSearch').removeClass('hide');
    jQuery('#btnAdvancedSearch').addClass('hide');
    jQuery('#selectStatus').select2({}).on('select2:open', () => {
      jQuery('#selectStatus').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectStatus').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectProgram').select2({}).on('select2:open', () => {
      jQuery('#selectProgram').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectProgram').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectSource').select2({}).on('select2:open', () => {
      jQuery('#selectSource').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectSource').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectInspector').select2({}).on('select2:open', () => {
      jQuery('#selectInspector').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectInspector').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectViolationType').select2({}).on('select2:open', () => {
      jQuery('#selectViolationType').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectViolationType').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectCDBG').select2({}).on('select2:open', () => {
      jQuery('#selectCDBG').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectCDBG').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectStreet').select2({}).on('select2:open', () => {
      jQuery('#selectStreet').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectStreet').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectCasePriority').select2({}).on('select2:open', () => {
      jQuery('#selectCasePriority').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectCasePriority').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectSupervisor').select2({}).on('select2:open', () => {
      jQuery('#selectSupervisor').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectSupervisor').next('.select2-container').removeClass('focused');
    });
    console.log('Simple Search Boolean:', this.isSimpleSearch);
  }
  simpleSearch() {
    this.isSimpleSearch = true;
    jQuery('#detailsFilter').addClass('hide');
    jQuery('#simpleFilter').removeClass('hide');
    jQuery('#btnCompressedSearch').addClass('hide');
    jQuery('#btnAdvancedSearch').removeClass('hide');
    jQuery('#selectProgram_s').select2({}).on('select2:open', () => {
      jQuery('#selectProgram_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectProgram_s').next('.select2-container').removeClass('focused');
    });;
    jQuery('#selectStatus_s').select2({}).on('select2:open', () => {
      jQuery('#selectStatus_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectStatus_s').next('.select2-container').removeClass('focused');
    });
    jQuery('#selectstreet_s').select2({}).on('select2:open', () => {
      jQuery('#selectstreet_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectstreet_s').next('.select2-container').removeClass('focused');
    });;

    // jQuery('#selectrecent_s').select2({});
    jQuery('#selectInspector_s').select2({}).on('select2:open', () => {
      jQuery('#selectInspector_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectInspector_s').next('.select2-container').removeClass('focused');
    });;
    jQuery('#selectSupervisor_s').select2({}).on('select2:open', () => {
      jQuery('#selectSupervisor_s').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#selectSupervisor_s').next('.select2-container').removeClass('focused');
    });;
    console.log('Simple Search Boolean:', this.isSimpleSearch);
  }
  toLower(params: Params): Params {
    const lowerParams: Params = {};
    for (const key in params) {
      lowerParams[key.toLowerCase()] = params[key];
    }

    return lowerParams;
  }

  FunCall() {
    console.log('Called');
  }
}