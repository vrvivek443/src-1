import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-memberlogout',
  templateUrl: './memberlogout.component.html',
  styleUrls: ['./memberlogout.component.css']
})
export class MemberlogoutComponent {

  _userEmail: string;

  constructor(private router: Router){}

  ngOnInit()
  {
    console.log(localStorage.getItem('NA_User'));
    if (localStorage.getItem('NA_User')) {
      this._userEmail = localStorage.getItem('NA_User');
    }
    jQuery(".sidebar-wrapper").hide();
    jQuery("#nav-bar-header").hide();
    jQuery(".page-footer").hide();
    jQuery("header").hide();
    jQuery(".page-wrapper").addClass("page-wrapper-none");
    jQuery(".page-wrapper-none").removeClass("page-wrapper");
  }

  login()
  {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
