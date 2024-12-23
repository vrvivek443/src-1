import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURLConstant } from '../api.url.constant';
import { HttpRequestResponseHandlerService } from './http-request-response-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CaseHistoryService extends HttpRequestResponseHandlerService {
  constructor(
    private _httpCaseHistoryService: HttpClient,
    private _apiUrlConstants: APIURLConstant
  ) {
    super(_httpCaseHistoryService, _apiUrlConstants);
  }
}
