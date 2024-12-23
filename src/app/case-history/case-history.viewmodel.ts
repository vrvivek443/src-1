export class CaseHistoryViewModel {
    caseno: string;
    inspector: string;
    supervisor: string;
    program: string;
    violationtype: string;
    housingpermit: string;
    apn: string;
    admincitation: string;
    source: string;
    tpd: string;
    addressnumber: string;
    direction: string;
    name: string;
    type: string;
    unit: string;
    crossstreet: string;
    status: string;
    responsibleparty: string;
    caseperson: string;
    casepriority: string;
    cdbg: string;
    casedescription: string;
    street: string;
    casedate: string;
}

export class CaseSearchResult {
    caseno: string;
    address: string;
    program: string;
    cudate: string;
    status: string;
    opendate: string;
    closedate: string;
    inspector: string;
    policedistrict: string;
    casedescription: string;
}

// export class SimpleSearchViewModel {
//     caseId: any[] = [];
//     inspectorId: any[] = [];
//     programtype: any[] = [];
//     houseNumber: any[] = [];
//     status: any[] = [];
//     street: any[] = [];
// }
export class SimpleSearchExViewModel {
    caseId: any[] = [];
    inspectorId: any[] = [];
    supervisorId: any[] = [];
    programType: any[] = [];
    houseNumber: any[] = [];
    status: any[] = [];
    street: any[] = [];
    // createDate: string;
    // cuDate: string;
    // modifiedDate: string;
}
export class AdvancedSearchViewModel {
    //adminCiatation: string;
    apn: any[] = [];
    caseId: any[] = [];
    //cdbg: any[];
    createDate: string;
    cuDate: string;
    description: string;
    houseNumber: any[] = [];
    housingPermits: any[] = [];
    inspectorId: any[] = [];
    priorityType: any[] = [];
    programType: any[] = [];
    //responsiblePerson: string;
    sources: any[] = [];
    // starred: string;
    status: string[] = [];
    street: any[] = [];
    violationType: any[] = [];
    supervisorId: any[] = [];
}
// caseId: any[] = [];
// status: any[] = [];
// source: any[] = [];
// programType: any[] = [];
// inspectorId: any[] = [];
// casePriority: any[] = [];
// caseDate: any;
// violationType: any[] = [];
// // cdbg: any[] = [];
// // adminCitation: any[] = [];
// caseDescription: any;
// APN: any[] = [];
// number: any[] = [];
// street: any[] = [];
// housePermit: any;
// // responsibleParty: any[] = [];
// addressNumber: any[] = [];

export class CaseHistoryInputData {
    caseno: string;
    inspector: string;
    program: string;
    violationtype: string;
    housepermit: string;
    apn: string;
}
