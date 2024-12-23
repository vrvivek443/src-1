import { Role } from "../user/user.viewmodel";

export class UserModel1 {
    id: any;
    name:string;
    email:string;
    status:boolean;
    lastLoginDate:Date;
    approveStatus:string;
    openCases: string;
    roleid:Role;
}
