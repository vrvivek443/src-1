import { Component, ElementRef, Renderer2, setTestabilityGetter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockupViewModel } from '../mockpage/mockup.viewmodel';
import { APIURLConstant } from '../api.url.constant';
import { ComplaintService } from '../services/complaint.service';
import { ViolationViewModel } from '../violations/violation.viewmodel';
import { ActionLogAppointmentViewModel, ActionLogCitiationViewModel, ActionLogPictureViewModel, ActionLogTypeViewModel, ActionLogViewModel, CaseAddress, caseAddressViewModel, CaseDetailViewModel, casePersonViewModel, CaseViewModel, CaseViolationViewModel, City, SearchViewModel, ViolationDataViewModel } from './complaint.viewmodel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { error } from 'jquery';
import { CaseStatusState } from '../app.complaintmodel';
import { UserModel, UserProfile } from '../user/user.viewmodel';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';



declare const bootstrap: any;
declare var jQuery: any;
declare var stepper1: any;
declare var bstreeview: any;
declare var Lobibox: any;
declare var lightbox: any;

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent {
  dtElement: DataTableDirective;
  changeStatus() {
    if (this.canChangeStatus()) {
      this._newCaseStatus = this._caseDetail.casestatus;
      jQuery('#caseStatusModel').modal('show');
    }
  }
  changeCaseStatus() {
    if (this._newCaseStatus != this._caseDetail.casestatus) {
      this.saveCaseDetail(this._newCaseStatus);
    }
  }
  public userProfileDataList: any;
  dueReason: string;
  cuReason: string;
  today = new Date();

  // Format the date as `YYYY-MM-DD` (required for <input type="date">)
  formattedDate: any;
  crDate = new Date();
  isSalClicked: boolean = false;
  isErrorShowMsg: boolean = false;
  caseViolationDetails: any[] = [];
  _newCaseStatus: string = '';
  isFirstNameHasData: boolean = false;
  isFirstNameErrorMessage: string = 'Firstname is required';
  isLastNameHasData: boolean = false;
  isLastNameErrorMessage: string = 'Lastname is required';
  isMunicodeHasData: boolean = false;
  municodeErrorMessage: string = 'Muni Code is required';
  isDescriptionHasData: boolean = false;
  descriptionErrorMessage: string = 'Description is required';
  isCorrectiveActionHasData: boolean = false;
  correctiveActionErrorMessage: string = 'Description is required';
  isPersonTypeClicked: boolean = false;
  isRelationshipTypeClicked: boolean = false;
  isRelationErrorMessage: string = '';
  isPhone1hasData: boolean = false;
  isPhone2hasData: boolean = false;
  isCaseDetailPriorityCode: boolean = false;
  casedetailPriorityCodeMessage: string = '';
  isCaseDetailStatus: boolean = false;
  casedetailStatusMessage: string = 'Status cannot be saved. Check essential field';
  isCaseDetailDispositionCode: boolean = false;
  casedetailDispositionCodeMessage: string = 'Disposition code cannot be null';
  isCaseDetailCoreserviceCode: boolean = false;
  casedetailCoreserviceCodeMessage: string = 'Disposition code cannot be null';
  isCaseDetailSourceCode: boolean = false;
  casedetailSourceCodeMessage: string = '';
  isCaseDetailProgramCode: boolean = false;
  casedetailProgramCodeMessage: string = '';
  isPhone1ErrorMessage: string;
  isPhone2ErrorMessage: string;
  _comment: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do."
  personTypeErrorMessage: string = '';
  salutationErrorMessage: string = '';
  editedPictureId = 0;
  _mapAddressList: string[] = [];
  _personTbl: any;
  _addressListTbl: any
  _personTable: any;
  _isEdit: boolean = false;
  _messageText: string;
  _user: UserModel = null;
  _searchViewModel: SearchViewModel;
  _selectedAPN: string;
  _caseAddressViewModel: caseAddressViewModel;
  _caseDetailViewModel: CaseDetailViewModel;
  _caseDetail: any;
  _caseDetailErrorSummary: any[] = [];
  _caseDetailForm: FormGroup;
  _caseViewModel: CaseViewModel;
  _caseAddress: CaseAddress;
  _caseAddressForm: FormGroup;
  _casePersonViewModel: casePersonViewModel;
  pastDate: any;
  pastCUDate: any;
  _caseViolationViewModel: CaseViolationViewModel;
  _violationErrorSummary: any[] = [];
  _actionLogViewModel: ActionLogViewModel;
  _followupActionLogViewModel: ActionLogViewModel;
  _selectedActionLogViewModel: any;
  _actionLogTypeViewModel: ActionLogTypeViewModel;
  _citationViewModel: ActionLogCitiationViewModel;
  _actionLogFileViewModel: any;
  _actionLogPictureViewModel: ActionLogPictureViewModel;
  _actionLogForm: FormGroup;
  _followUpActionLogForm: FormGroup;
  _casePersonForm!: FormGroup;
  _caseViolationForm: FormGroup;
  _actionLogAppointmentViewModel: ActionLogAppointmentViewModel;
  _actionLogAppointmentForm: FormGroup;
  _actionLogTaskForm: FormGroup;
  _selectedItem: any;
  _caseAddressId: number;
  _caseId: number;
  _mockupViewModel: MockupViewModel;
  _primaryInspectorAssignment: string;
  _secondaryInspectorAssignment: string;
  _violationTable: any;
  _actionsTable: any;
  dataComments = [
    {
      comment: "The document has been reviewed and approved for further processing.",
      updatedBy: "Amuthan",
      updatedOn: "2024-11-28"
    },
    {
      comment: "Changes have been made as per the feedback received in the last meeting.",
      updatedBy: "Karthic",
      updatedOn: "2024-11-30"
    },
    {
      comment: "Awaiting approval from the management team.",
      updatedBy: "Vivek",
      updatedOn: "2024-12-01"
    },
    {
      comment: "The initial draft has been completed and shared with the stakeholders.",
      updatedBy: "Amuthan",
      updatedOn: "2024-12-02"
    },
    {
      comment: "Verified the entries and corrected minor discrepancies in the data.",
      updatedBy: "Karthic",
      updatedOn: "2024-12-03"
    }
  ];



  // dataComments: any[] = [];

  _userName: string;
  userIsInspector: any;
  searchText: string;
  street: string;
  jsonData: any;
  _personType: any[] = [];
  _currentStepIndex: number;
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
  _personTypeDataList: any[] = [];
  _serviceAreaTypeDataList: any[] = [];
  _streetTypeDataList: any[] = [];
  _streetMasterDataList: any[] = [];
  _actionListDataList: any[] = [];
  _sourceDataList: any[] = [];
  _cdbgDataList: any[] = [];
  _caseStatusTypeDataList: any[] = [];
  _taskStatusTypeDataList: any[] = [];
  _actionTypeDataList: any[] = [];
  _primaryInspectorDataList: any[] = [];
  _secondaryInspectorDataList: any[] = [];
  _violationStatusTypeDataList: any[] = [];
  _enableSave: boolean;
  _addressSearchResultDataList: any[] = [];
  _caseHistoryDataList: any[] = [];
  _viewAddressDetail: any;
  salutation: string;
  _violationDataList: any[] = [];
  _personDataList: any[] = [];
  _personErrorSummaryList: any[] = [];
  _violation: ViolationDataViewModel;
  _caseHistoryList: any[];
  _inspectorList: any[] = [];
  _caseViolationDataList: any[] = [];
  // Version
  _personVersion: number;
  _violationVersion: number;
  _selectedViolationID: number;
  _actionVersion: number;
  _actionFileContentAsString: string;
  _actionFileName: string;
  _pictureFileName: string;
  imgData: any;
  audioData: any;
  videoData: any;
  _imageBaseURL: string;
  _pictureDescription: string;
  _audioDescription: string;
  _videoDescription: string;
  pictures: any[] = [];
  _caseStatus: CaseStatusState[] = [];
  audios: any[] = [];
  videos: any[] = [];
  _caseTitle: string;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtCaseHistoryTrigger: Subject<any> = new Subject<any>();
  dtActionOptions: DataTables.Settings = {};
  dtActionTrigger: Subject<any> = new Subject<any>();
  _canChangeStatus: boolean = false;
  notedetails = [
    { id: 1, notes: 'Initial meeting with client', status: 'Completed', createdBy: 'Vivek', isActive: true, createdDate: '2024-01-15' },
    { id: 2, notes: 'Follow-up on project progress', status: 'Pending', createdBy: 'Jane Smith', isActive: false, createdDate: '2024-01-18' },
    { id: 3, notes: 'Approval of design documents', status: 'In Progress', createdBy: 'Alice Johnson', isActive: true, createdDate: '2024-01-20' },
    { id: 4, notes: 'Discussion on budget allocation', status: 'Completed', createdBy: 'Robert Brown', isActive: false, createdDate: '2024-01-25' },
    { id: 5, notes: 'Team brainstorming session', status: 'Scheduled', createdBy: 'Emily Davis', isActive: true, createdDate: '2024-02-01' },
    // { id: 6, notes: 'Client feedback review', status: 'Pending', createdBy: 'Michael Scott', isActive: true, createdDate: '2024-02-03' },
    // { id: 7, notes: 'Prepare project timeline', status: 'In Progress', createdBy: 'Angela Martin', isActive: false, createdDate: '2024-02-10' },
    // { id: 8, notes: 'Budget approval meeting', status: 'Completed', createdBy: 'Dwight Schrute', isActive: true, createdDate: '2024-02-15' },
    // { id: 9, notes: 'Finalize contract details', status: 'Scheduled', createdBy: 'Pam Beesly', isActive: false, createdDate: '2024-02-18' },
    // { id: 10, notes: 'Review quality assurance report', status: 'Completed', createdBy: 'Oscar Martinez', isActive: true, createdDate: '2024-02-20' },
    // { id: 11, notes: 'Discuss vendor agreements', status: 'Pending', createdBy: 'Stanley Hudson', isActive: false, createdDate: '2024-02-25' },
    // { id: 12, notes: 'Evaluate risk assessment', status: 'In Progress', createdBy: 'Ryan Howard', isActive: true, createdDate: '2024-03-01' },
    // { id: 13, notes: 'Plan marketing strategy', status: 'Scheduled', createdBy: 'Kelly Kapoor', isActive: false, createdDate: '2024-03-05' },
    // { id: 14, notes: 'Onboard new team members', status: 'Completed', createdBy: 'Andy Bernard', isActive: true, createdDate: '2024-03-10' },
    // { id: 15, notes: 'Weekly project update', status: 'Pending', createdBy: 'Phyllis Vance', isActive: false, createdDate: '2024-03-12' },
    // { id: 16, notes: 'Finalize presentation slides', status: 'In Progress', createdBy: 'Jim Halpert', isActive: true, createdDate: '2024-03-15' },
    // { id: 17, notes: 'Kickoff meeting with stakeholders', status: 'Completed', createdBy: 'Karen Filippelli', isActive: false, createdDate: '2024-03-18' },
  ];


  constructor(private _http: HttpClient, private _fb: FormBuilder, private _urlConstant: APIURLConstant, private _complaintServiceCall: ComplaintService, private router: Router, private _activatedRoute: ActivatedRoute, private renderer: Renderer2, private elRef: ElementRef) {

  }

  ngOnInit() {
    this.formattedDate = this.today.toISOString().split('T')[0];
    jQuery('#currentDateInput').val(this.formattedDate).trigger('change');
    this._personErrorSummaryList = [];
    this._violationErrorSummary = [];



    this.dtoptions = {
      //pagingType: 'full_numbers',
      paging: true,

      //dom: "<'top'<'col-sm-12'tr>>'row'<'col-sm-6'B><'col-sm-6'f<'row'<'col-sm-12'tr>><'row'<'col-sm-4'l><'col-sm-8'p>>",
      responsive: true
    }
    this.dtActionOptions = {
      pagingType: 'full_numbers',
      // pageLength: 25,
      // lengthMenu: [25, 50, 75, 100],
      processing: true,

      columnDefs: [{
        "defaultContent": "-",
        "targets": "_all"
      }],



    }
    this._pictureDescription = "";
    this._audioDescription = "";
    this._videoDescription = "";
    this._pictureFileName = "";
    this._caseTitle = "New Complaint"
    this._imageBaseURL = this._urlConstant.APIBaseURL + this._urlConstant.CaseMasterModule + this._urlConstant.streamFileForActionFile + "?"
    jQuery('#nextPersonBtn').hide();
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true
    })
    this.resetSearchViewModel();
    this.resetCaseAddressViewModel();
    this.resetCasePersonViewModel();
    this.resetCaseDetailViewModel();
    this.resetViolationViewModel();
    this.resetActionLogViewModel();
    this.resetCitationViewModel();
    this.resetActionLogTypeViewModel();
    this.resetActionLogAppointmentViewModel();
    this.resetFollowUpActionLogViewModel();
    this.loadMasterData();
    jQuery("#violation-list").show();
    jQuery("#violation-add-edit").hide();
    jQuery("#addOrEditPerson").hide();
    jQuery("#addOrEditViolation").hide();
    jQuery("#addOrEditAction").hide();
    jQuery("#action-add-edit").hide();
    jQuery("#actionGrid").show();
    jQuery("#frmActionLog").show();



    this.salutation = "";
    this.view(1);
    this._caseAddressId = -1;
    this._caseId = 0;
    this._currentStepIndex = 1;
    this.searchText = "";
    this._enableSave = false;
    this._activatedRoute.queryParamMap.subscribe((q: any) => {
      var lowerParams = this.toLower(q.params);
      var caseid = lowerParams['caseid'];
      if (caseid != null && caseid != undefined)
        this.getCaseByID(lowerParams['caseid']);
      else
        this.Initializecaseselect();

    })

    jQuery('#single-select-optgroup-field').select2({
      theme: "bootstrap-5",
      width: jQuery(this).data('width') ? jQuery(this).data('width') : jQuery(this).hasClass('w-100') ? '100%' : 'style',
      placeholder: jQuery(this).data('placeholder'),
    });

    if (localStorage.getItem("nc") == "yes") {
      localStorage.setItem("nc", "no");
      location.reload()
    }
    if (localStorage.getItem("user") != undefined) {
      this._user = JSON.parse(localStorage.getItem('user'));
      console.log(this._user.name);
    }

    this._userName = this._user.name
    this.initializeNoteTable();

    let self: any = this;

    this._personTable = jQuery('#personTable').DataTable({
      columns: [
        { data: 'personType' },
        { data: 'firstName' },
        { data: 'relationShip' },
        { data: 'address1' },
        { data: 'email' },
        { data: 'phone1' }
      ],
      columnDefs: [
        {
          targets: 0,
          data: 'personType',
          render: function (data: any, type: any, row: any, meta: any) {
            return self.getMasterData(self._urlConstant.PersonType, data);
          }
        },
        {
          targets: 1,
          data: 'firstName',
          render: function (data: any, type: any, row: any, meta: any) {
            return `${row.firstname} ${row.middlename} ${row.lastname}`;
          }
        },
        {
          targets: 2,
          data: 'relationship',
          render: function (data: any, type: any, row: any, meta: any) {
            return self.getMasterData(self._urlConstant.RelationshipType, row.relationship);
          }
        },
        {
          targets: 3,
          data: 'relationship',
          render: function (data: any, type: any, row: any, meta: any) {
            return `${self.getString(row.address1)} ${self.getString(row.address2)} ${self.getString(row.city)}`;
          }
        },
        {
          targets: 4,
          data: 'email',
          render: function (data: any, type: any, row: any, meta: any) {
            if (!self.isNull(row.email))
              return `<a href="mailto:${row.email}">${row.email}</a>`;
            else
              return "";
          }
        }
        ,
        {
          targets: 5,
          data: 'phone1',
          render: function (data: any, type: any, row: any, meta: any) {
            if (!self.isNull(row.phone1))
              return `<a href="tel:${row.phone1}">${row.phone1} ${self.getMasterData(self._urlConstant.PhoneType, row.phone1type)}</a>`;
            else
              return "";
          }
        }

      ]
    });

    this._personTable.on('click', 'tbody tr', (e: any) => {
      let classList = e.currentTarget.classList;

      if (classList.contains('selected')) {
        classList.remove('selected');
      }
      else {
        self._personTable.rows('.selected').nodes().each((row: any) => row.classList.remove('selected'));
        classList.add('selected');
      }
    });
    jQuery('.selectcontrol1').select2({ width: '100%' });
    // jQuery('.selectcontrol').select2({ width: '100%' });
    this._primaryInspectorAssignment = "";
    this._secondaryInspectorAssignment = "";
    this.resetMockViewModel();
    const url: string = "/assets/MOCK_DATA.json";
    jQuery("#caseHistoryReport").hide();
    jQuery("#propertyAndCaseHistory").hide();
    //jQuery("#addressInfo").hide();
    jQuery("#registeredCases").hide();



    jQuery('#receiveddate').prop('max', new Date().toISOString().split("T")[0]);
    jQuery('#cudate').prop('min', new Date().toISOString().split("T")[0]);
    jQuery('#opendate').prop('max', new Date().toISOString().split("T")[0]);
    jQuery('#closedate').prop('min', new Date().toISOString().split("T")[0]);
    jQuery('#duedate').prop('min', new Date().toISOString().split("T")[0]);
    this._http.get(url).subscribe((response) => {
      this.userProfileDataList = response;
    });
    jQuery(document).ready(() => {
      const minLen = this.dataComments.length;

      $('#violationTbl tbody').on('mouseenter mouseleave', 'tr', function (event) {
        const $currentRow = $(this); // The row currently being hovered over

        // Check if the row is a test-row or a main row
        if ($currentRow.hasClass('test-row')) {
          // If it's a test-row, get the previous main row
          const $prevRow = $currentRow.prev('tr');

          if (event.type === 'mouseenter') {
            $currentRow.addClass('row-hover'); // Add hover effect to test-row
            $prevRow.addClass('row-hover');
            $currentRow.addClass('selected'); // Add hover effect to test-row
            $prevRow.addClass('selected'); // Add hover effect to main row
          } else if (event.type === 'mouseleave') {
            $currentRow.removeClass('row-hover'); // Add hover effect to test-row
            $prevRow.removeClass('row-hover');
            $currentRow.removeClass('selected'); // Remove hover effect from test-row
            $prevRow.removeClass('selected'); // Remove hover effect from main row
          }
        } else {
          // If it's a main row, get the next test-row
          const $nextRow = $currentRow.next('.test-row');

          if (event.type === 'mouseenter') {
            $currentRow.addClass('row-hover'); // Add hover effect to test-row
            $nextRow.addClass('row-hover');
            $currentRow.addClass('selected'); // Add hover effect to main row
            $nextRow.addClass('selected'); // Add hover effect to test-row
          } else if (event.type === 'mouseleave') {
            $currentRow.removeClass('selected'); // Remove hover effect from main row
            $nextRow.removeClass('selected'); // Remove hover effect to test-row
          }
        }
      });

    });
  }

  toLower(params: Params): Params {
    const lowerParams: Params = {};
    for (const key in params) {
      lowerParams[key.toLowerCase()] = params[key];
    }

    return lowerParams;
  }

  InitializeViolation() {
    jQuery('#violationstatus').val(this._caseViolationViewModel.violationstatus).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#violationstatus').next('.select2-container').addClass('focused');
    }).on('change', (event: any) => {
      if (event.target.value === 'C') {

        this.isCaseDetailStatus = false;
      }
    }).on('select2:close', (event: any) => {
      jQuery('.select2-container').removeClass('focused');
    });
    jQuery('#priority').val(this._caseViolationViewModel.priority).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#priority').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('.select2-container').removeClass('focused');
    });
    jQuery('#area').val(this._caseViolationViewModel.area).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#area').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('.select2-container').removeClass('focused');
    });
  }

  InitializeActionLog() {
    jQuery('#actionCode').val(this._actionLogViewModel.actionCode).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#actionCode').next('.select2-container').addClass('focused');
    }).on('change', (event: any) => {
      this.actionOnChange(event);
    }).on('select2:close', (event: any) => {
      jQuery('#actionCode').next('.select2-container').removeClass('focused');
    });
    jQuery('#actionType').val(this._actionLogViewModel.actionType).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#actionType').next('.select2-container').addClass('focused');
    }).on('change', (event: any) => {
      this.categoryOnChange(event);
    }).on('select2:close', (event: any) => {
      jQuery('#actionType').next('.select2-container').removeClass('focused');
      this.salutationFocusoutEvent('Salutation is required')
    });
    jQuery('#routeToInspectorId').val(this._actionLogViewModel.routeToInspectorId).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#routeToInspectorId').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#routeToInspectorId').next('.select2-container').removeClass('focused');
      this.salutationFocusoutEvent('Salutation is required')
    });
  }

  InitializePersonModel() {
    jQuery("#salutation").val(this._casePersonViewModel.salutation).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#salutation').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#salutation').next('.select2-container').removeClass('focused');
      this.salutationFocusoutEvent('Salutation is required')
    });
    jQuery("#personType").val(this._casePersonViewModel.personType).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#personType').next('.select2-container').addClass('focused');
    }).on('change', (event: any) => {
      this.personTypeChanged(event);
    }).on('select2:close', () => {
      jQuery('#personType').next('.select2-container').removeClass('focused');
      this.personTypeFocusoutEvent('Person Type is required')
    });

    jQuery('#relationship').val(this._casePersonViewModel.relationship).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#relationship').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#relationship').next('.select2-container').removeClass('focused');
      const fieldName = jQuery(event.target).attr('name');
      const fieldValue = jQuery(event.target).val();
      this.focusoutRelation(fieldName, fieldValue); // Call your focusout method here
    });
  }

  Initializecaseselect() {
    jQuery("#streetType").select2({}).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#streetType').next('.select2-container').addClass('focused');
    });
    jQuery("#programcode").val(this._caseDetailViewModel.programcode || '').select2({ width: '100%' }).on('change', (event: any) => {
      this.onProgramCodeChange(event);

    }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#programcode').next('.select2-container').addClass('focused');
    })
      .on('select2:close', (event: any) => {
        jQuery('#programcode').next('.select2-container').removeClass('focused');
        const fieldName = jQuery(event.target).attr('name');
        const fieldValue = jQuery(event.target).val();
        this.focusoutMethod(fieldName, fieldValue); // Call your focusout method here
      });
    jQuery('#sourcecode').val(this._caseDetailViewModel.sourcecode).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#sourcecode').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#sourcecode').next('.select2-container').removeClass('focused');
      const fieldName = jQuery(event.target).attr('name');
      const fieldValue = jQuery(event.target).val();
      this.focusoutMethod(fieldName, fieldValue); // Call your focusout method here
    });
    jQuery('#inspector1id').val(this._caseDetailViewModel.inspector1id).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#inspector1id').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#inspector1id').next('.select2-container').removeClass('focused');
    });
    jQuery('#inspector2id').val(this._caseDetailViewModel.inspector2id).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#inspector2id').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#inspector2id').next('.select2-container').removeClass('focused');
    });
    jQuery('#dispositioncode').val(this._caseDetailViewModel.dispositioncode).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#dispositioncode').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#dispositioncode').next('.select2-container').removeClass('focused');
      const fieldName = jQuery(event.target).attr('name');
      const fieldValue = jQuery(event.target).val();
      this.focusoutMethod(fieldName, fieldValue); // Call your focusout method here
    });
    jQuery('#coreservicecode').val(this._caseDetailViewModel.coreservicecode).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#coreservicecode').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#coreservicecode').next('.select2-container').removeClass('focused');
      const fieldName = jQuery(event.target).attr('name');
      const fieldValue = jQuery(event.target).val();
      this.focusoutMethod(fieldName, fieldValue); // Call your focusout method here
    });
    jQuery('#cdbgcasetype').val(this._caseDetailViewModel.cdbgcasetype).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#cdbgcasetype').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#cdbgcasetype').next('.select2-container').removeClass('focused');
    });
    jQuery('#prioritycode').val(this._caseDetailViewModel.prioritycode).select2({ width: '100%' }).on('select2:open', () => {
      // Add a class to the select2 container when opened (focused)
      jQuery('#prioritycode').next('.select2-container').addClass('focused');
    }).on('select2:close', (event: any) => {
      jQuery('#prioritycode').next('.select2-container').removeClass('focused');
      const fieldName = jQuery(event.target).attr('name');
      const fieldValue = jQuery(event.target).val();
      this.focusoutMethod(fieldName, fieldValue); // Call your focusout method here
    });

  }

  initializeStaticTable() {
    if (!this.caseViolationDetails || this.caseViolationDetails.length === 0) {
      console.error('No data available in caseViolationDetails');
      return;
    }

    const cols = [
      {
        data: " ", // No specific data field for checkboxes
        render: function (data: any, type: any, row: any, meta: any) {
          return `<input type="checkbox" class="row-checkbox" data-id="${row.id}" />`;
        },
        orderable: false,
        className: 'dt-center', // Align checkbox to the center
      },
      { data: "violation", title: "Violation Category" },
      { data: "description", title: "Short Description" },
      { data: "status", title: "Status" },
    ];

    // Destroy the table if it already exists to avoid re-initialization issues
    if (jQuery.fn.DataTable.isDataTable('#tblinputdata')) {
      jQuery('#tblinputdata').DataTable().clear().destroy();
    }

    jQuery('#tblinputdata').DataTable({
      data: this.caseViolationDetails, // Use dynamic data from this.caseViolationDetails
      columns: cols,
      paging: true,
      autoWidth: false,
      responsive: true,
      // scrollX: true,
      columnDefs: [
        { width: "5%", targets: 0 }, // Set the width of the checkbox column to 5%
        { width: "25%", targets: 1 }, // Set the width of the category column
        { width: "40%", targets: 2 }, // Set the width of the description column
        { width: "25%", targets: 3 }, // Set the width of the status column
        { className: "dt-left", targets: "_all" },
      ],
      initComplete: function () {
        const api = new jQuery.fn.dataTable.Api(this);
        api.columns().eq(0).each((colIdx: any) => {
          const cell = jQuery('.filters th').eq(colIdx);
          console.log(cell);
          const title = jQuery(api.column(colIdx).header()).text();
          console.log(title);
          jQuery(cell).html('<input type="text" placeholder="Search ' + title + '" />');
          jQuery('input', cell).on('keyup change', () => {
            const inputValue = jQuery(this).val();
            if (api.column(colIdx).search() !== inputValue) {
              api.column(colIdx).search(inputValue).draw();
            }
          });
        });

      },
    });
  }

  changeCUDate() {
    if (!this._caseDetailViewModel.cudate) {
      alert('Cannot remove the C/U Date!')
      this._caseDetailViewModel.cudate = this.pastCUDate
    }
    else if (this.pastCUDate) {
      if (this._caseDetailViewModel.cudate > this.formattedDate) {
        jQuery('#cuDateModal').modal("show");
      }
    }
  }


  initializeNoteTable(): void {
    if (!this.notedetails || this.notedetails.length === 0) {
      console.error('No data available in notedetails');
      return;
    }

    // Cache the context variables to ensure they are accessible inside the function
    this.userIsInspector = this._user.role.rolename === "Inspector"

    const userName = this._userName;

    // Filter the data based on the condition
    const filteredData = this.notedetails.filter(row => row.createdBy === userName);

    console.log(filteredData);

    const cols = [
      { data: "id", title: "ID" },
      { data: "notes", title: "Notes" },
      {
        data: " ",
        title: "Status",
        render: (data: any, type: any, row: any) => {
          const buttonText = row.isActive ? 'Inactive' : 'Active';
          return `<button class="toggle-button btn-primary" data-id="${row.id}">${buttonText}</button>`;
        },
      },
      { data: "createdBy", title: "Created By" },
      { data: "createdDate", title: "Date" },
      {
        data: " ",
        render: (data: any, type: any, row: any) => {
          const isDisabled = this.userIsInspector ? 'disabled' : '';
          return `<button class="tgl-btn btn-danger" id=delbtn data-id="${row.id}" ${isDisabled}>Delete</button>`;
        },
      },

    ];

    // Destroy the table if it already exists
    if (jQuery.fn.DataTable.isDataTable('#tblnotes')) {
      jQuery('#tblnotes').DataTable().clear().destroy();
    }

    // Initialize the DataTable
    const table = jQuery('#tblnotes').DataTable({
      data: this.userIsInspector ? filteredData : this.notedetails, // Use the filtered data
      columns: cols,
      paging: true,
      autoWidth: false,
      responsive: true,
      columnDefs: [
        { width: "5%", targets: 0 },
        { width: "65%", targets: 1 },
        { width: "10%", targets: 2 },
        { width: "10%", targets: 3 },
        { width: "15%", targets: 4 },
        { className: "dt-left", targets: "_all" },
      ],
    });

    // Add event listener for toggle functionality
    jQuery('#tblnotes').on('click', '.toggle-button', (event: any) => {
      const button = jQuery(event.currentTarget);
      const rowId = parseInt(button.data('id'), 10);

      // Toggle active state in notedetails
      const rowIndex = this.notedetails.findIndex((item: any) => item.id === rowId);
      if (rowIndex !== -1) {
        this.notedetails[rowIndex].isActive = !this.notedetails[rowIndex].isActive;

        // Update the row in DataTable
        table.row(button.parents('tr')).data(this.notedetails[rowIndex]).draw(false);
      }
    });
    jQuery('#tblnotes').off('click', '#delbtn').on('click', '#delbtn', (event: any) => {
      const button = jQuery(event.currentTarget);
      const rowId = parseInt(button.data('id'), 10);

      // Call the deleteData function
      this.deleteData(rowId);
    });
  }


  showCommentsModal() {
    const offcanvasElement = jQuery('#showComments');
    if (offcanvasElement) {
      const bootstrapModal = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
      // Show the offcanvas
      bootstrapModal.show();
    }
  }

  deleteData(rowId: any) {
    this.notedetails = this.notedetails.filter((row) => row.id !== rowId)
    this.initializeNoteTable();
  }

  changeCheck() {
    if (!this._caseViolationViewModel.duedate) {
      alert('Cannot remove the Due Date!')
      this._caseViolationViewModel.duedate = this.pastDate
    }
    else if (this.pastDate) {
      if (this._caseViolationViewModel.duedate > this.formattedDate) {
        jQuery('#dueDateComments').modal("show");
      }
    }
  }

  closeReason(title: any) {
    if(title === 'dueDate'){
    this._caseViolationViewModel.duedate = this.pastDate
    jQuery('#dueDateComments').modal("hide");
    }

    else if(title === 'cuDate')
    {
      this._caseDetailViewModel.cudate = this.pastCUDate
      jQuery('#cuDateModal').modal("hide");
    }
  }

  saveReason(title: any) {
    if (title === 'cuDate')
    {
      this.cuReason = jQuery('#cuDateReason').val().trim();
      if (this.cuReason) {
        this.pastCUDate = this._caseDetailViewModel.cudate
        jQuery('#cuDateModal').modal("hide");
        jQuery('#cuDateComments').html(`<strong>Reason for Due Date Change:</strong> ${this.cuReason}`)
      }
      else
        jQuery('#cu-reason-mandate').html("Kindly fill the Reason for CU Date Change")
    }
      
    else if (title === 'dueDate') {
      this.dueReason = jQuery('#dueDateReason').val().trim();
      if (this.dueReason) {
        this.pastDate = this._caseViolationViewModel.duedate
        jQuery('#dueDateComments').modal("hide");
      }
      else
        jQuery('#reason-mandate').html("Kindly fill the Reason for Due Date Change")
    }
  }

  InitializeViolationTable() {
    console.log('Initialize Violation Table');
    let self = this;

    if (!this._violationTable) {
      this._violationTable = jQuery('#violationTbl').DataTable({
        columns: [
          { data: "id" },
          { data: 'violation' },
          { data: 'municode' },
          { data: 'correctiveaction' },
          {
            data: 'violationstatus',
            render: function (data: any) {
              return data ? self.getViolationStatusName(data) : "";
            }
          },
          {
            render: function (data: any, type: any, row: any) {
              return `<button class="btn custom-btn btn-sm" data-name="${row.id}">Edit / View</button>`;
            }
          }
        ],
        rowCallback: (row: any, data: any, index: any) => {
          const actionsColumnIndex = 5; // Assuming Action column is the 6th column (0-based index)

          if (this.dataComments.length > 0) {
            jQuery(row).on('click', (event: any) => {
              const clickedColumnIndex = jQuery(event.target).closest('td').index();
              if (clickedColumnIndex !== actionsColumnIndex) {
                this.showCommentsModal();
              }
            });

            const offcanvasElement = document.getElementById('showComments');
            jQuery(offcanvasElement).on('hide.bs.offcanvas', function () {
              jQuery(row).removeClass('selected');
            });
          }
        }
      });

      // Add short description rows dynamically after every draw
      this._violationTable.on('draw', () => {
        this.addShortDescriptionRows();
      });
    }

    jQuery('#violationTbl').on('click', 'button', function (e: any) {
      console.log(e.target.dataset.name);
      self.editViolationfromTable(e.target.dataset.name);
    });

    if (this._violationTable) {
      if (this._caseDetail.caseViolation) {
        this._violationTable.clear().rows.add(this._caseDetail.caseViolation).draw();
      }
    }

    // Button click event for the table

  }


  addShortDescriptionRows() {
    // Iterate through each row in the table
    this._violationTable.rows().every((index: number) => {
      const rowData = this._violationTable.row(index).data(); // Get row data
      const rowNode = this._violationTable.row(index).node(); // Access the row node

      // Avoid duplicate rows
      if (jQuery(rowNode).next('.test-row').length === 0) {
        const shortDescription = rowData.description || ""; // Use an empty string if no short description is available

        jQuery(rowNode).addClass('custom-data-row')
        // Insert a new row after the current row
        jQuery(rowNode).after(`
                <tr class="test-row">
                    <td colspan="6">
                        <strong>Short Description:</strong> ${shortDescription}
                    </td>
                </tr>
            `);
      }
    });
  }




  InitializeActionTable() {
    // let x: any = 0;
    console.log('Initialize Action Table');
    let self: any = this;
    if (this._actionsTable == undefined) {
      this._actionsTable = jQuery('#actionsTbl').DataTable({
        columns: [
          {
            data: "id"
          },
          {
            data: 'actionCode', render: function (data: any, row: any) {
              console.log('Action Code:', data);
              return self.getActionName(data);
            }
          },
          {
            data: 'createdOn',
            render: function (data: any, row: any, index: any) {
              if (data != undefined) {
                return self.getActionDate(data);
              } else {
                return "";
              }
            }
          },
          {
            data: 'routeToInspectorId',
            render: function (data: any, row: any) {
              return self.getInspectorName(data);
            }
          },
          {
            data: 'actionType',
            render: function (data: any, row: any, index: any) {
              let ret: string = '';
              if ((data.actionType == "A") || (data.actionType == "T")) {
                ret = 'Sub:' + row.subject
              } else if (data.actionType == "C") {
                ret = row.citiationComments
              } else {
                ret = "";
              }
              if (data?.actionType == "A") {
                ret += 'Location:' + row.location
              }
              else {
                ret += "";
              }
              return ret;
            }
          },
          {
            "render": function (data: any, type: any, row: any, meta: any) {
              console.log('row:', row);
              return '<button class="btn custom-btn btn-sm" data-name="' + row.id + '">Edit / View</button>';
            }
          }
          // {
          //   data: 'actions',
          //   render: function (data: any, row: any) {
          //     return "<button id=\"btnEdit\" class=\"btn custom-btn btn-sm\"(click)=editViolation(row) > Edit / View </button>"
          //   }
          // }
          // {
          //   data: null,
          //   defaultContent: '<button>Click!</button>',
          //   targets: -1,
          //   render: function (data: any, row: any) {
          //     self.editViolationfromTable(row.id);
          //   }
          // }
        ],
        columnDefs: [
          { className: 'dt-left', targets: "_all" }
        ]
      });
      this._actionsTable.on('draw', () => {
        this.addComments();
      });

    }
    // console.log('Actions:', JSON.stringify(this._caseDetail.caseActions[0]));
    if (this._actionsTable != undefined) {
      if (this._caseDetail.caseActions != undefined) {
        this._actionsTable.clear().rows.add(this._caseDetail.caseActions).draw();
        this._actionsTable.draw();
      }
    }
    jQuery('#actionsTbl').on('click', 'button', function (e: any) {
      console.log(e.target.dataset.name);
      self.editActionfromTable(e.target.dataset.name);
      self.actionOnChange(null);
    });
  }

  addComments() {
    this._actionsTable.rows().every((index: number) => {
      const rowData = this._actionsTable.row(index).data(); // Get row data
      const rowNode = this._actionsTable.row(index).node(); // Access the row node

      // Avoid duplicate description rows
      if (jQuery(rowNode).next('.comment-test-row').length === 0) {
        const comments = rowData.comments || ""; // Use an empty string if 'description' is not defined

        jQuery(rowNode).addClass('custom-data-row');
        // Insert a new row after the current row with the 'description' data
        jQuery(rowNode).after(`
                  <tr class="comment-test-row">
                      <td colspan="6"><strong>Comments - </strong>${comments}</td>
                  </tr>
              `);
      }
    });
  }

  ngAfterViewInit() {
    jQuery(document).on('click', '.dynamic-link', (event: any) => {
      event.preventDefault(); // Prevent default anchor behavior
      this.showCommentsModal();
    });
    this.InitializeViolationTable();
    this.InitializeActionTable();
    this.dtCaseHistoryTrigger.next(null);

    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.on('draw.dt', function () {
    //     if (jQuery('#DataTables_Table_0').length > 0) {
    //       jQuery('#DataTables_Table_0').remove();
    //     }
    //   });
    // });
  }
  getString(obj: any) {
    if (this.isNull(obj))
      return "";
    else
      return obj;
  }
  loadCaseHistory() {
    let opt: any = {
      "apn": [this._viewAddressDetail.apn]
    };
    this._complaintServiceCall.searchByObjectParameter(this._urlConstant.CaseMasterModule, this._urlConstant.Search, opt).subscribe((response) => {

    });
  }
  loadMasterData() {
    this._masterDataList = [];
    this._complaintServiceCall.get(this._urlConstant.CategoryModule, this._urlConstant.GetAll).subscribe((response) => {
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
      this._personTypeDataList = [];
      this._sourceDataList = [];
      this._caseStatusTypeDataList = [];
      this._taskStatusTypeDataList = [];
      this._masterDataList.forEach(e => {
        if (e.status) {
          switch (e.category) {
            case this._urlConstant.CaseStatusType:
              this._caseStatusTypeDataList.push(e);
              break;
            case this._urlConstant.SourceType:
              this._sourceDataList.push(e);
              break;
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
            case this._urlConstant.PersonType:
              this._personTypeDataList.push(e);
              this._personType.push(e.value);
              break;
            case this._urlConstant.CBDGType:
              this._cdbgDataList.push(e);
              break;
            case this._urlConstant.ActionType:
              this._actionTypeDataList.push(e);
              break;
            case this._urlConstant.ViolationStatusType:
              this._violationStatusTypeDataList.push(e);
              break;
            case this._urlConstant.TaskStatus:
              this._taskStatusTypeDataList.push(e);
              break;
          }
        }
      });
      // console.log(JSON.stringify(this._cdbgDataList));
    });

    this._complaintServiceCall.get(this._urlConstant.StreetMasterModule, this._urlConstant.GetAll).subscribe((response) => {
      this._streetMasterDataList = [];
      if (response.status == "SUCCESS") {
        this._streetMasterDataList = response.data;
      } else {
        console.log("Unable to receive Street Master Data : " + response.errorMessage)
      }
    });
    this._complaintServiceCall.get(this._urlConstant.CaseDataModule, this._urlConstant.CaseStatus).subscribe((response) => {
      this._caseStatus = [];
      if (response.status == "SUCCESS") {
        this._caseStatus = response.data;
      } else {
        console.log("Unable to receive Case Status : " + response.errorMessage)
      }
    });

    this._complaintServiceCall.get(this._urlConstant.ActionModule, this._urlConstant.GetAll).subscribe((response) => {
      this._actionListDataList = [];
      if (response.status == "SUCCESS") {
        this._actionListDataList = response.data;
      } else {
        console.log("Unable to receive Street Master Data : " + response.errorMessage)
      }
    });

    this._complaintServiceCall.get(this._urlConstant.ViolationTypeModule, this._urlConstant.GetAll).subscribe((response) => {
      this._violationDataList = [];
      this._violationDataList = response.data;
      this.jsonData = [];
      this._violationDataList.forEach(e => {
        this._violation = {
          text: "",
          children: []
        }
        let violationChildDataList = [];
        violationChildDataList = e.violations;
        this._violation.text = e.violationdescr;
        violationChildDataList.forEach((e1: any) => {
          return this._violation.children.push({ "id": e1.id, "text": e1.municipalcode + " " + e1.shortdesc });
        });
        this.jsonData.push({
          "text": e.violationdescr, "children": this._violation.children
        });
        //console.log("JSONData : " + JSON.stringify(this.jsonData));
      });
      let vsid = 0;
      this._selectedViolationID = vsid;
      let self = this;
      jQuery('#violationList')
        .on("changed.jstree", function (e: any, data: any) {
          if (data.selected.length) {
            //            vsid = data.instance.get_node(data.selected[0]).id;
            //jQuery("#_selectedViolationID").val(data.instance.get_node(data.selected[0]).id);
            // alert('The selected node is: ' + data.instance.get_node(data.selected[0]).id);
            if (self.canEdit()) {
              self.onViolationSelection(data.instance.get_node(data.selected[0]).id);
            } else {
              alert('Cannot edit violation for case status : ' + self.getStatusDesc(self._caseDetail.casestatus))
            }
          }
        })
        .jstree({
          'core': {
            'multiple': false,
            'data': this.jsonData
          }, 'search': {
            'show_only_matches': true,
            'show_only_matches_children': true
          },
          "plugins": ["search"]
        });

      jQuery('#inspectionViolationList')
        .on("changed.jstree", function (e: any, data: any) {
          if (data.selected.length && self.canEdit()) {
            //            vsid = data.instance.get_node(data.selected[0]).id;
            //jQuery("#_selectedViolationID").val(data.instance.get_node(data.selected[0]).id);
            // alert('The selected node is: ' + data.instance.get_node(data.selected[0]).id);
            self.onViolationSelection(data.instance.get_node(data.selected[0]).id);
          }
        })
        .jstree({
          'core': {
            'multiple': false,
            'data': this.jsonData
          }, 'search': {
            'show_only_matches': true,
            'show_only_matches_children': true
          },
          "plugins": ["search"]
        });



    });

    this._complaintServiceCall.get(this._urlConstant.UserDataModule, this._urlConstant.GetAllInspector).subscribe((response) => {
      this._inspectorList = [];
      this._inspectorList = response.data;
    });
  }
  getProgramName(c: string) {
    var pg = this._programTypeDataList.find(x => x.code == c);
    if (pg == undefined || pg == null) {
      return "";
    }
    return pg.value;
  }
  getViolationStatusName(c: string) {
    var pg = this._violationStatusTypeDataList.find(x => x.code == c);
    if (pg == undefined || pg == null) {
      return "";
    }
    return pg.value;
  }
  getStatusDesc(status: any) {
    var st = this._caseStatusTypeDataList.find(c => c.code == status);
    if (st == undefined || st == null)
      return "";
    else
      return st.value;
  }
  isNull(d: any) {
    return d == null || d == undefined;
  }
  openImage() {
    alert("Okay . . . ")
  }
  canEdit(): any {
    var ret = false;
    if (this._user.role.id == this._urlConstant.ViewOnlyRole)
      return false;
    this._urlConstant.CaseEditStatus.forEach(element => {
      if (this._caseDetail != undefined && element == this._caseDetail.casestatus)
        ret = true;
    });
    return ret;
  }
  canChangeStatus(): any {
    this._canChangeStatus = false;
    if (!this.canEdit() && this._caseDetail.casestatus != this._urlConstant.CaseApprovalStatus)
      return false;

    if (this._caseDetail.programcode == null)
      return false;
    if (this._caseDetail.casestatus == this._urlConstant.CaseApprovalStatus && this._user.role.id != this._urlConstant.SupervisorRole)
      return false;
    this._canChangeStatus = true;
    return true;
  }
  getStatus(): any {
    var _d: any[] = [];
    var _to: string[] = [];
    if ((this._caseStatus != undefined) && (this._caseDetail != undefined)) {
      this._caseStatus.forEach(e => {
        if (e.fromstatus == this._caseDetail.casestatus) {
          _to.push(e.tostatus);
        }
      });
      this._caseStatusTypeDataList.forEach(element => {
        if (element.code == this._caseDetail.casestatus) {
          _d.push(element);
        } else {
          _to.forEach(x => {
            if (x == element.code) {
              _d.push(element);
            }
          });
        }
      });
    }
    return _d;
  }
  getCaseByID(id: any) {

    this._complaintServiceCall.getByModuleMethodAndParameter(this._urlConstant.CaseMasterModule, this._urlConstant.GetByID, "id=" + id).subscribe((response) => {
      this._caseHistoryList = [];
      if (response.status == "SUCCESS") {
        this._caseTitle = "Edit Complaint";
        // console.log("Case Detail : " + JSON.stringify(response));
        this._caseDetail = response.data[0];
        this.caseViolationDetails = response.data[0].caseViolation;
        // console.log("Total Count : " + this._caseDetail?.caseActions.length);
        if (JSON.stringify(this._caseDetail).includes("caseaddress")) {
          this._viewAddressDetail = response.data[0].caseaddress;
        }

        jQuery(".tab-page").removeAttr("disabled");
        Lobibox.notify('success', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Case Loaded Successfully. Case ID = ' + id
        });
        this._personDataList = response.data[0].casePerson;
        this._caseId = response.data[0].id;
        // this._caseAddressId = response.data[0].caseaddress.id;
        this._enableSave = true;
        this._personTable.clear().rows.add(this._personDataList).draw();
        this._personTable.draw();
        this.InitializeViolationTable();
        this.InitializeActionTable();
        this.resetCaseDetailViewModel();
        this._caseDetailViewModel = this._caseDetail;
        this.pastCUDate = this._caseDetailViewModel.cudate;
        jQuery('#createCaseBtn').hide();
        jQuery('#nextPersonBtn').show();
        this.dtTrigger.next(null);
        this.dtActionTrigger.next(null);

        this.canChangeStatus();
      } else {
        console.log("Unable to receive Case Address : " + response.errorMessage)
      }

      this.Initializecaseselect()
    });
  }

  getActionName(code: string) {
    let item: any = this._actionListDataList.filter((itm) => (itm.actionCode == code))
    // console.log("Item " + JSON.stringify(item));
    if ((item != null) && (item.length > 0)) {
      return item[0]?.actionDescription;
    } else {
      return "";
    }
  }

  getInspectorName(id: number) {
    let item: any = this._inspectorList.filter((itm) => (itm.id == id))
    if (item != null && item.length > 0) {
      return item[0].name;
    } else {
      return "";
    }
  }


  getMasterData(category: String, value: String) {
    let x: any = this._masterDataList.find((c: any) => c.category == category && c.code == value);
    if (x != null)
      return x.value;
    return value;
  }
  showActionComments(id: any) {
    if (jQuery("#row" + id).hasClass("d-none")) {
      jQuery("#row" + id).removeClass("d-none");
    } else {
      jQuery("#row" + id).addClass("d-none");
    }
  }
  onViolationSelection(selectedID: any) {
    this._selectedViolationID = selectedID;
    this._violationDataList.forEach(e => {
      let violationChildDataList = [];
      violationChildDataList = e.violations;
      violationChildDataList.forEach((e1: any) => {
        if (e1.id == selectedID) {
          console.log("Element : " + JSON.stringify(e1));
          this._caseViolationViewModel.correctiveaction = e1.correctiveaction;
          this._caseViolationViewModel.violation = e1.shortdesc;
          this._caseViolationViewModel.municode = e1.municipalcode;
          this._caseViolationViewModel.description = e1.fulldesc;
          this._caseViolationViewModel.violationtype = e1.violationtypecode;
        }
      });
    });
  }

  searchAddress() {
    const streetTypeCode = jQuery('#streetType').val();
    // console.log(this._streetMasterDataList)

    let searchParameter = [];
    let callSearchAPI: boolean = false;
    if (this._searchViewModel.apartmentNumber.length > 0) {
      searchParameter.push("apartmentNumber=" + this._searchViewModel.apartmentNumber);
      callSearchAPI = true;
    }
    if (this._searchViewModel.apnNumber.length > 0) {
      searchParameter.push("apnNumber=" + this._searchViewModel.apnNumber);
      callSearchAPI = true;
    }
    /*     if (this._searchViewModel.streetName.length > 0) {
          searchParameter.push("streetName=" + this._searchViewModel.streetName);
        } */

    if (streetTypeCode.length > 0) {
      let stData: any = this._streetMasterDataList.find(x => x.id == streetTypeCode);

      searchParameter.push("streetType=" + stData.streetTypeCode);
      searchParameter.push("streetName=" + stData.streetname);
      callSearchAPI = true;
    }
    if (this._searchViewModel.streetNumber.length > 0) {
      searchParameter.push("streetNumber=" + this._searchViewModel.streetNumber);
      callSearchAPI = true;
    }
    if (callSearchAPI) {
      this.loadAddress(searchParameter.join("&"));
    } else {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Input any Search one paraemeter'
      });
      jQuery('#apnNumber').focus();
    }
  }

  selectAddress(_address: any) {
    //this._caseAddressViewModel = _address;
    this._viewAddressDetail = _address;
    jQuery("#SearchResultAddress").modal("hide");

  }
  // rerender(): void {

  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.destroy();
  //     this.dtCaseHistoryTrigger.next(null);
  //   });
  // }
  getCaseHistoryOfSelectedAddressAPN() {
    let search = {
      "apn": [
        this._viewAddressDetail.apn
      ],
      status: ["D", "O", "RO"]
    }
    this._complaintServiceCall.searchByObjectParameter(this._urlConstant.CaseMasterModule, this._urlConstant.Search, search).subscribe((response) => {
      console.log("Case History Data List : " + JSON.stringify(response));
      this._caseHistoryList = [];
      if (response.status == "SUCCESS") {
        this._caseHistoryList = response.data;
        //this.dtCaseHistoryTrigger.next(null);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtCaseHistoryTrigger.next(null);
        });

      } else {
        console.log("Unable to receive Case Address : " + response.errorMessage)
      }
    });
  }
  GetAddress(data: any) {
    console.log('Selected address Row data:', data);
  }
  selectedAddress() {
    this._caseAddressViewModel = this._viewAddressDetail;
    jQuery("#SearchResultAddress").modal("hide");
  }
  focusoutMethod(id: any, data: string) {
    console.log('Event:', event);
    if (id == 'sourcecode') {
      if (data.length <= 0) {
        this.isCaseDetailSourceCode = true;
        this.casedetailSourceCodeMessage = 'Source code is required.';
      } else {
        this.isCaseDetailSourceCode = false;
        this.casedetailSourceCodeMessage = '';
      }
    }
    if (id == 'prioritycode') {
      if (data.length <= 0) {
        this.isCaseDetailPriorityCode = true;
        this.casedetailPriorityCodeMessage = 'Priority code is required'
      } else {
        this.isCaseDetailPriorityCode = false;
        this.casedetailPriorityCodeMessage = '';
      }
    }
    if (id == 'programcode') {
      if (data.length <= 0) {
        this.isCaseDetailProgramCode = true;
        this.casedetailProgramCodeMessage = 'Program code is required'
      } else {
        this.isCaseDetailProgramCode = false;
        this.casedetailProgramCodeMessage = '';
      }
    }
    if (id == 'municode') {
      if (data.length <= 0) {
        this.isMunicodeHasData = true;
        this.municodeErrorMessage = 'Muni code is required'
      } else {
        this.isMunicodeHasData = false;
        this.municodeErrorMessage = '';
      }
    }
    if (id == 'description') {
      if (data.length <= 0) {
        this.isDescriptionHasData = true;
        this.descriptionErrorMessage = 'Violation description is required'
      } else {
        this.isDescriptionHasData = false;
        this.descriptionErrorMessage = '';
      }
    }
    if (id == 'correctiveaction') {
      if (data.length <= 0) {
        this.isCorrectiveActionHasData = true;
        this.correctiveActionErrorMessage = 'Corrective Action is required'
      } else {
        this.isCorrectiveActionHasData = false;
        this.correctiveActionErrorMessage = '';
      }
    }
    if (id == 'correctiveaction') {
      this.isCaseDetailDispositionCode = false;
      this.casedetailCoreserviceCodeMessage = '';
    }
    if (id == 'dispositioncode') {
      if (this.isCaseDetailDispositionCode) {
        if (data.length > 0) {
          this.isCaseDetailDispositionCode = false;
          this.casedetailDispositionCodeMessage = '';
        }
      }

    }
    if (id == 'coreservicecode') {
      if (this.isCaseDetailCoreserviceCode) {
        if (data.length > 0) {
          this.isCaseDetailCoreserviceCode = false;
          this.casedetailCoreserviceCodeMessage = '';
        }
      }
    }

    if (id == 'phone1type') {
      // if (this.isCaseDetailCoreserviceCode) {
      //   if (data.length > 0) {
      //     this.isCaseDetailCoreserviceCode = false;
      //     this.casedetailCoreserviceCodeMessage = '';
      //   }
      // }
    }
  }

  setUpAddressListTable(addressList: any) {
    let self: any = this;
    if ((this._addressListTbl == null) || (this._addressListTbl == undefined)) {
      this._addressListTbl = jQuery('#addressList').DataTable({
        columns: [
          { data: 'apn' },
          { data: 'ownerName' },
          { data: 'address1' },
          { data: 'district' },
          { data: 'state' },
          { data: 'zip' },
        ],
        columnDefs: [
          {
            targets: 2,
            data: 'address',
            render: function (data: any, type: any, row: any, meta: any) {
              return row.streetNumber + ' ' + row.streetName + ' ' + row.streetType;
            }
          },
          {
            targets: 6,
            render: function (data: any, type: any, row: any, meta: any) {
              data =
                '<button class="btn btn-primary select-btn" type="button" >Select</button> &nbsp &nbsp'
                + '<button class="btn btn-primary view-btn" type="button">View</button>';

              return data;
            }

          }
        ]
      });
    }
    this._addressListTbl.clear().rows.add(addressList).draw();
    this._addressListTbl.draw();
    jQuery('#addressList tbody').on('click', '.select-btn', function (this: any) {
      var s = $(this).parents('tr');
      console.log('Selected apn:', self._addressListTbl.row(s).data().apn);
      // Select address      
      self._viewAddressDetail = self._addressListTbl.row(s).data();
      console.log('Selected Address:', self._viewAddressDetail);
      self.selectedAddress();
    });
    jQuery('#addressList tbody').on('click', '.view-btn', function (this: any) {
      var s = $(this).parents('tr');
      console.log('Selected apn:', self._addressListTbl.row(s).data().apn);
      //View address
      self.viewAddress(self._addressListTbl.row(s).data());
    });
  }
  showAddressList() {
    jQuery("#addressDetail").hide();
    jQuery("#addressList").show();
  }
  loadAddress(parameter: string) {
    console.log("Search Parameter : " + parameter);
    this._caseAddressViewModel = null;
    this._viewAddressDetail = null;
    this._complaintServiceCall.getByModuleMethodAndParameter(this._urlConstant.CityAddressModule, this._urlConstant.GetAddressByFields, parameter).subscribe((response) => {
      console.log("Address : " + JSON.stringify(response));
      this._addressSearchResultDataList = [];
      if (response.status == "SUCCESS") {
        this._addressSearchResultDataList = response.data;
        if (this._addressSearchResultDataList.length > 1) {
          jQuery("#addressDetail").hide();
          jQuery("#addressList").show();
          this.setUpAddressListTable(this._addressSearchResultDataList);
          jQuery("#SearchResultAddress").modal("show");
        } else if (this._addressSearchResultDataList.length == 1) {
          this._caseAddressViewModel = this._addressSearchResultDataList[0];
          this._viewAddressDetail = this._addressSearchResultDataList[0];
          console.log('Case Address View Model:', this._caseAddressViewModel);
        } else {
          this._messageText = "No address found for the search criteria.";
          jQuery("#messageBox").modal("show");
        }

      } else {
        console.log("Unable to receive Case Address : " + response.errorMessage)
      }
    });
  }
  viewAddress(_addressDetail: any) {
    jQuery("#addressDetail").show();
    jQuery("#addressList").hide();
    this._viewAddressDetail = _addressDetail;
  }
  resetMockViewModel() {
    this._mockupViewModel = {
      id: 0,
      first_name: "",
      last_name: "",
      email: ""
    }
  }
  resetCaseAddressViewModel() {
    this._caseAddressViewModel = {
      id: 0,
      APN: "",
      buildingpermit: "",
      censusTract: "",
      district: "",
      houseNumber: "",
      housingpermit: "",
      lastinspectionrtndate: null,
      noofunits: 0,
      ownerCityStateZip: "",
      ownerName: "",
      ownerPhone: "",
      ownerStreet: "",
      planningpermit: "",
      policebeat: "",
      policedistrict: "",
      propertycomment: "",
      propertytype: "",
      streetName: "",
      streetType: "",
      taxratearea: "",
      trashpickupday: "",
      trashputoutday: "",
      zoningresearch: "",
    };
    this._caseAddressForm = this._fb.group({
      id: [0, Validators.required],
      apn: ["", Validators.required],
      buildingpermit: ["", Validators.required],
      censustract: ["", Validators.required],
      district: ["", Validators.required],
      houseNumber: ["", Validators.required],
      housingpermit: ["", Validators.required],
      lastinspectionrtndate: [null, Validators.required],
      noofunits: [0, Validators.required],
      ownerCityStateZip: ["", Validators.required],
      ownerName: ["", Validators.required],
      ownerPhone: ["", Validators.required],
      ownerStreet: ["", Validators.required],
      planningpermit: ["", Validators.required],
      policebeat: ["", Validators.required],
      policedistrict: ["", Validators.required],
      propertycomment: ["", Validators.required],
      propertytype: ["", Validators.required],
      streetName: ["", Validators.required],
      streetType: ["", Validators.required],
      taxratearea: ["", Validators.required],
      trashpickupday: ["", Validators.required],
      trashputoutday: ["", Validators.required],
      zoningresearch: ["", Validators.required],
    });
  }

  resetViolationViewModel() {
    this._caseViolationViewModel = {
      id: -1,
      inspectionVersion: 0,
      area: "",
      closedate: "",
      correctiveaction: "",
      description: "",
      duedate: "",
      municode: "",
      opendate: "",
      priority: "",
      status: false,
      violation: "",
      violationstatus: "",
      violationtype: "",
      createdBy: "",
      createdOn: "",
      modifiedBy: "",
      modifiedOn: "",
      caseMaster: {},
    };
    let status = this._violationStatusTypeDataList.find((x: any) => x.isDefault == true);
    if (status !== null && status !== undefined) {
      this._caseViolationViewModel.violationstatus = status.code;
    }
    this._caseViolationForm = this._fb.group({
      id: [0],
      inspectionVersion: [0],
      area: [""],
      closedate: [""],
      correctiveaction: [""],
      description: [""],
      duedate: [""],
      municode: [""],
      opendate: [""],
      priority: [""],
      status: [false],
      violation: [""],
      violationstatus: [""],
      violationtype: [""],
      createdBy: [""],
      createdOn: [""],
      modifiedBy: [""],
      modifiedOn: [""],
    });

  }

  resetActionLogTypeViewModel() {
    this._actionLogTypeViewModel = {
      id: 0,
      actionCode: "",
      actionDate: "",
      actionType: "",
      actionVersion: 0,
      caseMaster: {},
      caseActionFiles: [],
      comments: "",
      createdBy: "",
      createdOn: new Date().toISOString().split("T")[0],
      isRead: false,
      modifiedBy: "",
      modifiedOn: "",
      readDate: "",
      routeToInspectorId: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      subject: "",
      taskStatus: "",
      status: false
    }
    this._actionLogTaskForm = this._fb.group({
      id: [0],
      actionCode: [""],
      actionDate: [""],
      actionType: [""],
      actionVersion: [0],
      caseMaster: {},
      comments: [""],
      createdBy: [""],
      createdOn: [""],
      isRead: [false],
      modifiedBy: [""],
      modifiedOn: [""],
      readDate: [""],
      startDate: [""],
      endDate: [""],
      subject: [""],
      taskStatus: [""],
      routeToInspectorId: [0],
      status: [false]
    });

  }


  resetActionLogAppointmentViewModel() {
    this._actionLogAppointmentViewModel = {
      id: 0,
      actionCode: "",
      actionDate: "",
      actionType: "",
      actionVersion: 0,
      caseMaster: {},
      caseActionFiles: [],
      comments: "",
      createdBy: "",
      createdOn: new Date().toISOString().split("T")[0],
      isRead: false,
      modifiedBy: "",
      modifiedOn: "",
      readDate: "",
      routeToInspectorId: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      subject: "",
      location: "",
      status: false
    }
    this._actionLogAppointmentForm = this._fb.group({
      id: [0],
      actionCode: [""],
      actionDate: [""],
      actionType: [""],
      actionVersion: [0],
      caseMaster: {},
      comments: [""],
      createdBy: [""],
      createdOn: [""],
      isRead: [false],
      modifiedBy: [""],
      modifiedOn: [""],
      readDate: [""],
      startDate: [""],
      endDate: [""],
      subject: [""],
      location: [""],
      routeToInspectorId: [0],
      status: [false]
    });
  }


  resetActionLogPictureViewModel() {
    this._actionLogPictureViewModel = {
      id: 0,
      description: "",
      fileData: "",
      filename: "",
      physicalfilename: ""
    };
  }

  resetFollowUpActionLogViewModel() {
    this._followupActionLogViewModel = {
      id: 0,
      actionCode: "",
      actionDate: "",
      actionType: "",
      actionVersion: 0,
      caseMaster: {},
      caseActionFiles: [],
      comments: "",
      createdBy: "",
      createdOn: new Date().toISOString().split("T")[0],
      isRead: false,
      modifiedBy: "",
      modifiedOn: "",
      readDate: "",
      routeToInspectorId: 0,
      status: false
    };
    this._followUpActionLogForm = this._fb.group({
      id: [0],
      actionCode: [""],
      actionDate: [""],
      actionType: [""],
      actionVersion: [0],
      caseMaster: {},
      comments: [""],
      createdBy: [""],
      createdOn: [""],
      isRead: [false],
      modifiedBy: [""],
      modifiedOn: [""],
      readDate: [""],
      startDate: [""],
      endDate: [""],
      subject: [""],
      taskStatus: [""],
      routeToInspectorId: [0],
      status: [false]
    });
    jQuery("#inspectionViolation").hide();
    jQuery("#followUpAction").hide();
  }

  resetActionLogViewModel() {
    this._actionLogViewModel = {
      id: 0,
      actionCode: "",
      actionDate: "",
      actionType: "",
      actionVersion: 0,
      caseMaster: {},
      caseActionFiles: [],
      comments: "",
      createdBy: "",
      createdOn: new Date().toISOString().split("T")[0],
      isRead: false,
      modifiedBy: "",
      modifiedOn: "",
      readDate: "",
      routeToInspectorId: 0,
      status: false
    };
    this._actionLogForm = this._fb.group({
      id: [0],
      actionCode: [""],
      actionDate: [""],
      actionType: [""],
      actionVersion: [0],
      caseMaster: {},
      comments: [""],
      createdBy: [""],
      createdOn: [""],
      isRead: [false],
      modifiedBy: [""],
      modifiedOn: [""],
      readDate: [""],
      startDate: [""],
      endDate: [""],
      subject: [""],
      taskStatus: [""],
      routeToInspectorId: [0],
      status: [false]
    });
    this._selectedActionLogViewModel = null;
    this.pictures = [];
    this.audios = [];
    jQuery("#inspectionViolation").hide();
    jQuery("#followUpAction").hide();
  }

  resetCitationViewModel() {
    this._citationViewModel = {
      id: 0,
      actionCode: "",
      actionDate: "",
      actionType: "",
      actionVersion: 0,
      amount: 0,
      caseActionFiles: [],
      artype: "",
      caseMaster: {},
      citiationComments: "",
      citiationDate: "",
      citiationNo: "",
      citiedById: 0,
      comments: "",
      createdBy: "",
      createdOn: "",
      fdept: "",
      ffbj: "",
      ffund: "",
      frc: "",
      isRead: false,
      licenseno: "",
      modifiedBy: "",
      modifiedOn: "",
      municode: "",
      readDate: "",
      ref1: "",
      ref2: "",
      routeToInspectorId: 0,
      status: true
    };
    jQuery("#inspectionViolation").hide();
    jQuery("#followUpAction").hide();
  }

  resetActionLogFileViewModel() {

  }
  resetCaseDetailViewModel() {
    this._caseDetailViewModel = {
      id: 0,
      caseaddress: null,
      casestatus: "D",
      cdbgcasetype: "",
      closedate: "",
      coreservicecode: "",
      createdby: "",
      createdon: "",
      cudate: "",
      description: "",
      dispositioncode: "",
      inspector1id: null,
      inspector2id: null,
      modifiedby: "",
      modifiedon: "",
      opendate: "",
      prioritycode: "",
      programcode: "",
      receiveddate: new Date().toISOString().split("T")[0],
      sourcecode: "",
      hasCasedetail: true,
      version: 0
    }
    this._caseDetailForm = this._fb.group({
      id: [0],
      caseaddress: [null],
      casestatus: [""],
      cdbgcasetype: [""],
      closedate: [""],
      coreservicecode: [""],
      createdby: [""],
      createdon: [""],
      cudate: [""],
      description: [""],
      dispositioncode: [""],
      inspector1id: [null],
      inspector2id: [null],
      modifiedby: [""],
      modifiedon: [""],
      opendate: [""],
      prioritycode: [""],
      programcode: [""],
      hasCasedetail: [true],
      receiveddate: [""],
      sourcecode: [""],
      version: [0]
    })
  }
  get formControls() {
    return this._casePersonForm.controls;
  }
  resetCasePersonViewModel() {
    this._casePersonViewModel = {
      id: 0,
      firstname: "",
      middlename: "",
      lastname: "",
      address1: "",
      address2: "",
      email: "",
      phone1: "",
      phone1type: "",
      phone2: "",
      phone2type: "",
      personVersion: 0,
      status: false,
      caseMaster: {},
      comment: "",
      personType: "",
      isEditable: true,
      relationship: "",
      salutation: "",
      city: "San Jose",
      state: "CA",
      zip: "",
      createdBy: "",
      createdOn: "",
      modifiedOn: "",
      modifiedBy: "",
    }
    this._casePersonForm = this._fb.group({
      address1: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      address2: [""],
      createdBy: ["", Validators.required],
      createdOn: [null, Validators.required],
      email: ["", [Validators.required, Validators.email]],
      firstname: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      id: [0, Validators.required],
      isEditable: [true],
      lastname: ["", Validators.required],
      middlename: ["", Validators.required],
      modifiedBy: ["", Validators.required],
      modifiedOn: [null, Validators.required],
      personVersion: [0, Validators.required],
      phone1: ["", Validators.required],
      phone1type: ["", Validators.required],
      phone2: ["", Validators.required],
      phone2type: ["", Validators.required],
      status: [false, Validators.required]
    })
  }
  resetSearchViewModel() {
    this._searchViewModel = {
      apartmentNumber: "",
      streetName: "",
      streetNumber: "",
      streetType: "",
      apnNumber: ""
    }
  }
  resetCaseViewModel() {
    this._caseAddress = {
      apn: "",
      id: -1
    };
    this._caseViewModel = {
      id: -1,
      caseaddress: this._caseAddress,
      hasCasedetail: false,
      version: 0
    }
  }

  onStreetSelect() {
    console.log(this.street);
  }

  search() {
    let to = false;
    if (to) { clearTimeout(to); }
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
      jQuery("#v1").show();
      jQuery("#v2").hide();
    } else {
      jQuery("#v1").hide();
      jQuery("#v2").show();
    }
  }
  onPrimaryInspectorChange(evt: any) {
    this._primaryInspectorAssignment = " Assigned: 4, In Progress: 6, Closed: 10 (Last 30 days)";
  }


  categoryOnChange(evt: any) {

    switch (evt.target.value) {
      case "F":
        {
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#taskDetails").hide();
          jQuery("#appointmentInformations").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          this.resetActionLogViewModel();
        }
        break;
      case "I":
        {
          jQuery("#inspectionViolation").show();
          jQuery("#followUpAction").show();
          jQuery("#citationDetails").hide();
          jQuery("#taskDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#inspection-violation-list").show();
          jQuery("#appointmentInformations").hide();
        }
        break;
      case "C":
        {
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").show();
          jQuery("#taskDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#appointmentInformations").hide();
        }
        break;
      case "T":
        {
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#appointmentInformations").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#taskDetails").show();
        }
        break;
      case "A":
        {
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#taskDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#appointmentInformations").show();
          this.resetActionLogAppointmentViewModel();
        }
        break;
      case "P":
        {
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#taskDetails").hide();
          jQuery("#appointmentInformations").hide();
          jQuery("#picture").show();
          jQuery("#pictureGallery").hide();
          jQuery("#pictureList").show();
          jQuery("#audio").show();
          jQuery("#audioList").show();
          jQuery("#video").show();
          jQuery("#videoList").show();

          this.resetActionLogAppointmentViewModel();
        }
        break;
    }
  }
  getActionDate(s: string) {
    let pip: DatePipe = new DatePipe('en-US');
    let str = pip.transform(s, 'yyyy-MM-dd');

    return str;
  }
  hideAllActionTab() {
    jQuery("#inspectionViolation").hide();
    jQuery("#followUpAction").hide();
    jQuery("#citationDetails").hide();
    jQuery("#taskDetails").hide();
    jQuery("#picture").hide();
    jQuery("#audio").hide();
    jQuery("#video").hide();
    jQuery("#appointmentInformations").hide();
  }
  actionOnChange(evt: any) {

    console.log(evt.target.value)
    // console.log("Item : " + JSON.stringify(evt.target.value));
    console.log('Item From Variable:' + evt.target.value);
    let item: any = this._actionListDataList.filter((q) => q.actionCode == evt.target.value);

    this.hideAllActionTab();
    if ((item != null) && (item.length > 0)) {
      switch (item[0].actionType) {
        case "I":
          {
            jQuery("#inspectionViolation").show();
            jQuery("#followUpAction").show();
          }
          break;
        case "F":
          {
            this.resetActionLogViewModel();
          }
          break;
        case "C":
          {
            jQuery("#citationDetails").show();
            this.initializeStaticTable();
            this.resetCitationViewModel();
          }
          break;
        case "T":
          {
            jQuery("#taskDetails").show();
            this.resetActionLogTypeViewModel();
          }
          break;
        case "A":
          {
            jQuery("#appointmentInformations").show();
            this.resetActionLogAppointmentViewModel();
          }
          break;
        case "P":
          {
            jQuery("#picture").show();
            jQuery("#pictureGallery").hide();
            jQuery("#pictureList").show();
            jQuery("#audio").show();
            jQuery("#pictureList").show();
            jQuery("#video").show();
            jQuery("#videoList").show();
            this.resetActionLogAppointmentViewModel();
          }
          break;
      }
      this._actionLogViewModel.actionType = item[0].actionType;
      jQuery('#actionType').val(this._actionLogViewModel.actionType).trigger('change');
    }
  }

  onProgramCodeChange(evt: any) {
    console.log(evt)
    this.getInspectorByProgramCodeAndCensusTract(evt.target.value, this._viewAddressDetail.censusTract);
  }
  onSecondaryInspectorChange(evt: any) {
    this._secondaryInspectorAssignment = " Assigned: 2, In Progress: 2, Closed: 6 (Last 30 days)";
  }
  getInspectorByProgramCodeAndCensusTract(programCode: string, censustract: string) {
    try {
      let parameter = "censusTract=" + censustract + "&programCode=" + programCode;
      console.log("Parameter : " + parameter);
      this._complaintServiceCall.getByModuleMethodAndParameter(this._urlConstant.CaseDataModule, this._urlConstant.GetInspectorsForProgram, parameter).subscribe((response) => {
        console.log("Parameter : " + JSON.stringify(response));
        this._primaryInspectorDataList = [];
        if (response.status == "SUCCESS") {
          if (response.inspectors != null && response.inspectors.length > 0)
            //$('#inspector1id').val(response.inspectors[0].id);
            this._caseDetailViewModel.inspector1id = response.inspectors[0].id;
          jQuery('#inspector1id').val(this._caseDetailViewModel.inspector1id).trigger('change');
          jQuery('#inspector2id').val(this._caseDetailViewModel.inspector1id).trigger('change');
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to receive Primary and Secondary Inspector list based on Census Tract and Program Code.'
          });
          console.log("Unable to receive Inspector Data List : " + response.errorMessage)
        }
      });
    } catch (error) {
      console.log("Error in receiving Inspector : " + JSON.stringify(error))
    }
  }
  hideRegisteredCases() {
    jQuery("#registeredCases").hide();
  }
  getRegisteredCases() {
    jQuery("#registeredCases").show();
  }
  createCase(index: any) {
    if (this._viewAddressDetail != null) {
      this._selectedAPN = this._viewAddressDetail.apn;
      this._messageText = "Do you want to create case for the APN:" + this._selectedAPN;
      jQuery("#messageDialogBox").modal("show");
    } else {
      this._messageText = "Please select an address to create a case.";
      jQuery("#messageBox").modal("show");
    }


  }
  _actionType: number = 0;
  _newViolationAction: number = 1;
  _editVilationAction: number = 2;
  _newPersonAction: number = 3;
  _editPersonAction: number = 4;
  save() {
    let actionCompleted = false;
    /*     switch (this._currentStepIndex) {
          case 2:
            this._casePersonViewModel.isEditable = true;
            actionCompleted=true;
            this.savePerson();
            return;
          case 3:
            actionCompleted=true;
            return;
          
        } */
    jQuery("#messageEditDialogBox").modal("hide");
    switch (this._actionType) {
      case this._newViolationAction:
        this._isEdit = false;
        this.addNewViolation();
        break;
      case this._editVilationAction:
        this._isEdit = false;
        this.editViolation(this._editData);
        break;
      case this._newPersonAction:
        this._isEdit = false;
        this.addNewPerson();
        break;
      case this._editPersonAction:
        this._isEdit = false;
        this.editPersonForTable();
        break;

    }
  }
  openPersonTab() {
    this.resetCasePersonViewModel();
    let nindex = 2;
    this._currentStepIndex = nindex;
    jQuery(".bs-stepper-pane").removeClass("active");
    jQuery(".step").removeClass("active");
    jQuery(".bs-stepper-pane").removeClass("dstepper-block");
    jQuery("#step-l-" + nindex).addClass(" active ");
    jQuery("#step-l-" + nindex).addClass(" dstepper-block ");
    jQuery(".step").removeClass("active");
    $("div[data-target='#step-l-" + nindex + "']").addClass(" active ");
    jQuery("#stepper1trigger" + nindex).removeAttr("disabled");
    jQuery("#personList").show();
    jQuery("#addOrEditPerson").hide();
  }
  createCaseInDraftMode() {
    this.resetCaseViewModel();
    this._caseAddress.apn = this._selectedAPN;
    this._caseAddress.id = -1;
    this._caseViewModel.id = - 1;
    this._caseViewModel.caseaddress = this._caseAddress;
    this._caseViewModel.hasCasedetail = false;
    this._caseViewModel.version = 0;
    // console.log("Draft Case Detail : " + JSON.stringify(this._caseViewModel));
    try {
      this._complaintServiceCall.save(this._urlConstant.CaseMasterModule, this._caseViewModel).subscribe((response) => {
        console.log("Case Details : " + JSON.stringify(response));
        jQuery("#btnMDClose").click();
        if (response.status == "SUCCESS") {
          this._caseDetail = response.data[0];
          this._personDataList = response.data[0].casePerson;
          Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Case saved as Draft.'
          });
          this._caseId = response.data[0].id;
          this._caseAddressId = response.data[0].caseaddress.id;
          this._enableSave = true;

          //this._personDataList = (this._caseDetail[0].casePerson.filter((e: any) => e.status));
          this._personTable.clear().rows.add(this._personDataList).draw();
          this._personTable.draw();


          jQuery("#messageDialogBox").modal("hide");
          this.openPersonTab();
          jQuery('#createCaseBtn').hide();
          jQuery('#nextPersonBtn').show();
          this.createResponsiblePerson(this._viewAddressDetail);
        } else {
          alert("Unable to save case in draft. Please contact IT Helpdesk.");
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to save case in draft. Please contact IT Helpdesk.'
          });
        }
      },
        (error) => {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to save case in draft. Please contact IT Helpdesk.'
          });
        });
    } catch (error) {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Unable to save case in draft. Please contact IT Helpdesk.'
      });
    }
  }
  createResponsiblePerson(caseAddress: any) {
    if (caseAddress.ownername != null) {
      if (caseAddress.ownername.length > 1) {
        this.resetCasePersonViewModel();
        this._casePersonViewModel.address1 = caseAddress.ownerstreet;
        this._casePersonViewModel.address2 = caseAddress.ownercitystatezip;
        this._casePersonViewModel.firstname = caseAddress.ownername;
        this._casePersonViewModel.personType = this._urlConstant.PersonTypeResponsiblePerson;
        this._casePersonViewModel.salutation = "MR.";
        this._casePersonViewModel.lastname = "N/A";
        this._casePersonViewModel.relationship = "TEN";
        this._casePersonViewModel.isEditable = false;
        // this.InitializePersonModel()
        //this.savePerson();
      }
      if (caseAddress.othername != null) {
        if (caseAddress.othername.length > 1) {
          this.resetCasePersonViewModel();
          this._casePersonViewModel.address1 = caseAddress.otheraddress;
          this._casePersonViewModel.address2 = caseAddress.othercitystatezip;
          this._casePersonViewModel.firstname = caseAddress.ownername;
          this._casePersonViewModel.personType = this._urlConstant.PersonTypeResponsiblePerson;
          this._casePersonViewModel.salutation = "MR.";
          this._casePersonViewModel.lastname = "N/A";
          this._casePersonViewModel.relationship = "TEN";
          this._casePersonViewModel.isEditable = false;
          // this.InitializePersonModel()
          // this.savePerson();
        }
      }
    }
  }
  cancelSavePerson() {
    jQuery("#personList").show();
    jQuery("#addOrEditPerson").hide();
    jQuery("#navigationPerson").show();
    jQuery('.nav-tabs a[href="#person-list"]').tab('show');
    this.resetCasePersonViewModel();
    this._isEdit = false;
  }

  cancelViolationAction() {
    jQuery("#inspection-violation-list").show();
    jQuery("#addOrEditInspectionViolation").hide();
    jQuery('.nav-tabs a[href="#inspection-violation-list"]').tab('show');
    this.resetViolationViewModel();
    this._isEdit = false;
  }

  cancelViolation() {
    // jQuery("#violationGrid").show();
    // jQuery("#frmViolation").hide();
    // jQuery("#navigationViolation").show();
    jQuery("#violationGrid").show();
    jQuery("#addOrEditViolation").hide();
    jQuery("#navigationPerson").show();
    jQuery('.nav-tabs a[href="#violation-list"]').tab('show');
    this.resetViolationViewModel();
    this._isEdit = false;
  }

  loadCaseDetail(caseID: any) {
    try {
      this._complaintServiceCall.getByID(this._urlConstant.CaseMasterModule, this._urlConstant.GetByID, caseID).subscribe((response) => {
        this._caseDetail = null;
        // console.log("Case Detail : " + JSON.stringify(response));
        this._personDataList = [];
        if (response.status == "SUCCESS") {
          this._caseDetail = response.data;
          console.log("Case Details Version" + JSON.stringify(this._caseDetail));
          this._personDataList = [];
          this._personDataList = (this._caseDetail.casePerson.filter((e: any) => e.status));
          console.log("Person Data List : " + JSON.stringify(this._personDataList));
          // this._personDataList = this._caseDetail[0].casePerson;
          let versionList = []
          versionList = this._caseDetail.caseVersions;
          for (var i = 0; i < versionList.length; i++) {
            switch (versionList[i].objecttype) {
              case "Person":
                this._personVersion = versionList[i].version;
                console.log(versionList[i].version)
                break;
            }
          }
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to receive case details. Please contact IT Helpdesk.'
          });
        }
      });
    } catch (error) {
      console.log("Case Detail : " + JSON.stringify(error));
    }
  }
  personTypeChanged(event: any) {
    if (event.target.value == "R") {
      $("#relationshipInput").hide();

    } else {
      $("#relationshipInput").show();
      // this.isRelationshipTypeClicked = true;
    }
  }
  focusoutRelation(data: any, id: any) {
    if (this._casePersonViewModel.personType == "RR") {
      {
        if (data.length > 0) {
          this.isRelationshipTypeClicked = false;
          this.isRelationErrorMessage = '';
        }
        else {
          this.isRelationshipTypeClicked = true;
        }
      }
    }
  }


  savePerson(casePerson: boolean) {
    this._casePersonViewModel.salutation = jQuery('#salutation').val();
    this._casePersonViewModel.personType = jQuery('#personType').val() ?? '';
    console.log(this._casePersonViewModel.personType)
    if (this._casePersonViewModel.personType === 'RR') {
      this._casePersonViewModel.relationship = jQuery('#relationship').val();
      console.log(this._casePersonViewModel.relationship)
    }
    this._personErrorSummaryList = [];
    console.log(casePerson);
    if (this._casePersonViewModel.id == 0) {
      this._casePersonViewModel.id = -1;
    }
    this._casePersonViewModel.caseMaster = { "id": this._caseId };
    this._casePersonViewModel.personVersion = (this.getVersion("Person") != -1) ? this._personVersion : 0;
    console.log("casePerson : " + JSON.stringify(this._casePersonViewModel));
    try {
      this._complaintServiceCall.saveByMethodName(this._urlConstant.CaseMasterModule, this._urlConstant.SavePerson, this._casePersonViewModel).subscribe((response) => {
        if (response.status == "SUCCESS") {
          // this.loadCaseDetail(this._caseId);
          Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Person Information saved successfully.'
          });
          console.log("Save People Response : " + JSON.stringify(response));
          jQuery("#personList").show();
          jQuery("#addOrEditPerson").hide();
          jQuery("#navigationPerson").show();
          jQuery('.nav-tabs a[href="#person-list"]').tab('show');
          this.resetCasePersonViewModel();
          this._personDataList = [];
          this._caseDetail = response.data[0];
          this._personDataList = (this._caseDetail.casePerson.filter((e: any) => e.status));

          console.log("Save Person Response : " + JSON.stringify(response));
          this.resetCasePersonViewModel();
          this._enableSave = true;
          this._personTable.clear().rows.add(this._personDataList).draw();
          this._isEdit = false;
        } else {
          //   alert("Unable to save people information. Please contact IT Helpdesk.");
          this._personErrorSummaryList = JSON.parse(response.errorMessage.toString().replaceAll("\\u0027", "\"").replaceAll("[\"", "[").replaceAll("\"]", "]").replaceAll("\"{", "{").replaceAll("}\"", "}"));

          let err: [] = JSON.parse(response.errorMessage);
          console.log('Person Save:', err);
          err.forEach((v: any) => {
            if (v.split(',')[0].split(':')[1] == "'personType'") {
              this.personTypeFocusoutEvent(v.split(',')[1].split(':')[1].replace('}', ''));
            }
            if (v.split(',')[0].split(':')[1] == "'salutation'") {
              this.salutationFocusoutEvent(v.split(',')[1].split(':')[1].replace('}', ''));
            }
            if (v.split(',')[0].split(':')[1] == "'firstName'") {
              this.isFirstNameHasData = true;
              this.isFirstNameErrorMessage = v.split(',')[1].split(':')[1].replace('}', '');
            }
            if (v.split(',')[0].split(':')[1] == "'lastName'") {
              this.isLastNameHasData = true;
              this.isLastNameErrorMessage = v.split(',')[1].split(':')[1].replace('}', '');
            }
            if (v.split(',')[0].split(':')[1] == "'relationship'") {
              this.isRelationshipTypeClicked = true;
              this.isRelationErrorMessage = v.split(',')[1].split(':')[1].replace('}', '');
            }
          });
          let errM: any = err.map((e: any) => {
            const parsed = JSON.parse(e.replace(/'/g, '"'));
            return `${parsed.field}: ${parsed.error}`;
          }).join('<br>');

          console.log(errM);

          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: `Unable to save people information.<br>${errM}`,
            html: true,
            // width: 600, 
            // size: 'large' 
          });
        }
      },
        (error) => {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to save people information. Please contact IT Helpdesk.'
          });
        });
    } catch (error) {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Unable to save people information. Please contact IT Helpdesk.'
      });
    }



  }


  saveViolationAction() {
    try {
      this._violationErrorSummary = [];
      console.log("Violation Starts")
      this._caseViolationViewModel.caseMaster = { "id": this._caseId };
      this._caseViolationViewModel.inspectionVersion = (this.getVersion("Violation") != -1) ? this._violationVersion : 0;
      console.log("Violation View Model : " + JSON.stringify(this._caseViolationViewModel));
      this._complaintServiceCall.saveByMethodName(this._urlConstant.CaseMasterModule, this._urlConstant.SaveViolation, this._caseViolationViewModel).subscribe((response) => {
        console.log("Save Violation Version  Response : " + JSON.stringify(response));
        if (response.status == "SUCCESS") {
          this._caseDetail = response.data[0];
          Lobibox.notify('success', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Violation saved successfully.'
          });
          console.log("Case Detail Response : " + JSON.stringify(response));
          jQuery("#inspection-violation-list").show();
          jQuery("#addOrEditInspectionViolation").hide();
          jQuery('.nav-tabs a[href="#inspection-violation-list"]').tab('show');

          // jQuery("#violationGrid").show();
          // jQuery("#frmViolation").hide();
          // jQuery("#navigationViolation").show();
          this._enableSave = true;
          this.resetViolationViewModel();
          this._isEdit = false;
        } else {
          this._violationErrorSummary = JSON.parse(response.errorMessage);
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to save Violation. Please contact IT Helpdesk.'
          });
        }
      },
        (error) => {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to save violation. Please contact IT Helpdesk.'
          });
        });
    } catch (error) {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Unable to save Violation information1. Error : ' + error
      });
    }
  }

  saveViolation() {
    try {

      this._caseViolationViewModel.area = jQuery("#area").val();
      this._caseViolationViewModel.priority = jQuery("#priority").val();
      this._caseViolationViewModel.violationstatus = jQuery("#violationstatus").val();
      if (this._caseViolationViewModel.violationstatus === 'C') {
        this.isCaseDetailStatus = false;
        this.isErrorShowMsg = true;
      }
      else {
        this.isErrorShowMsg = false
      }
      console.log("Violation Starts")
      this._caseViolationViewModel.caseMaster = { "id": this._caseId };
      this._caseViolationViewModel.inspectionVersion = (this.getVersion("Violation") != -1) ? this._violationVersion : 0;
      console.log("Violation View Model : " + JSON.stringify(this._caseViolationViewModel));
      if ((!this.isMunicodeHasData) && (!this.isDescriptionHasData) && (!this.isCorrectiveActionHasData)) {
        this._complaintServiceCall.saveByMethodName(this._urlConstant.CaseMasterModule, this._urlConstant.SaveViolation, this._caseViolationViewModel).subscribe((response) => {
          console.log("Save Violation Version  Response : " + JSON.stringify(response));
          if (response.status == "SUCCESS") {
            this._caseDetail = response.data[0];
            this.caseViolationDetails = response.data[0].caseViolation;//saveviolation
            this.initializeStaticTable();
            if (this._violationTable && this._caseDetail.caseViolation) {
              this._violationTable.clear().rows.add(this._caseDetail.caseViolation).draw();
              this.addShortDescriptionRows(); // Add short descriptions for new rows
            }
            else
              this.InitializeViolationTable();
            Lobibox.notify('success', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Violation saved successfully.'
            });
            console.log("Case Detail Response : " + JSON.stringify(response));
            jQuery("#violationGrid").show();
            jQuery("#addOrEditViolation").hide();
            jQuery("#navigationViolation").show();
            jQuery('.nav-tabs a[href="#violation-list"]').tab('show');

            // jQuery("#violationGrid").show();
            // jQuery("#frmViolation").hide();
            // jQuery("#navigationViolation").show();
            this._enableSave = true;
            this.resetViolationViewModel();
            this._isEdit = false;


            //  this.dtTrigger.next(null);
          } else {
            //this._violationErrorSummary = JSON.parse(response.errorMessage);
            let errors = JSON.parse(response.errorMessage.toString().replaceAll("\\u0027", "\"").replaceAll("[\"", "[").replaceAll("\"]", "]").replaceAll("\"{", "{").replaceAll("}\"", "}"));
            this._violationErrorSummary = []
            errors.forEach((v: any) => {
              if (v.field == 'correctiveAction') {
                this.focusoutMethod(v.field.toLowerCase(), '');
                this.correctiveActionErrorMessage = v.error;
                this._violationErrorSummary.push(v.error);
              } else if (v.field == 'description') {
                this.focusoutMethod(v.field.toLowerCase(), '');
                this.descriptionErrorMessage = v.error;
                this._violationErrorSummary.push(v.error);
              } else if (v.field.toLowerCase() == 'municode') {
                this.focusoutMethod(v.field.toLowerCase(), '');
                this.municodeErrorMessage = v.error;
                this._violationErrorSummary.push(v.error);
              }
            });
            Lobibox.notify('error', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Unable to save Violation. Please contact IT Helpdesk.'
            });
          }
        },
          (error) => {
            Lobibox.notify('error', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Unable to save violation. Please contact IT Helpdesk.'
            });
          });
      } else {
        Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Unable to save Violation. Fill mandatory fields.'
        });
      }

    } catch (error) {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Unable to save Violation information1. Error : ' + error
      });
    }
  }
  saveCaseDetail(status: string) {
    this._caseDetailViewModel.programcode = jQuery('#programcode').val();
    this._caseDetailViewModel.sourcecode = jQuery('#sourcecode').val();
    this._caseDetailViewModel.inspector1id = jQuery('#inspector1id').val();
    this._caseDetailViewModel.inspector2id = jQuery('#inspector1id').val();
    this._caseDetailViewModel.dispositioncode = jQuery('#dispositioncode').val();
    this._caseDetailViewModel.prioritycode = jQuery('#prioritycode').val();
    this._caseDetailViewModel.coreservicecode = jQuery('#coreservicecode').val()
    this._caseDetailViewModel.cdbgcasetype = jQuery('#cdbgcasetype').val()
    this._caseDetailErrorSummary = [];
    console.log(this._caseDetailViewModel);
    console.log("Case ID : " + this._caseId);
    console.log("Case Address ID : " + this._caseAddressId);
    this._caseDetailViewModel.id = this._caseId;
    this._caseDetailViewModel.caseaddress = { "id": this._caseAddressId, "apn": this._viewAddressDetail.apn };
    this._caseDetailViewModel.hasCasedetail = true;
    this._caseDetailViewModel.cdbgcasetype = "V";
    let cd = JSON.parse(JSON.stringify(this._caseDetailViewModel));
    if (status != null && status != undefined) {
      cd.casestatus = status;
    }
    //this._caseDetailViewModel.inspector1id=jQuery('#')
    console.log("Case Details : " + JSON.stringify(cd));
    try {
      if ((!this.isCaseDetailProgramCode) && (!this.isCaseDetailPriorityCode) && (!this.isCaseDetailSourceCode)) {
        this._complaintServiceCall.saveByMethodName(this._urlConstant.CaseMasterModule, this._urlConstant.Save, cd).subscribe({
          next: (response) => {
            if (response.status == "SUCCESS") {
              Lobibox.notify('success', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Case Detail saved successfully.'
              });
              console.log("Case Detail Response : " + JSON.stringify(response));
              if (status != null) {
                this._caseDetail.casestatus = status;
                this._caseDetailViewModel.casestatus = status;
                jQuery('#caseStatusModel').modal('hide');
              }
              this.canChangeStatus();
              this._enableSave = true;
            } else {
              this._caseDetailErrorSummary = JSON.parse(response.errorMessage.toString()
                .replaceAll("\\u0027", "\"")
                .replaceAll("[\"", "[")
                .replaceAll("\"]", "]")
                .replaceAll("\"{", "{")
                .replaceAll("}\"", "}"));
              let errorMsg = '';
              this._caseDetailErrorSummary.forEach((v: any) => {
                if (v.field == 'programcode') {
                  this.isCaseDetailProgramCode = true;
                  this.casedetailProgramCodeMessage = v.error;
                  errorMsg += this.casedetailProgramCodeMessage + '<br/>';
                } else if (v.field == 'prioritycode') {
                  this.isCaseDetailPriorityCode = true;
                  this.casedetailPriorityCodeMessage = v.error;
                  errorMsg += this.casedetailPriorityCodeMessage + '<br/>';
                } else if (v.field == 'sourcecode') {
                  this.isCaseDetailSourceCode = true;
                  this.casedetailSourceCodeMessage = v.error;
                  errorMsg += this.casedetailSourceCodeMessage + '<br/>';
                } else if (v.field == 'dispositioncode') {
                  this.isCaseDetailDispositionCode = true;
                  this.casedetailDispositionCodeMessage = v.error;
                } else if (v.field == 'coreservicecode') {
                  this.isCaseDetailCoreserviceCode = true;
                  this.casedetailCoreserviceCodeMessage = v.error;
                } else {
                  this.isCaseDetailStatus = true;
                  this.casedetailStatusMessage = v.error;
                  errorMsg += this.casedetailStatusMessage + '<br>';
                }
              });
              Lobibox.notify('error', {
                pauseDelayOnHover: true,
                continueDelayOnInactiveTab: false,
                position: 'top right',
                icon: 'bx bx-check-circle',
                msg: 'Unable to save case details: ' + errorMsg
              });
              // if (this.casedetailStatusMessage) {
              //   this.stepClick(4);
              //   jQuery('#caseStatusModel').modal('hide');
              // }
            }
          },
          error: (err) => {
            Lobibox.notify('error', {
              pauseDelayOnHover: true,
              continueDelayOnInactiveTab: false,
              position: 'top right',
              icon: 'bx bx-check-circle',
              msg: 'Unable to case detail information. Please contact IT Helpdesk.'
            });
          }
        });

      } else {
        Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Unable to save case details: Fill mandatory fields.'
        });
      }

    } catch (error) {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Unable to save case detail information. Please contact IT Helpdesk.'
      });
    }
  }
  isAudio(obj: any) {
    if (obj.filename.toLowerCase().endsWith("mp3")) {
      return false;
    } else {
      return true;
    }
  }
  getImageURL(obj: any) {
    if (obj.id == -1) {
      return obj.fileData;
    } else {
      return this._imageBaseURL + "caseId=" + this._caseId + "&actionId=" + this._selectedActionLogViewModel?.id + "&actionFileId=" + obj?.id;
    }
  }
  editPicture(pic: any) {
    this.editedPictureId = pic.id;
    this.imgData = this._imageBaseURL + "caseId=" + this._caseId + "&actionId=" + this._selectedActionLogViewModel?.id + "&actionFileId=" + pic?.id
    this._pictureDescription = pic.description;
    jQuery("#updatePictureUploadMDL").modal("show");
  }
  editAudio(aud: any) {
    this.audioData = this._imageBaseURL + "caseId=" + this._caseId + "&actionId=" + this._selectedActionLogViewModel?.id + "&actionFileId=" + aud?.id
    this._pictureDescription = aud.description;
    jQuery("#audioUploadMDL").modal("show");
  }
  editVideo(vid: any) {
    this.videoData = this._imageBaseURL + "caseId=" + this._caseId + "&actionId=" + this._selectedActionLogViewModel?.id + "&actionFileId=" + vid?.id
    this._pictureDescription = vid.description;
    jQuery("#videoUploadMDL").modal("show");
  }
  editActionfromTable(i: any) {
    let action = this._caseDetail.caseActions.find((v: any) => v.id == i);
    if (action != undefined) {
      this.editAction(action);
    }
  }
  editAction(action: any) {
    this._selectedActionLogViewModel = action;
    console.log("Selectec Action : " + JSON.stringify(action));
    jQuery("#addOrEditAction").show();
    let pip: DatePipe = new DatePipe('en-US');
    try {
      let str = pip.transform(this._selectedActionLogViewModel.createdOn, 'yyyy-MM-dd');
      this._selectedActionLogViewModel.createdOn = str;
    } catch {

    }
    switch (this._selectedActionLogViewModel.actionType) {
      case "I":
        {
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          jQuery("#action-add-edit").show();
          jQuery("#addOrEditAction").show();
          jQuery("#addOrEditViolation").show();
          jQuery("#inspectionViolation").show();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#taskDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#appointmentInformations").hide();
        }
        break;
      case "F":
        {
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          jQuery("#action-add-edit").show();
          jQuery("#addOrEditAction").show();
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#taskDetails").hide();
          jQuery("#appointmentInformations").hide();
        }
        break;
      case "C":
        {
          this._citationViewModel = this._selectedActionLogViewModel;
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          console.log("Citation Action Log : " + JSON.stringify(this._citationViewModel));
          console.log("Action Log : " + JSON.stringify(this._actionLogViewModel));

          jQuery("#action-add-edit").show();

          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").show();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          // jQuery("#actionAddOrEdit").show();
          // jQuery("#action-add-edit").show();
          jQuery("#taskDetails").hide();
          jQuery("#appointmentInformations").hide();
        }
        break;
      case "T":
        {
          this._actionLogTypeViewModel = this._selectedActionLogViewModel;
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          jQuery("#action-add-edit").show();
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#appointmentInformations").hide();
          jQuery("#taskDetails").show();
        }
        break;
      case "A":
        {
          this._actionLogAppointmentViewModel = this._selectedActionLogViewModel;
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          jQuery("#action-add-edit").show();
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#picture").hide();
          jQuery("#audio").hide();
          jQuery("#video").hide();
          jQuery("#taskDetails").hide();
          jQuery("#appointmentInformations").show();
        }
        break;
      case "P":
        {
          this._actionLogPictureViewModel = this._selectedActionLogViewModel;
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          this.pictures = this._selectedActionLogViewModel.caseActionFiles.filter((itm: any) => ((!itm.filename.endsWith(".mp3") && (!itm.filename.endsWith(".mp4")))));
          this.audios = this._selectedActionLogViewModel.caseActionFiles.filter((itm: any) => (itm.filename.endsWith(".mp3")));
          this.videos = this._selectedActionLogViewModel.caseActionFiles.filter((itm: any) => (itm.filename.endsWith(".mp4")));
          console.log("Picture : " + JSON.stringify(this._actionLogPictureViewModel));
          jQuery("#action-add-edit").show();
          jQuery("#inspectionViolation").hide();
          jQuery("#followUpAction").hide();
          jQuery("#citationDetails").hide();
          jQuery("#taskDetails").hide();
          jQuery("#appointmentInformations").hide();
          jQuery("#pictureContent").show();
          jQuery("#pictureList").show();
          jQuery("#picture").show();
          jQuery("#audioContent").show();
          jQuery("#audioList").show();
          jQuery("#audio").show();
          jQuery("#videoList").show();
          jQuery("#video").show();
        }
        break;
      case "O":
        {
          this._actionLogViewModel = this._selectedActionLogViewModel;
          this.InitializeActionLog();
          jQuery("#action-add-edit").show();
          // jQuery("#addOrEditAction").show();
          // jQuery("#inspectionViolation").hide();
          // jQuery("#inspection-violation-list").show();
          // jQuery("#followUpAction").hide();
          // jQuery("#citationDetails").hide();
          // jQuery("#taskDetails").hide();
          // jQuery("#audio").hide();
          // jQuery("#picture").hide();
          // jQuery("#video").hide();
          // jQuery("#appointmentInformations").hide();
          // // jQuery("#actionGrid").hide();
          // jQuery("#navigationAction").hide();
          // jQuery('.nav-tabs a[href="#action-add-edit"]').tab('show');
          // jQuery('.nav-tabs a[href="#actionAddOrEdit"]').tab('show');
          // this.resetActionLogViewModel();
        }
        break;
    }
    jQuery("#navigationAction").hide();
    jQuery('.nav-tabs a[href="#actionAddOrEdit"]').tab('show');
    jQuery('.nav-tabs a[href="#action-add-edit"]').tab('show');
  }


  addPictureToList() {

    console.log("Data Started . . .");
    this.resetActionLogPictureViewModel();
    //  this._actionLogPictureViewModel = this._actionLogViewModel;
    // console.log(this.imgData);
    //console.log((this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "");
    this._actionLogPictureViewModel.fileData = this.imgData; //(this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "";
    this._actionLogPictureViewModel.filename = this._pictureFileName;
    console.log("Data Started . . .1");
    this._actionLogPictureViewModel.description = this._pictureDescription;
    this._actionLogPictureViewModel.id = -1;
    console.log("Data " + JSON.stringify(this._actionLogPictureViewModel));
    this.pictures.push(this._actionLogPictureViewModel);
    console.log("Picture List : " + JSON.stringify(this.pictures));
    jQuery("#btnMDPClose").click();

  }
  updatePictureToList() {

    console.log("Data Started . . .");
    //this.resetActionLogPictureViewModel();
    //  this._actionLogPictureViewModel = this._actionLogViewModel;
    // console.log(this.imgData);
    //console.log((this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "");

    // this._actionLogPictureViewModel.fileData = this.imgData; //(this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "";
    // this._actionLogPictureViewModel.filename = this._pictureFileName;
    // console.log("Data Started . . .1");
    // this._actionLogPictureViewModel.description = this._pictureDescription;
    // this._actionLogPictureViewModel.id = -1;
    // console.log("Data " + JSON.stringify(this._actionLogPictureViewModel));
    // this.pictures.push(this._actionLogPictureViewModel);
    let editPicture = this.pictures.filter(e => e.id == this.editedPictureId)[0];
    editPicture.fileData = this.imgData;
    editPicture.filename = this._pictureFileName;
    editPicture.description = this._pictureDescription;

    this.pictures.find(c => c.id == this.editedPictureId).fileData = this.imgData;
    this.pictures.find(c => c.id == this.editedPictureId).filename = this._pictureFileName;
    this.pictures.find(c => c.id == this.editedPictureId).physicalfilename = null;
    this.pictures.find(c => c.id == this.editedPictureId).description = this._pictureDescription;
    let pics: any[] = this.pictures;
    this.pictures = [];
    this.pictures = pics;
    console.log('Edited picture data:', this.pictures.filter(e => e.id == this.editedPictureId));
    //console.log("Picture List : " + JSON.stringify(this.pictures));
    jQuery("#btnPictureMDPClose").click();

  }

  addAudioToList() {

    console.log("Data Started . . .");
    this.resetActionLogPictureViewModel();
    //  this._actionLogPictureViewModel = this._actionLogViewModel;
    // console.log(this.imgData);
    //console.log((this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "");
    console.log("Audio Data : " + this.audioData);
    this._actionLogPictureViewModel.fileData = this.audioData; //(this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "";
    this._actionLogPictureViewModel.filename = this._pictureFileName;
    console.log("Data Started . . .1");
    this._actionLogPictureViewModel.description = this._pictureDescription;
    this._actionLogPictureViewModel.id = -1;
    console.log("Data " + JSON.stringify(this._actionLogPictureViewModel));
    this.audios.push(this._actionLogPictureViewModel);
    console.log("Picture List : " + JSON.stringify(this.audios));
    jQuery("#btnMDAClose").click();

  }

  addVideoToList() {

    console.log("Data Started . . .");
    this.resetActionLogPictureViewModel();
    console.log("Video Data : " + this.videoData);
    this._actionLogPictureViewModel.fileData = this.videoData;
    this._actionLogPictureViewModel.filename = this._pictureFileName;
    console.log("Data Started . . .1");
    this._actionLogPictureViewModel.description = this._pictureDescription;
    this._actionLogPictureViewModel.id = -1;
    console.log("Data " + JSON.stringify(this._actionLogPictureViewModel));
    this.videos.push(this._actionLogPictureViewModel);
    console.log("Video List : " + JSON.stringify(this.audios));
    jQuery("#btnMDVClose").click();

  }


  saveAction() {
    this._actionLogViewModel.actionCode = jQuery("#actionCode").val();
    this._actionLogViewModel.actionType = jQuery("#actionType").val();
    this._actionLogViewModel.routeToInspectorId = jQuery("#routeToInspectorId").val();
    console.log(this._actionLogViewModel.actionCode)
    console.log(this._actionLogViewModel.actionType)
    console.log(this._actionLogViewModel.routeToInspectorId)
    if (this._actionLogViewModel.id == 0) {
      this._actionLogViewModel.id = -1;
    }
    this._actionLogViewModel.caseMaster = { "id": this._caseId };
    this._actionLogViewModel.actionVersion = (this.getVersion("Action") != -1) ? this._actionVersion : 0;
    this.resetActionLogFileViewModel();

    //console.log("caseAction : " + JSON.stringify(this._actionLogViewModel));
    try {

      switch (this._actionLogViewModel.actionType) {
        case "I":
          {
            this.SaveActionByCategory(this._actionLogViewModel);
          }
          break;
        case "O":
          {
            this.SaveActionByCategory(this._actionLogViewModel);
          }
          break;
        case "P":
          {
            // console.log("Data Started . . .");
            // this.resetActionLogPictureViewModel();
            // //  this._actionLogPictureViewModel = this._actionLogViewModel;
            // console.log(this.imgData);
            // console.log((this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "");
            // this._actionLogPictureViewModel.fileData = (this.imgData.startsWith("data")) ? this.imgData.split(",")[1] : "";
            // this._actionLogPictureViewModel.fileName = this._pictureFileName;
            // console.log("Data Started . . .1");
            // this._actionLogPictureViewModel.description = this._pictureDescription;
            // this._actionLogPictureViewModel.id = -1;
            // console.log("Data " + JSON.stringify(this._actionLogPictureViewModel));

            // this.pictures.push(this._actionLogPictureViewModel);
            this._actionLogViewModel.caseActionFiles = [];
            this.pictures.forEach(e => {
              if (e.fileData != null) {
                e.fileData = (e.fileData.startsWith("data")) ? e.fileData.split(",")[1] : ""
              }
              this._actionLogViewModel.caseActionFiles.push(e);
            });
            this.audios.forEach(e => {
              if (e.fileData != null) {
                e.fileData = (e.fileData.startsWith("data")) ? e.fileData.split(",")[1] : ""
              }
              this._actionLogViewModel.caseActionFiles.push(e);
            });
            this.videos.forEach(e => {
              if (e.fileData != null) {
                e.fileData = (e.fileData.startsWith("data")) ? e.fileData.split(",")[1] : ""
              }
              this._actionLogViewModel.caseActionFiles.push(e);
            });
            // this._actionLogViewModel.caseActionFiles = this.pictures;
            console.log("Picture JSON : " + JSON.stringify(this._actionLogViewModel));
            this.SaveActionByCategory(this._actionLogViewModel);
          }
          break;
        case "F":
          {
            this._actionLogFileViewModel = this._actionLogViewModel;
            this._actionLogFileViewModel.fileData = (this._actionFileContentAsString.startsWith("data")) ? this._actionFileContentAsString.split(",")[1] : "";
            this._actionLogFileViewModel.fileName = this._actionFileName;
            this._actionLogFileViewModel.phone = "";
            this._actionLogFileViewModel.physicalFileName = "";
            this._actionLogFileViewModel.actionCode = jQuery('#actionCode').val();
            console.log(JSON.stringify(this._actionLogFileViewModel));
            this.SaveActionByCategory(this._actionLogFileViewModel);
          }
          break;
        case "C":
          {

            this._citationViewModel.id = this._actionLogViewModel.id;
            this._citationViewModel.actionCode = this._actionLogViewModel.actionCode;
            this._citationViewModel.actionDate = this._actionLogViewModel.actionDate;
            this._citationViewModel.actionType = this._actionLogViewModel.actionType;
            this._citationViewModel.actionVersion = this._actionLogViewModel.actionVersion;
            this._citationViewModel.caseMaster = this._actionLogViewModel.caseMaster;
            this._citationViewModel.comments = this._actionLogViewModel.comments;
            this._citationViewModel.readDate = this._actionLogViewModel.readDate;
            this._citationViewModel.routeToInspectorId = this._actionLogViewModel.routeToInspectorId;
            this._citationViewModel.isRead = this._actionLogViewModel.isRead;
            this._citationViewModel.createdBy = this._actionLogViewModel.createdBy;
            this._citationViewModel.createdOn = this._actionLogViewModel.createdOn;
            this._citationViewModel.modifiedBy = this._actionLogViewModel.modifiedBy;
            this._citationViewModel.modifiedOn = this._actionLogViewModel.modifiedOn;
            this._citationViewModel.status = this._actionLogViewModel.status;
            console.log("Action Log Citiation : " + JSON.stringify(this._citationViewModel));
            this.SaveActionByCategory(this._citationViewModel);
          }
          break;
        case "T":
          {
            this._actionLogTypeViewModel.id = this._actionLogViewModel.id;
            this._actionLogTypeViewModel.actionCode = this._actionLogViewModel.actionCode;
            this._actionLogTypeViewModel.actionDate = this._actionLogViewModel.actionDate;
            this._actionLogTypeViewModel.actionType = this._actionLogViewModel.actionType;
            this._actionLogTypeViewModel.actionVersion = this._actionLogViewModel.actionVersion;
            this._actionLogTypeViewModel.caseMaster = this._actionLogViewModel.caseMaster;
            this._actionLogTypeViewModel.comments = this._actionLogViewModel.comments;
            this._actionLogTypeViewModel.readDate = this._actionLogViewModel.readDate;
            this._actionLogTypeViewModel.routeToInspectorId = this._actionLogViewModel.routeToInspectorId;
            this._actionLogTypeViewModel.isRead = this._actionLogViewModel.isRead;
            this._actionLogTypeViewModel.createdBy = this._actionLogViewModel.createdBy;
            this._actionLogTypeViewModel.createdOn = this._actionLogViewModel.createdOn;
            this._actionLogTypeViewModel.modifiedBy = this._actionLogViewModel.modifiedBy;
            this._actionLogTypeViewModel.modifiedOn = this._actionLogViewModel.modifiedOn;
            this._actionLogTypeViewModel.status = this._actionLogViewModel.status;
            console.log("Action Log Type : " + JSON.stringify(this._actionLogTypeViewModel));
            this.SaveActionByCategory(this._actionLogTypeViewModel);
            break;
          }
        case "A":
          {
            this._actionLogAppointmentViewModel.id = this._actionLogViewModel.id;
            this._actionLogAppointmentViewModel.actionCode = this._actionLogViewModel.actionCode;
            this._actionLogAppointmentViewModel.actionDate = this._actionLogViewModel.actionDate;
            this._actionLogAppointmentViewModel.actionType = this._actionLogViewModel.actionType;
            this._actionLogAppointmentViewModel.actionVersion = this._actionLogViewModel.actionVersion;
            this._actionLogAppointmentViewModel.caseMaster = this._actionLogViewModel.caseMaster;
            this._actionLogAppointmentViewModel.comments = this._actionLogViewModel.comments;
            this._actionLogAppointmentViewModel.readDate = this._actionLogViewModel.readDate;
            this._actionLogAppointmentViewModel.routeToInspectorId = this._actionLogViewModel.routeToInspectorId;
            this._actionLogAppointmentViewModel.isRead = this._actionLogViewModel.isRead;
            this._actionLogAppointmentViewModel.createdBy = this._actionLogViewModel.createdBy;
            this._actionLogAppointmentViewModel.createdOn = this._actionLogViewModel.createdOn;
            this._actionLogAppointmentViewModel.modifiedBy = this._actionLogViewModel.modifiedBy;
            this._actionLogAppointmentViewModel.modifiedOn = this._actionLogViewModel.modifiedOn;
            this._actionLogAppointmentViewModel.status = this._actionLogViewModel.status;
            console.log("Action Log Type : " + JSON.stringify(this._actionLogAppointmentViewModel));
            this.SaveActionByCategory(this._actionLogAppointmentViewModel);
            break;
          }
      }

    } catch (error) {
      Lobibox.notify('error', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: 'Unable to save people information. Please contact IT Helpdesk.'
      });
    }

  }


  onFileChange(event: any) {
    this._actionFileName = event.target.files[0].name;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this._actionFileContentAsString = reader.result as string;
      console.log(this._actionFileContentAsString);
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }


  SaveFollowUpAction() {



    if (this._followupActionLogViewModel.id == 0) {
      this._followupActionLogViewModel.id = -1;
    }
    this._followupActionLogViewModel.caseMaster = { "id": this._caseId };
    this._followupActionLogViewModel.actionVersion = (this.getVersion("Action") != -1) ? this._actionVersion : 0;
    console.log("Follow Up Action : " + JSON.stringify(this._followupActionLogViewModel));
    this._complaintServiceCall.saveByMethodName(this._urlConstant.CaseMasterModule, this._urlConstant.SaveAction, this._followupActionLogViewModel).subscribe((response) => {
      if (response.status == "SUCCESS") {
        // this.loadCaseDetail(this._caseId);
        Lobibox.notify('success', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Action saved successfully.'
        });

        this._caseDetail = response.data[0];

        this.resetFollowUpActionLogViewModel();
        this._enableSave = true;
        jQuery('.nav-tabs a[href="#action-list"]').tab('show');
      } else {
        let err: [] = JSON.parse(response.errorMessage);
        let errM: any = err.join('<br/>');
        Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Unable to action log.<br/>' + errM
        });
      }
    },
      (error) => {
        console.log("Error : " + JSON.stringify(error));
        Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Unable to save people information. Please contact IT Helpdesk.'
        });
      });

  }



  SaveActionByCategory(entity: any) {
    console.log("Entity Action : " + JSON.stringify(entity));
    this._complaintServiceCall.saveByMethodName(this._urlConstant.CaseMasterModule, this._urlConstant.SaveAction, entity).subscribe((response) => {
      if (response.status == "SUCCESS") {
        // this.loadCaseDetail(this._caseId);
        Lobibox.notify('success', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Action saved successfully.'
        });
        console.log("Action Saved Response : " + JSON.stringify(response));
        jQuery("#addOrEditAction").hide();
        //jQuery("#action-list").show();
        //jQuery("#actionGrid").show();

        this._caseDetail = response.data[0];
        console.log("Save Action Response : " + JSON.stringify(response));
        this.InitializeActionTable();
        if (this._actionsTable && this._caseDetail.caseActions) {
          this._actionsTable.clear().rows.add(this._caseDetail.caseActions).draw();
          this.addComments(); // Add short descriptions for new rows
        }
        this.resetActionLogViewModel();
        this._enableSave = true;
        if (entity.actionCode == "P") {
          jQuery("#btnMDPClose").click();
        }
        if (entity.actionType == "I") {
          this.SaveFollowUpAction();
        }
        jQuery('.nav-tabs a[href="#action-list"]').tab('show');
      } else {
        let err: [] = [];
        let errM: any;
        let isErrMessageJson: boolean = false;
        try {
          JSON.parse(response.errorMessage);
          isErrMessageJson = true;
        } catch (error) {
        }
        if (isErrMessageJson) {
          err = JSON.parse(response.errorMessage);
          errM = err.join('<br/>');
        } else {
          errM = response.errorMessage;
        }

        Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Unable to action log.<br/>' + errM
        });
      }
    },
      (error) => {
        console.log("Error : " + JSON.stringify(error));
        Lobibox.notify('error', {
          pauseDelayOnHover: true,
          continueDelayOnInactiveTab: false,
          position: 'top right',
          icon: 'bx bx-check-circle',
          msg: 'Unable to save people information. Please contact IT Helpdesk.'
        });
      });

  }




  addNewActionLog() {
    // jQuery("#action-list").hide();
    this.InitializeActionLog();
    jQuery("#action-add-edit").show();
    jQuery("#addOrEditAction").show();
    jQuery("#inspectionViolation").hide();
    jQuery("#inspection-violation-list").show();
    jQuery("#followUpAction").hide();
    jQuery("#citationDetails").hide();
    jQuery("#taskDetails").hide();
    jQuery("#audio").hide();
    jQuery("#picture").hide();
    jQuery("#video").hide();
    jQuery("#appointmentInformations").hide();
    // jQuery("#actionGrid").hide();
    jQuery("#navigationAction").hide();
    jQuery('.nav-tabs a[href="#action-add-edit"]').tab('show');
    jQuery('.nav-tabs a[href="#actionAddOrEdit"]').tab('show');
    this.resetActionLogViewModel();

  }

  bindToggleEvents() {
    jQuery('#tblnotes').off('click', '.toggle-button').on('click', '.toggle-button', (event: any) => {
      const button = jQuery(event.currentTarget);
      const rowId = parseInt(button.data('id'), 10);

      // Toggle active state in notedetails
      const rowIndex = this.notedetails.findIndex((item: any) => item.id === rowId);
      if (rowIndex !== -1) {
        this.notedetails[rowIndex].isActive = !this.notedetails[rowIndex].isActive;

        // Reinitialize the row data in DataTable
        const table = jQuery('#tblnotes').DataTable();
        table.row(button.parents('tr')).data(this.notedetails[rowIndex]).draw(false);
      }
    });
  }


  saveNotes() {
    if (jQuery('#noteInput').val()) {
      const addValue = {
        id: this.notedetails.length + 1,
        notes: jQuery('#noteInput').val(),
        isActive: true,
        status: 'Completed',
        createdBy: jQuery('#createdByInput').val(),
        createdDate: jQuery('#createdDate').val()
      }

      this.notedetails.push(addValue);
      this.initializeNoteTable();
      this.bindToggleEvents();
      jQuery('#addNewModal').modal('hide');
    }
    else {
      jQuery('#noteError').html('Kindly Fill the Note Description')
    }
  }

  cancelAction() {
    jQuery("#addOrEditAction").hide();
    //jQuery("#action-add-edit").hide();
    //jQuery("#action-list").show();
    //jQuery("#actionGrid").show();
    jQuery('.nav-tabs a[href="#action-list"]').tab('show');
    jQuery("#inspectionViolation").hide();
    jQuery("#followUpAction").hide();
    jQuery("#navigationAction").show();
    this.resetActionLogViewModel();
  }


  addNewPicture() {
    this.imgData = "";
    this._pictureDescription = "";
    jQuery("#pictureUploadMDL").modal("show");
  }

  addNewAudio() {
    this.audioData = "";
    this._pictureDescription = "";
    jQuery("#audioUploadMDL").modal("show");
  }

  addNewVideo() {
    this.videoData = "";
    this._pictureDescription = "";
    jQuery("#videoUploadMDL").modal("show");
  }

  onPictureChange(event: any) {
    this._pictureFileName = event.target.files[0].name;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.imgData = reader.result as string;
      console.log(this.imgData);
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onAudioChange(event: any) {
    this._pictureFileName = event.target.files[0].name;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.audioData = reader.result as string;
      console.log(this.audioData);
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onVideoChange(event: any) {
    this._pictureFileName = event.target.files[0].name;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.videoData = reader.result as string;
      console.log(this.videoData);
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  nextTab(index: any) {
    let nindex = (index + 1);
    this._currentStepIndex = nindex;
    jQuery(".bs-stepper-pane").removeClass("active");
    jQuery(".step").removeClass("active");
    jQuery(".bs-stepper-pane").removeClass("dstepper-block");
    jQuery("#step-l-" + nindex).addClass(" active ");
    jQuery("#step-l-" + nindex).addClass(" dstepper-block ");
    jQuery(".step").removeClass("active");
    $("div[data-target='#step-l-" + nindex + "']").addClass(" active ");
    jQuery("#stepper1trigger" + nindex).removeAttr("disabled");
    switch (this._currentStepIndex) {
      case 3:
        jQuery("#violation-list").show();
        jQuery("#addOrEditViolation").hide();
        jQuery("#navigationViolation").show();
        break;
      case 5:
        jQuery("#action-list").show();
        jQuery("#addOrEditAction").hide();
        jQuery("#navigationAction").show();
        break;
    }
  }

  stepClick(index: any) {
    if (jQuery("#stepper1trigger" + index).attr("disabled") == undefined) {
      jQuery(".bs-stepper-pane").removeClass("active");
      jQuery(".bs-stepper-pane").removeClass("dstepper-block");
      jQuery("#step-l-" + index).addClass(" active ");
      jQuery("#step-l-" + index).addClass(" dstepper-block ");
      jQuery("#stepper1trigger" + index).removeAttr("disabled");
      jQuery(".step").removeClass("active");
      $("div[data-target='#step-l-" + index + "']").addClass(" active ");
    }
  }

  previousTab(index: any) {
    let pindex = (index - 1);
    this._currentStepIndex = pindex;
    jQuery(".bs-stepper-pane").removeClass("active");
    jQuery(".bs-stepper-pane").removeClass("dstepper-block");
    jQuery("#step-l-" + pindex).addClass(" active ");
    jQuery("#step-l-" + pindex).addClass(" dstepper-block ");
    jQuery(".step").removeClass("active");
    $("div[data-target='#step-l-" + pindex + "']").addClass(" active ");
  }

  viewMap() {
    if (jQuery("#googleMap").hasClass("d-none")) {
      jQuery("#googleMap").removeClass("d-none");
      jQuery("#btnMap").text("Hide Map");
    } else {
      jQuery("#googleMap").addClass("d-none");
      jQuery("#btnMap").text("View Map");
    }

  }

  showCaseHistory() {
    if (jQuery("#caseHistoryList").hasClass("d-none")) {
      jQuery("#caseHistoryList").removeClass("d-none");
      jQuery("#btnCaseHistory").text("Hide Case History");
    } else {
      jQuery("#caseHistoryList").addClass("d-none");
      jQuery("#btnCaseHistory").text("View Case History");
    }

    jQuery("#btnMap").text("View Map");

  }
  nextPeople() {
    stepper1.next();
    jQuery("#btnSaveAll").removeClass("d-none");
    jQuery("#autoSave").removeClass("d-none");
  }
  addNew() {
    this.resetMockViewModel();
    jQuery("#itemInfo").modal("show");
  }
  addNewPerson() {
    this.InitializePersonModel();
    if (this._isEdit) {

      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._newPersonAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }
    jQuery("#personList").show();
    jQuery("#addOrEditPerson").show();
    jQuery("#navigationPerson").hide();
    jQuery('.nav-tabs a[href="#person-add-edit"]').tab('show');
    this.resetCasePersonViewModel();
    this._isEdit = true;
  }
  addNewViolation() {
    if (this._isEdit) {

      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._newViolationAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }
    this.InitializeViolation();
    jQuery("#violationGrid").show();
    jQuery("#addOrEditViolation").show();
    jQuery('#violation-add-edit').show();
    jQuery("#navigationViolation").hide();
    jQuery('.nav-tabs a[href="#violation-add-edit"]').tab('show');
    this.resetViolationViewModel();
    this._isEdit = true;
  }

  addInspectionViolation() {
    if (this._isEdit) {
      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._newViolationAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }
    // jQuery("#inspection-violation-list").hide();

    jQuery("#addOrEditInspectionViolation").show();
    jQuery('#inspection-violation-add-edit').show();
    jQuery('.nav-tabs a[href="#inspection-violation-add-edit"]').tab('show');
    this.InitializeViolation();
    this.resetViolationViewModel();
    this._isEdit = true;
  }



  actionTab(index: any) {
    switch (index) {
      case 1:
        jQuery("#tab1").show();
        jQuery("#tab2").hide();
        jQuery("#tab3").hide();
        break;
      case 2:
        jQuery("#tab1").hide();
        jQuery("#tab2").show();
        jQuery("#tab3").hide();
        break;
      case 3:
        jQuery("#tab1").hide();
        jQuery("#tab2").hide();
        jQuery("#tab3").show();
        break;

    }
  }
  edit(item: any) {
    this._mockupViewModel = item;
    jQuery("#itemInfo").modal("show");
  }
  editPerson(person: any) {
    this._editData = person;
    if (this._isEdit) {

      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._editPersonAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }
    this._isEdit = true;
    this._casePersonViewModel = person;
    this._casePersonViewModel.personVersion = (this.getVersion("Person") != -1) ? this._personVersion : 0;

  }
  editPersonForTable() {
    let d = this._personTable.rows('.selected');
    if (this.isNull(d) || d.length == 0) {
      alert("Please select person to edit.");
      return;
    }
    let data = d.data();

    if (this._isEdit) {

      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._editPersonAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }
    this._casePersonViewModel = this._personDataList.find((x: any) => x.id == data[0].id);

    // this.InitializePersonModel();
    this._casePersonViewModel.personVersion = (this.getVersion("Person") != -1) ? this._personVersion : 0;

    jQuery("#personList").show();
    jQuery("#addOrEditPerson").show();
    jQuery("#navigationPerson").hide();
    jQuery('.nav-tabs a[href="#person-add-edit"]').tab('show');
    this._isEdit = true;
  }
  _editData: any;
  editActionViolation(violation: any) {
    this._editData = violation;
    if (this._isEdit) {
      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._editVilationAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }

    this._caseViolationViewModel = violation;

    this._caseViolationViewModel.inspectionVersion = (this.getVersion("Violation") != -1) ? this._violationVersion : 0;
    console.log("Violation Save : " + JSON.stringify(this._caseViolationViewModel));
    // jQuery("#violationGrid").hide();
    // jQuery("#frmViolation").show();
    // jQuery("#navigationViolation").hide();
    this.InitializeViolation();
    jQuery("#addOrEditInspectionViolation").show();
    jQuery("#inspection-violation-list").hide();
    jQuery('.nav-tabs a[href="#inspection-violation-add-edit"]').tab('show');
    this._isEdit = true;
  }
  editViolationfromTable(i: any) {
    let violation = this._caseDetail.caseViolation.find((v: any) => v.id == i);
    if (violation != undefined) {
      this.editViolation(violation);
    }
  }
  editViolation(violation: any) {
    this._editData = violation;
    if (this._isEdit) {

      this._messageText = "Do you want to cancel current editing with this action?";
      this._actionType = this._editVilationAction;
      jQuery("#messageEditDialogBox").modal("show");
      return;
    }
    this.isMunicodeHasData = false;
    this.isDescriptionHasData = false;
    this.isCorrectiveActionHasData = false;
    this._violationErrorSummary = [];
    this._caseViolationViewModel = violation;
    this.pastDate = this._caseViolationViewModel.duedate;
    this.InitializeViolation();
    this._caseViolationViewModel.inspectionVersion = (this.getVersion("Violation") != -1) ? this._violationVersion : 0;
    console.log("Violation Save : " + JSON.stringify(this._caseViolationViewModel));
    // jQuery("#violationGrid").hide();
    // jQuery("#frmViolation").show();
    // jQuery("#navigationViolation").hide();

    jQuery("#violationGrid").show();
    jQuery("#addOrEditViolation").show();
    jQuery('#violation-add-edit').show();
    jQuery("#navigationPerson").hide();
    jQuery('.nav-tabs a[href="#violation-add-edit"]').tab('show');
    this._isEdit = true;
  }


  getVersion(module: string) {
    let versionList = []
    if (this._caseDetail.caseVersions != undefined) {
      versionList = this._caseDetail.caseVersions;
      for (var i = 0; i < versionList.length; i++) {
        switch (module) {
          case "Person":
            this._personVersion = versionList[i].version;
            if (versionList[i].objecttype == module) {
              return this._personVersion;
            }
            break;
          case "Violation":
            this._violationVersion = versionList[i].version;
            if (versionList[i].objecttype == module) {
              return this._violationVersion;
            }
            break;
          case "Action":
            this._actionVersion = versionList[i].version;
            if (versionList[i].objecttype == module) {
              return this._actionVersion;
            }
            break;
        }
      }
    }
    return -1;
  }
  removePersonForTable() {
    let d = this._personTable.rows('.selected');
    if (this.isNull(d)) {
      return;
    }
    let data = d.data();
    let person = this._personDataList.find((x: any) => x.id == data[0].id);
    if (confirm("Are you sure to remove " + person.firstname + " ?")) {

      console.log("Person : " + JSON.stringify(person));

      this._complaintServiceCall.getByID(this._urlConstant.CaseMasterModule, this._urlConstant.GetByID, this._caseId).subscribe((response) => {
        if (response.status == "SUCCESS") {
          let versionList = []
          versionList = response.data[0].caseVersions;
          for (var i = 0; i < versionList.length; i++) {
            switch (versionList[i].objecttype) {
              case "Person":
                this._personVersion = versionList[i].version;
                {
                  this._complaintServiceCall.removeByMethodNameAndID(this._urlConstant.CaseMasterModule, this._urlConstant.RemovePerson, "id=" + this._caseId + "&personId=" + person.id + "&version=" + this._personVersion).subscribe((response) => {
                    this._addressSearchResultDataList = [];
                    if (response.status == "SUCCESS") {
                      Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Person Removed Successfully.'
                      });
                      this._caseDetail = response.data[0];
                      this._personDataList = (this._caseDetail.casePerson.filter((e: any) => e.status));
                      this._personTable.clear().rows.add(this._personDataList).draw();
                    } else {
                      Lobibox.notify('error', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Unable to remove person. Please contact IT Helpdesk.'
                      });
                    }
                  });
                }
                break;
            }
          }
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to receive case details. Please contact IT Helpdesk.'
          });
        }
      });



    }
  }
  removePerson(person: any) {
    if (confirm("Are you sure to remove " + person.firstname + " ?")) {

      console.log("Person : " + JSON.stringify(person));

      this._complaintServiceCall.getByID(this._urlConstant.CaseMasterModule, this._urlConstant.GetByID, this._caseId).subscribe((response) => {
        if (response.status == "SUCCESS") {
          let versionList = []
          versionList = response.data[0].caseVersions;
          for (var i = 0; i < versionList.length; i++) {
            switch (versionList[i].objecttype) {
              case "Person":
                this._personVersion = versionList[i].version;
                {
                  this._complaintServiceCall.removeByMethodNameAndID(this._urlConstant.CaseMasterModule, this._urlConstant.RemovePerson, "id=" + this._caseId + "&personId=" + person.id + "&version=" + this._personVersion).subscribe((response) => {
                    this._addressSearchResultDataList = [];
                    if (response.status == "SUCCESS") {
                      Lobibox.notify('success', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Person Removed Successfully.'
                      });
                      //this.loadCaseDetail(this._caseId);
                    } else {
                      Lobibox.notify('error', {
                        pauseDelayOnHover: true,
                        continueDelayOnInactiveTab: false,
                        position: 'top right',
                        icon: 'bx bx-check-circle',
                        msg: 'Unable to remove person. Please contact IT Helpdesk.'
                      });
                    }
                  });
                }
                break;
            }
          }
        } else {
          Lobibox.notify('error', {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            icon: 'bx bx-check-circle',
            msg: 'Unable to receive case details. Please contact IT Helpdesk.'
          });
        }
      });



    }

  }

  resetReport() {
    jQuery("#caseHistoryReport").hide();
    jQuery("#propertyAndCaseHistory").hide();
  }



  loadInfo() {
    jQuery("#caseHistoryReport").show();
    jQuery("#propertyAndCaseHistory").show();
  }



  salutationFocusoutEvent(errorMessage: string) {
    let val = jQuery('#salutation').val();
    if ((val == null) || (val.length == 0)) {
      this.isSalClicked = true;
      this.salutationErrorMessage = errorMessage;
    } else {
      this.isSalClicked = false;
      this.salutationErrorMessage = '';
    }
  }
  personTypeFocusoutEvent(errorMessage: string) {
    let val = jQuery('#personType').val();
    this.isPersonTypeClicked = false;
    if ((val == null) || (val.length == 0)) {
      this.isPersonTypeClicked = true;
      this.personTypeErrorMessage = errorMessage;
    } else {
      this.isPersonTypeClicked = false;
      this.personTypeErrorMessage = '';
    }
  }
  focusoutPhone1(data: any, errorMessage: string) {
    if (data.length == 0) {
      this.isPhone1hasData = false;

    } else {
      this.isPhone1hasData = true;
      if (errorMessage.length > 0)
        this.isPhone1ErrorMessage = errorMessage;
    }

  }
  focusoutPhone2(data: any, errorMessage: string) {
    if (data.length == 0) {
      this.isPhone2hasData = false;
    } else {
      this.isPhone2hasData = true;
      if (errorMessage.length > 0)
        this.isPhone2ErrorMessage = errorMessage;
    }
  }
  firstnameFocusOut() {
    let val = jQuery('#firstName').val();
    if (this.isFirstNameHasData == false) {
      if (val.length > 0) {

      }
    }

  }
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 37.33112960486265,
    lng: -121.88850402832031
  };
  zoom = 13.5;

  mapReady(map: any) {
    const bonds: any = new google.maps.LatLngBounds();
    bonds.extend(new google.maps.LatLng(37.33112960486265, -121.88850402832031));
    map.fitBounds(bonds);
  }
  moveMap(event: google.maps.MapMouseEvent) {
    let street_number, streetname, streettype;
    console.log("LATLONG : " + JSON.stringify(event.latLng.toJSON()));
    if (event.latLng != null) this.center = (event.latLng.toJSON());

    let geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

    geocoder.geocode({ location: latlng }, (results, status) => {
      let self = this;
      self._mapAddressList = [];
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log('Map Selected Result:', results);
          let i = 1;
          let res = results[0];
          res.address_components.forEach((c: any) => {
            console.log('c:', c);
            if (c.types[0] == 'street_number') {
              street_number = c.short_name;
              console.log('street number=', street_number.trim());
            }
            if (c.types[0] == 'route') {
              let arr = c.short_name.split(' ')
              streettype = arr[arr.length - 1].trim()
              streetname = arr.slice(0, arr.length - 1).join(' ').trim()``;
              console.log('streettype=', streettype);
              console.log('streettype=', streetname);

            }
          });
          // results.forEach((v: any) => {
          //   //console.log(i++ + 'Address:', v.address_components[0].long_name + ',' + v.address_components[1].long_name + ',' + v.address_components[3].long_name + ',' + v.address_components[5].short_name + ' ' + v.address_components[7].short_name);
          //   console.log('Address:', v.formatted_address);
          //   //_mapAddressList.push(v.formatted_address);
          //   if (v.formatted_address.split(',').length >= 4) {
          //     self._mapAddressList.push(v.formatted_address);
          //   }
          // })

          //alert(JSON.stringify(self._mapAddressList));
          jQuery('#mapAddressList').modal('show');
        } else {
          console.log('Location not found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });

  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
