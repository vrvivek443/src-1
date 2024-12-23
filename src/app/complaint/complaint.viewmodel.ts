
export class caseAddressViewModel {
    id: number;
    APN: string;
    buildingpermit: string;
    censusTract: string;
    district: string;
    houseNumber: string;
    housingpermit: string;
    lastinspectionrtndate: Date;
    noofunits: number;
    ownerCityStateZip: string;
    ownerName: string;
    ownerPhone: string;
    ownerStreet: string;
    planningpermit: string;
    policebeat: string;
    policedistrict: string;
    propertycomment: string;
    propertytype: string;
    streetName: string;
    streetType: string;
    taxratearea: string;
    trashpickupday: string;
    trashputoutday: string;
    zoningresearch: string;
}

export class casePersonViewModel {
    address1: string;
    address2: string;
    city: string;
    comment: string;
    createdBy: string;
    createdOn: string;
    email: string;
    firstname: string;
    id: number;
    lastname: string;
    middlename: string;
    modifiedBy: string;
    modifiedOn: string;
    personVersion: number;
    phone1: string;
    phone1type: string;
    phone2: string;
    phone2type: string;
    personType: string;
    relationship: string;
    salutation: string;
    state: string;
    status: boolean;
    zip: string;
    isEditable: boolean;
    caseMaster: any;
}





export class SearchViewModel {
    streetNumber: string;
    streetType: string;
    streetName: string;
    apartmentNumber: string;
    apnNumber: string;
}

export class CaseViewModel {
    id: number;
    version: number;
    caseaddress: CaseAddress;
    hasCasedetail: false;
}

export class CaseAddress {
    id: number;
    apn: string;
}

export class CaseDetailViewModel {
    id: number;
    description: string;
    version: number;
    caseaddress: CaseAddress;
    modifiedby: string;
    createdon: string;
    prioritycode: string;
    inspector1id: string;
    sourcecode: string;
    dispositioncode: string;
    coreservicecode: string;
    cdbgcasetype: string;
    modifiedon: string;
    opendate: string;
    casestatus: string;
    closedate: string;
    receiveddate: any;
    cudate: any;
    inspector2id: string;
    createdby: string;
    programcode: string;
    hasCasedetail: boolean;
}

export class City {
    name: string;
    code: string;
}

export class CaseViolationViewModel {
    id: number;
    inspectionVersion: number;
    area: string;
    caseMaster: any;
    closedate: string;
    correctiveaction: string;
    description: string;
    duedate: string;
    municode: string;
    opendate: string;
    priority: string;
    status: boolean;
    violation: string;
    violationstatus: string;
    violationtype: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
}




export class ActionLogViewModel {
    id: number;
    actionCode: string;
    actionDate: string;
    actionType: string;
    actionVersion: number;
    caseMaster: any;
    caseActionFiles: any[] = [];
    comments: string;
    readDate: string;
    routeToInspectorId: number;
    isRead: boolean;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: boolean


}

export class ActionLogTypeViewModel extends ActionLogViewModel {
    subject: string;
    taskStatus: string;
    startDate: string;
    endDate: string;
}

export class ActionLogAppointmentViewModel extends ActionLogViewModel {
    subject: string;
    location: string;
    startDate: string;
    endDate: string;
}



export class ViolationDataViewModel {
    text: string;
    children: any[];
}

export class ActionLogFileViewModel extends ActionLogViewModel {
    fileData: string;
    filename: string;
    phone: string;
    physicalFileName: string;
}

export class ActionLogPictureViewModel {
    fileData: any;
    id: number;
    filename: string;
    description: string;
    physicalfilename: string;
}





export class ActionLogCitiationViewModel extends ActionLogViewModel {

    amount: number;
    artype: string;
    citiationComments: string;
    citiationDate: string;
    citiationNo: string;
    citiedById: number;
    fdept: string;
    ffbj: string;
    ffund: string;
    frc: string;
    licenseno: string;
    municode: string;
    ref1: string;
    ref2: string;

}
