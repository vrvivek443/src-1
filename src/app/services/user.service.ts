import { Injectable } from '@angular/core';
import { HttpRequestResponseHandlerService } from './http-request-response-handler.service';
import { HttpClient } from '@angular/common/http';
import { APIURLConstant } from '../api.url.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpRequestResponseHandlerService {

  constructor(
    private _httpComplaintService: HttpClient,
    private _apiURLConstants: APIURLConstant
  ) {
    super(_httpComplaintService, _apiURLConstants);
  }
}
