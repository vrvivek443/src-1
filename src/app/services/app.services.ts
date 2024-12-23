import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class AppService {
    // private message = new BehaviorSubject('0');
    // getMessage = this.message.asObservable();
    private _userProfile = new BehaviorSubject<any>([]);
    currentList = this._userProfile.asObservable();
    private _noticeCount = new BehaviorSubject<any>([]);
    currentNoticeCount = this._noticeCount.asObservable();
    //_userProfile: any;
    constructor() {

    }
    setMessage(message: any) {
        this._userProfile.next(message);
    }
    setNoticeCount(count: any) {
        this._noticeCount.next(count);
    }
    getMessage(): any { return this._userProfile; }

}