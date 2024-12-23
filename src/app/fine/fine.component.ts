import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FineViewModel } from 'src/app/fine/fine.viewmodel';
declare var jQuery: any;
@Component({
  selector: 'app-fine',
  templateUrl: './fine.component.html',
  styleUrls: ['./fine.component.css']
})
export class FineComponent {
  public fineDataList: any;
  _selectedItem: any;
  _fineViewModel: FineViewModel;
  constructor(private _http: HttpClient) {
  }

  ngOnInit() {
    this.resetMockViewModel();
    const url: string = "/assets/FINE_MOCK.json";
    this._http.get(url).subscribe((response) => {
      this.fineDataList = response;
    }); ``
  }
  resetMockViewModel() {
    this._fineViewModel = {
      label: "",
      fine_type: "",
      associated_to: "",
      default_amount: ""
    }
  }
  addNew() {
    this.resetMockViewModel();
    console.log(this._fineViewModel);
    jQuery("#itemInfo").modal("show");
  }
  edit(item: any) {
    this._fineViewModel = item;
    jQuery("#itemInfo").modal("show");
  }
  Savechanges() {
    console.log(this._fineViewModel);
    this.fineDataList.push(this._fineViewModel);
    jQuery("#itemInfo").modal("hide");
  }
}
