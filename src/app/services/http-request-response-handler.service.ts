import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { APIURLConstant } from '../api.url.constant';
import { HttpResponseViewModel } from './http.response.view.model';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestResponseHandlerService {




  aPIBaseURL = this._apiURLConstant.APIBaseURL;
  authHeader = "";
  constructor(private http: HttpClient, private _apiURLConstant: APIURLConstant) {
    if (localStorage.getItem("username") != null) {
      this.authHeader = "bearer " + localStorage.getItem("username");
      this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authHeader }), };
    }
  }

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authHeader }), };

  save(moduleName: string, entity: any): Observable<HttpResponseViewModel> {
    //  this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accessToken': localStorage.getItem("_accessToken").toString() }), };
    return this.http.post<HttpResponseViewModel>(this.aPIBaseURL + moduleName + this._apiURLConstant.Save, entity, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  saveByMethodName(moduleName: string, methodName: string, entity: any): Observable<HttpResponseViewModel> {
    // this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accessToken': localStorage.getItem("_accessToken").toString() }), };
    return this.http.post<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName, entity, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }


  getByID(moduleName: string, methodName: string, id: number): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName + "?id=" + id, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getAll(moduleName: string): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + this._apiURLConstant.GetAll, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }
  get(moduleName: string, methodName: string): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getAllActive(moduleName: string): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + this._apiURLConstant.GetAllActive, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  search(moduleName: string, methodName: string, parameter: string) {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName + "?" + parameter, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  caseSearch(moduleName: string, methodName: string, data: string) {
    // this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName, data, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }


  removeByID(moduleName: string, id: number): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + this._apiURLConstant.RemoveByID + "?id=" + id, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }
  removeWithID(moduleName: string, id: number): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + "?id=" + id, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  removeByMethodNameAndID(moduleName: string, methodName: string, id: string): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName + "?" + id, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getByModuleMethodAndParameter(moduleName: string, methodName: string, parameter: string): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName + "?" + parameter, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  searchByObjectParameter(moduleName: string, methodName: string, object: any): Observable<HttpResponseViewModel> {
    return this.http.post<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName, object, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getByModuleMethodParameterAndHeader(moduleName: string, methodName: string, parameter: string): Observable<HttpResponseViewModel> {
    // this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accessToken': localStorage.getItem("_accessToken").toString() }), };
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName + "?" + parameter, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getByModuleMethodAndHeader(moduleName: string, methodName: string): Observable<HttpResponseViewModel> {
    //    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accessToken': localStorage.getItem("_accessToken") ? localStorage.getItem("_accessToken").toString() : "" }), };
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  getByModuleAndMethod(moduleName: string, methodName: string): Observable<HttpResponseViewModel> {
    return this.http.get<HttpResponseViewModel>(this.aPIBaseURL + moduleName + methodName, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { // Get client-side 
      errorMessage = error.error.message;
    } else {
      errorMessage = "ErrorCode: ${ error.status } \nMessage: ${ error.message }";
    } if (error.error.errors.Key[0] != undefined) { window.alert(error.error.errors.Key[0]); } else { window.alert(errorMessage); } return throwError(() => { return errorMessage; });
  }
}
