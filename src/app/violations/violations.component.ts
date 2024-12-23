
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViolationViewModel } from './violation.viewmodel';
declare var jQuery: any;

@Component({
  selector: 'app-violations',
  templateUrl: './violations.component.html',
  styleUrls: ['./violations.component.css']
})
export class ViolationsComponent {
  public violationDataList: any;
  _selectedItem: any;
  _violationViewModel: ViolationViewModel;
  constructor(private _http: HttpClient) {

  }
  ngOnInit() {
    this.resetMockViewModel();
    const url: string = "/assets/VIOLATION_MOCK.json";
    this._http.get(url).subscribe((response) => {
      this.violationDataList = response;
    });``
  }
  resetMockViewModel() {
    this._violationViewModel = {
      label:"",
      status: "",
      violation_type: "",
      comply_by: "",
      inspection_required:"",
      municipal_code:""
    }
  }
  addNew() {
    this.resetMockViewModel();
    console.log(this._violationViewModel);
    jQuery("#itemInfo").modal("show");
  }
  edit(item: any) {
    this._violationViewModel = item;
    jQuery("#itemInfo").modal("show");
  }
  Savechanges(){
    console.log(this._violationViewModel);
    this.violationDataList.push(this._violationViewModel);
    jQuery("#itemInfo").modal("hide");
  }
}
