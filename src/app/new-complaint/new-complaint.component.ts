import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockupViewModel } from '../mockpage/mockup.viewmodel';
import { APIURLConstant } from '../api.url.constant';
import { ComplaintService } from '../services/complaint.service';
import { ViolationDataViewModel } from './violation.viewmodel';
import { ViolationViewModel } from '../violations/violation.viewmodel';
import { CaseStatusState } from '../app.complaintmodel';

declare var jQuery: any;
declare var stepper1: any;
declare var bstreeview: any;

@Component({
  selector: 'app-new-complaint',
  templateUrl: './new-complaint.component.html',
  styleUrls: ['./new-complaint.component.css'],
})
export class NewComplaintComponent {
  public userProfileDataList: any;
  _selectedItem: any;
  _mockupViewModel: MockupViewModel;
  _primaryInspectorAssignment: string;
  _secondaryInspectorAssignment: string;
  searchText: string;
  jsonData: any;
  jsonSourceData: any;
  _masterDataList: any[] = [];
  _areaTypeDataList: any[] = [];
  _complaintTypeDataList: any[] = [];
  _coreServiceTypeDataList: any[] = [];
  _dispositionTypeDataList: any[] = [];
  _phoneTypeDataList: any[] = [];
  _priorityTypeDataList: any[] = [];
  _programTypeDataList: any[] = [];
  _relationshipTypeDataList: any[] = [];
  _salutationTypeDataList: any[] = [];
  _serviceAreaTypeDataList: any[] = [];
  _streetTypeDataList: any[] = [];
  salutation: string;
  _violationDataList: any[] = [];
  _caseStatus:CaseStatusState[]=[];
  _violation: ViolationDataViewModel;
  constructor(
    private _http: HttpClient,
    private _urlConstant: APIURLConstant,
    private _complaintServiceCall: ComplaintService
  ) {}

  ngOnInit() {
    this.loadMasterData();
    this.salutation = '';
    this.view(1);
    this.searchText = '';

    jQuery('#single-select-optgroup-field').select2({
      theme: 'bootstrap-5',
      width: jQuery(this).data('width')
        ? jQuery(this).data('width')
        : jQuery(this).hasClass('w-100')
        ? '100%'
        : 'style',
      placeholder: jQuery(this).data('placeholder'),
    });
    if (localStorage.getItem('nc') == 'yes') {
      localStorage.setItem('nc', 'no');
      location.reload();
    }
    this._primaryInspectorAssignment = '';
    this._secondaryInspectorAssignment = '';
    this.resetMockViewModel();
    const url: string = '/assets/MOCK_DATA.json';
    jQuery('#caseHistoryReport').hide();
    jQuery('#propertyAndCaseHistory').hide();
    jQuery('#addressInfo').hide();
    jQuery('#registeredCases').hide();

    this._http.get(url).subscribe((response) => {
      this.userProfileDataList = response;
    });
  }

  loadMasterData() {
    this._masterDataList = [];
    this._complaintServiceCall
      .getAll(this._urlConstant.CategoryModule)
      .subscribe((response) => {
        this._masterDataList = response.data;
        this._areaTypeDataList = [];
        this._complaintTypeDataList = [];
        this._coreServiceTypeDataList = [];
        this._dispositionTypeDataList = [];
        this._phoneTypeDataList = [];
        this._priorityTypeDataList = [];
        this._programTypeDataList = [];
        this._relationshipTypeDataList = [];
        this._salutationTypeDataList = [];
        this._serviceAreaTypeDataList = [];
        this._streetTypeDataList = [];
        this._masterDataList.forEach((e) => {
          switch (e.category) {
            case this._urlConstant.AreaType:
              this._areaTypeDataList.push(e);
              break;
            case this._urlConstant.ComplaintType:
              this._complaintTypeDataList.push(e);
              break;
            case this._urlConstant.CoreServiceType:
              this._coreServiceTypeDataList.push(e);
              break;
            case this._urlConstant.DispositionType:
              this._dispositionTypeDataList.push(e);
              break;
            case this._urlConstant.PhoneType:
              this._phoneTypeDataList.push(e);
              break;
            case this._urlConstant.PriorityType:
              this._priorityTypeDataList.push(e);
              break;
            case this._urlConstant.ProgramType:
              this._programTypeDataList.push(e);
              break;
            case this._urlConstant.RelationshipType:
              this._relationshipTypeDataList.push(e);
              break;
            case this._urlConstant.SalutationType:
              this._salutationTypeDataList.push(e);
              break;
            case this._urlConstant.ServiceAreaType:
              this._serviceAreaTypeDataList.push(e);
              break;
            case this._urlConstant.StreetType:
              this._streetTypeDataList.push(e);
              break;
          }
        });
      });

      this._complaintServiceCall
      .get(this._urlConstant.CaseDataModule,"caseStatus")
      .subscribe((response) => {
        this._caseStatus=response.data;
      });

    this._complaintServiceCall
      .getAll(this._urlConstant.ViolationTypeModule)
      .subscribe((response) => {
        console.log('Response : ' + JSON.stringify(response.data));
        this._violationDataList = [];
        this._violationDataList = response.data;
        this.jsonData = [];
        this._violationDataList.forEach((e) => {
          this._violation = {
            text: '',
            children: [],
          };
          let violationChildDataList = [];
          violationChildDataList = e.violations;
          this._violation.text = e.violationdescr;
          violationChildDataList.forEach((e1: any) => {
            return this._violation.children.push({
              id: e1.id,
              text: e1.municipalcode + ' ' + e1.shortdesc,
            });
          });
          this.jsonData.push({
            text: e.violationdescr,
            children: this._violation.children,
          });
          //console.log("JSONData : " + JSON.stringify(this.jsonData));
        });
        jQuery('#violationList')
          .on('changed.jstree', function (e: any, data: any) {
            if (data.selected.length) {
              alert(
                'The selected node is: ' +
                  data.instance.get_node(data.selected[0]).text
              );
            }
          })
          .jstree({
            core: {
              multiple: false,
              data: this.jsonData,
            },
            search: {
              show_only_matches: true,
              show_only_matches_children: true,
            },
            plugins: ['search'],
          });
      });
  }

