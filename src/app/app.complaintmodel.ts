export class NoticeView {
    actionDate: any;
    actionDescription: string;
    actionId: any;
    actionName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    message: string;
    isRead: any;
    id: any;
}

export class Category{
    id:number = -1;
    categoryid:number;
    category:string;
    code:string;
    value:string;
    status:boolean;
    isDefault:boolean;
}

export class CaseStatusState{
    id:number = -1;
    tostatus: string;
    fromstatus: string;
}
export class InspectorMapping{
    id:number = -1;
    status:boolean = true;
    programcode:string = "-1";
    censustract:string = "-1";
    inspectorid:number = -1;
}

export class ViolationTypeModel{
    id: number;
    status: boolean;
    cost: any;
    frc: string;
    violationtypecode: string;
    prioritycode: string;
    correctiveaction: string;
    searchmunicipalcode: string;
    searchviolationcode: string;
    violationcode: string;
    searchshortdesc: string;
    uniformcode: string;
    municipalcode: string;
    shortdesc: string;
    alertflag: string;
    fulldesc: string;

}
export class CategoryType{
    id:number;
    category:string;
    canEdit:boolean;
}
export class Action{
    
    id: number = -1;
    actionCode: string;
    actionDescription: string;
    status: boolean;
    actionType: string;
    sqlStatement: string;
    fileName: string;
    confidentialFlag: boolean;
    firstContactFlag: boolean;
    firstWrittenContactFlag: boolean;
    hearingBoardFlag: boolean;
    hearingBoardOtherFlag: boolean;
    mailToRespParties: boolean;
    mailToComplainants: boolean;
    avgTimeGC: string;
    avgTimeVA: string;
    voluntaryCampFlag: boolean;
    flags: string[]=[];
}