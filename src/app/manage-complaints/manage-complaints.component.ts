import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockupViewModel } from '../mockpage/mockup.viewmodel';
declare var jQuery: any;

@Component({
  selector: 'app-manage-complaints',
  templateUrl: './manage-complaints.component.html',
  styleUrls: ['./manage-complaints.component.css']
})
export class ManageComplaintsComponent {
  public userProfileDataList: any;
  _selectedItem: any;
  _mockupViewModel: MockupViewModel;
  constructor(private _http: HttpClient) {

  }
  ngOnInit() {
    this.resetMockViewModel();
    const url: string = "/assets/MOCK_DATA.json";
    this._http.get(url).subscribe((response) => {
      this.userProfileDataList = response;
    });
  }
  resetMockViewModel() {
    this._mockupViewModel = {
      id: 0,
      first_name: "",
      last_name: "",
      email: ""
    }
  }
  addNew() {
    this.resetMockViewModel();
    jQuery("#itemInfo").modal("show");
  }
  edit(item: any) {
    this._mockupViewModel = item;
    jQuery("#itemInfo").modal("show");
  }
}