  resetMockViewModel() {
    this._mockupViewModel = {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
    };
  }

  search() {
    let to = false;
    if (to) {
      clearTimeout(to);
    }
    setTimeout(function () {
      var v = $('#search').val();
      jQuery('#violationList').jstree(true).search(v);
    }, 250);
    jQuery('#violationList').jstree(true).search(this.searchText);
    // this.jsonSourceData.forEach(element => {
    //   console.log(element.text.toString().toLowerCase().indexOf(this.searchText))
    //   if (element.text.toString().toLowerCase().indexOf(this.searchText) != -1) {
    //     this.jsonData.push(element);
    //     jQuery('#violationList').jstree(true).refresh();
    //   }
    // });
  }

  view(id: any) {
    if (id == 1) {
      jQuery('#v1').show();
      jQuery('#v2').hide();
    } else {
      jQuery('#v1').hide();
      jQuery('#v2').show();
    }
  }
  onPrimaryInspectorChange(evt: any) {
    this._primaryInspectorAssignment =
      ' Assigned: 4, In Progress: 6, Closed: 10 (Last 30 days)';
  }
  onSecondaryInspectorChange(evt: any) {
    this._secondaryInspectorAssignment =
      ' Assigned: 2, In Progress: 2, Closed: 6 (Last 30 days)';
  }
  hideRegisteredCases() {
    jQuery('#registeredCases').hide();
  }
  getRegisteredCases() {
    jQuery('#registeredCases').show();
  }
  nextTab() {
    jQuery('#addressInfo').show();
    stepper1.next();
  }
  viewMap() {
    if (jQuery('#googleMap').hasClass('d-none')) {
      jQuery('#googleMap').removeClass('d-none');
      jQuery('#btnMap').text('Hide Map');
    } else {
      jQuery('#googleMap').addClass('d-none');
      jQuery('#btnMap').text('View Map');
    }
  }

  showCaseHistory() {
    if (jQuery('#caseHistoryList').hasClass('d-none')) {
      jQuery('#caseHistoryList').removeClass('d-none');
      jQuery('#btnCaseHistory').text('Hide Case History');
    } else {
      jQuery('#caseHistoryList').addClass('d-none');
      jQuery('#btnCaseHistory').text('View Case History');
    }

    jQuery('#btnMap').text('View Map');
  }
  nextPeople() {
    stepper1.next();
    jQuery('#btnSaveAll').removeClass('d-none');
    jQuery('#autoSave').removeClass('d-none');
  }
  addNew() {
    this.resetMockViewModel();
    jQuery('#itemInfo').modal('show');
  }
  edit(item: any) {
    this._mockupViewModel = item;
    jQuery('#itemInfo').modal('show');
  }
  resetReport() {
    jQuery('#caseHistoryReport').hide();
    jQuery('#propertyAndCaseHistory').hide();
  }
  loadInfo() {
    jQuery('#caseHistoryReport').show();
    jQuery('#propertyAndCaseHistory').show();
  }

  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  zoom = 4;
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
