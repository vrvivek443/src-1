import { Component } from '@angular/core';
import { Dashboard } from './dashboard.viewmodel';
import { HttpClient } from '@angular/common/http';
import { APIURLConstant } from '../api.url.constant';
import { UserService } from '../services/user.service';
declare var jQuery: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  _dashboard: Dashboard = null;

  constructor(
    private _http: HttpClient,
    private _apiUrlConstant: APIURLConstant,
    private _userServiceCall: UserService) {
  }

  ngOnInit() {
    jQuery(".sidebar-wrapper").show();
    jQuery("#nav-bar-header").show();
    jQuery(".page-footer").show();
    jQuery("header").show();
    jQuery(".page-wrapper-none").addClass("page-wrapper");
    jQuery(".page-wrapper").removeClass("page-wrapper-none");
    if (localStorage.getItem("login") == "yes") {
      localStorage.setItem("login", "success");
      localStorage.setItem("nc", "yes");
      location.reload()
    }
    this.loadDashboard();
  }

  loadDashboard() {
    this._userServiceCall.get(this._apiUrlConstant.UserDataModule, this._apiUrlConstant.Dashboard).subscribe((response: any) => {
      if (response.status == "SUCCESS") {
        this._dashboard = response.dashboard;
      } else {
        alert(response.errorMessage);
      }
    });
  }
}
