import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURLConstant } from '../api.url.constant';
import { HttpRequestResponseHandlerService } from './http-request-response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService extends HttpRequestResponseHandlerService {
  constructor(
    private _httpComplaintService: HttpClient,
    private _apiURLConstants: APIURLConstant
  ) {
    super(_httpComplaintService, _apiURLConstants);
  }
}
