import { Component } from "@angular/core";
import { PageEvents, UserModel } from "./user/user.viewmodel";

declare var Lobibox: any;

export class APIURLConstant {


  public APIBaseURL: string = "http://localhost:8001/api/";
  public APIRootURL: string = "http://localhost:8001/";
  // http://localhost:8001/api/casemaster/streamFileForActionFile?caseId=2&actionId=21&actionFileId=6

  // Modules

  public ViolationModule: string = "violation/";
  public CategoryModule: string = "categorydata/";
  public ViolationTypeModule: string = "violationtype/";
  public StreetMasterModule: string = "streetmaster/";
  public CityAddressModule: string = "cityaddress/";
  public CaseMasterModule: string = "casemaster/";
  public CaseDataModule: string = "assignmentmap/";
  public UserDataModule: string = "user/";
  public RoleDataModule: string = "role/";
  public ActionModule: string = "actions/"
  public StreetMasterTypeModule: string = "streetmaster/"
  public InspectorModule: string = "user/"
  public InspectorMappingModule: string = "inspectormapping/"
  // Methods
  public Save: string = "upsert";
  public GetAll: string = "getAll";
  public CaseStatus: string = "caseStatus";
  public CaseEditStatus: string[] = ['O', 'D', 'RO'];
  public CaseApprovalStatus: string = 'CO';
  public Delete: string = "delete";
  public Approve: string = "approve";
  public Reject: string = "reject";
  public ReadMessage: string = "messageRead";
  public GetNotices: string = "getNotices";
  public GetAllInspector = "getAllInspector";
  public GetAllSupervisor = "getAllSupervisor";
  public GetAllActive: string = "GetAllActive";
  public GetByID: string = "getById";
  public RemoveByID: string = "RemoveByID";
  public RemovePerson: string = "deletePerson";
  public Search: string = "search";
  public GetAddressByFields: string = "getAddressByFields";
  public GetInspectorsForProgram: string = "getInspectorsForProgram";
  public SavePerson: string = "upsertPerson";
  public SaveViolation: string = "upsertViolation";
  public SaveAction: string = "upsertAction";
  public MessageRead: string = 'messageRead';
  public streamFileForActionFile: string = "streamFileForActionFile";
  public DeleteUserProfile: string = "deleteUserProfile";

  public PersonTypeResponsiblePerson: string = "RR";


  // Category
  public AreaType: string = "AreaType";
  public ComplaintType: string = "ComplaintType"
  public CoreServiceType: string = "CoreServiceType"
  public DispositionType: string = "DispositionType"
  public PhoneType: string = "PhoneType"
  public PriorityType: string = "PriorityType"
  public ProgramType: string = "ProgramType"
  public RelationshipType: string = "RelationshipType"
  public SalutationType: string = "SalutationType"
  public ServiceAreaType: string = "ServiceAreaType"
  public StreetType: string = "StreetType"
  public PersonType: string = "PersonType";
  public SourceType: string = "SourceType";
  public CaseStatusType: string = "CaseStatusType";
  public CBDGType: string = "CDBGType";
  public ActionType: string = "ActionType";
  public ViolationStatusType: string = "ViolationStatus";
  public StatusType: string = "CaseStatusType";
  public TaskStatus: string = "TaskStatus";
  public Dashboard: string = "dashboard";
  public Get: string = "get";
  public GetByCategory: string = "getByCategory";
  public GetCategoryMaster: string = "getAllMaster";
  public SavePropertyNotes: string = "upsertPropertyNotes";
  public Edit: string = "editPropertyNotes";
  public deletePropertyNotes: string = "deletePropertyNotes"
  public upsertCUDateReason: string = "upsertCaseComeUpdateNotes";
  public getPropertyNotesByAPN: string = "getPropertyNotesByAPN";

  public ViewOnlyRole: any = 6;
  public SupervisorRole: any = 3;

  isNull(d: any) {
    return d == null || d == undefined;
  }

  roleActions(u: UserModel, pageId: any): void {
    if (u == null)
      return;
    let pe: PageEvents[] = u.pageEvents.filter((x: any) => x.pageId == pageId);
    console.log(pe);
    pe.forEach(item => {
      if (item.pageEvent != null && !this.isNull(item.pageEvent.tagId)) {
        jQuery('#' + item.pageEvent.tagId).removeClass('roleHide');
      }
    });
    jQuery('.roleHide').remove();
  }
  rolePageActions(_user: UserModel) {
    if (_user == null)
      return;
    _user.pages.forEach(item => {
      if (!this.isNull(item.pageTagId)) {
        jQuery('#' + item.pageTagId).removeClass('rolePageHide');
      }
    });
    jQuery('.rolePageHide').remove();

  }

  getDistinctItems(items: any[], key: string) {
    const seen: { [key: string]: boolean } = {};
    return items.filter(item => {
      const keyValue = item[key];
      if (!seen[keyValue]) {
        seen[keyValue] = true;
        return true;
      }
      return false;
    });
  }
  displayError(str: string) {
    Lobibox.notify('error', {
      pauseDelayOnHover: true,
      continueDelayOnInactiveTab: false,
      position: 'top right',
      icon: 'bx bx-check-circle',
      msg: str
    });
  }
  displaySuccess(str: string) {
    Lobibox.notify('success', {
      pauseDelayOnHover: true,
      continueDelayOnInactiveTab: false,
      position: 'top right',
      icon: 'bx bx-check-circle',
      msg: str
    });
  }
}