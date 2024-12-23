import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURLConstant } from '../api.url.constant';
import { HttpRequestResponseHandlerService } from './http-request-response-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ViewAllNotificationService extends HttpRequestResponseHandlerService {
    constructor(
        private _httpViewAllNotificationService: HttpClient,
        private _apiUrlConstants: APIURLConstant
    ) {
        super(_httpViewAllNotificationService, _apiUrlConstants);
    }
}