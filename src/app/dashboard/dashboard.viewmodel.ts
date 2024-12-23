export class Dashboard{
    id:any ;
    name:any;
    widgets:DashboardWidget[]=[];
}

export class DashboardWidget{
    id:any;
    row:any;
    col:any;
    displaycount:any;
    displaytext:string;
    classname:string;
    
}