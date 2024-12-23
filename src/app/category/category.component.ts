import { Component } from '@angular/core';
import { Category, CategoryType } from '../app.complaintmodel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { APIURLConstant } from '../api.url.constant';
import { ComplaintService } from '../services/complaint.service';
import { ActivatedRoute, Router } from '@angular/router';


declare var jQuery: any;


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  _category: Category = new Category();
  _categoryType: CategoryType[] = [];
  _categorys: Category[] = [];
  jsonData: any[] = [];
  searchText: any;
  private _selectedCategoryID: number = -1;
  private _selectedCategory: any;
  constructor(private _http: HttpClient, private _fb: FormBuilder, private _urlConstant: APIURLConstant, private _complaintServiceCall: ComplaintService,
    private router: Router, private _activatedRoute: ActivatedRoute) {

  }
  ngOnInit() {
    this._category = new Category();
    this.loadCategoryType();

  }
  loadCategoryType() {
    this._complaintServiceCall.getByModuleAndMethod(this._urlConstant.CategoryModule, this._urlConstant.GetCategoryMaster).subscribe((response) => {
      if (response.status == "SUCCESS") {
        this._categoryType = response.data;
        this.loadCategory();
      }
    });
  }
  loadCategory() {
    this._complaintServiceCall.get(this._urlConstant.CategoryModule, this._urlConstant.GetAll).subscribe((response) => {
      this.jsonData = [];
      this._categorys = response.data;
      this.jsonData = [];
      this._categoryType.forEach(e => {
        if (e.canEdit) {
          let children: any[] = [];

          this._categorys.forEach((e1: any) => {
            if (e1.category == e.category)
              children.push({ "id": e1.id, "text": e1.value });
          });
          this.jsonData.push({
            "text": e.category, "children": children
          });
        }
      });
      let vsid = 0;

      let self = this;
      jQuery("#categoryList").jstree('destroy', true);
      jQuery('#categoryList')
        .on("changed.jstree", function (e: any, data: any) {
          if (data.selected.length) {
            self.onCategorySelection(data.instance.get_node(data.selected[0]).id);
          }
        })
        .jstree({
          'core': {
            'multiple': false,
            'data': this.jsonData
          }, 'search': {
            'show_only_matches': true,
            'show_only_matches_children': true
          },
          "plugins": ["search"]
        });



    });
  }
  onCategorySelection(selectedID: number) {
    this._selectedCategoryID = selectedID;
    this._categorys.forEach(e => {
      let violationChildDataList = [];

      this._categorys.forEach((e1: any) => {
        if (e1.id == selectedID) {

          let str: string = JSON.stringify(e1)
          this._category = JSON.parse(str);
        }
      });
    });
  }
  search() {
    jQuery('#categoryList').jstree(true).search(this.searchText);
  }

  saveCategory() {
    let ct = this._categoryType.find(x => x.category == this._category.category);
    if (this._urlConstant.isNull(ct)) {
      alert('select category');
      return;
    }
    this._category.categoryid = ct.id;
    this._complaintServiceCall.saveByMethodName(this._urlConstant.CategoryModule, this._urlConstant.Save, this._category).subscribe((response) => {
      if (response.status == 'SUCCESS') {
        alert('saved successfully');
        this.loadCategory();
      } else {
        alert(response.errorMessage);
      }
    });
  }
  cancelCategory() {
    if (this._selectedCategoryID != -1) {
      this.onCategorySelection(this._selectedCategoryID);
    } else {
      this.newCategory();
    }
  }
  newCategory() {
    this._category = new Category();
    this._selectedCategoryID = -1;
  }


}
