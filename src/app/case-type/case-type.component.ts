import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CaseTypeViewModel } from 'src/app/case-type/case-type.viewmodel';
declare var jQuery: any;

@Component({
  selector: 'app-case-type',
  templateUrl: './case-type.component.html',
  styleUrls: ['./case-type.component.css']
})
export class CaseTypeComponent {
  public caseTypeDataList: any;
  _selectedItem: any;
  _caseTypeViewModel: CaseTypeViewModel;
  constructor(private _http: HttpClient) {

  }
  ngOnInit() {
    this.resetMockViewModel();
    const url: string = "/assets/CASETYPE_MOCK.json";
    this._http.get(url).subscribe((response) => {
      this.caseTypeDataList = response;
    }); ``
  }
  resetMockViewModel() {
    this._caseTypeViewModel = {
      id: 0,
      case_type: "",
      violation: "",
      max_count: "0",
      assigned_inspector_count: ""
    }
  }
  addNew() {
    this.resetMockViewModel();
    console.log(this._caseTypeViewModel);
    jQuery("#itemInfo").modal("show");
  }
  edit(item: any) {
    this._caseTypeViewModel = item;
    jQuery("#itemInfo").modal("show");
  }
  Savechanges() {
    console.log(this._caseTypeViewModel);
    this.caseTypeDataList.push(this._caseTypeViewModel);
    jQuery("#itemInfo").modal("hide");
  }
}
