export class UserModel {
    id: any;
    name: string;
    email: string;
    status: boolean;
    lastLoginDate: Date;
    approveStatus: string;
    openCases: string;
    role: Role;
    noofnotices: any;
    pageEvents:PageEvents[];
    pages:Page[];
    userProfiles:UserProfile[];
    inspectors:UserModel[] = [];
    roleActions():void {
        let pe:PageEvents[]=this.pageEvents.filter((x:any)=>x.pageId==this.role.id);
        console.log(pe);
        pe.forEach(item => {
          if(item.pageEvent!=null && !this.isNull(item.pageEvent.tagId)){
            jQuery('#'+item.pageEvent.tagId).show();
          }
        });
        jQuery('.roleHide').remove();
      }

      isNull(d: any) : boolean{
        return d == null || d == undefined;
      }
}
export class SearchProfileData {
  SearchType:string;
  SimpleSearchData:any;
  AdvancedSearchData:any;
}

export class UserProfile {
  id:any;
  name:string;
  profileType:string;
  profileData:string;
  status: boolean = true;
}
export class Page{
  id:any;
  pageTagId:string;
}
export class PageEvents{
    id:any;
    pageId:any;
    pageEvent:PageEvent;
}
export class PageEvent{
    id:any;
    pageEventName:string;
    status:boolean;
    tagId:string;
}
export class Role {
    id: any;
    status: boolean;
    rolename: string;
    isinspector: boolean;
}

export class RejectRequest {
    id: any;
    rejectReason: string;
}