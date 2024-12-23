import { Component } from '@angular/core';
import { ViolationDataViewModel } from '../complaint/complaint.viewmodel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { APIURLConstant } from '../api.url.constant';
import { ComplaintService } from '../services/complaint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViolationTypeModel } from '../app.complaintmodel';

declare var jQuery: any;

@Component({
  selector: 'app-violation',
  templateUrl: './violation.component.html',
  styleUrls: ['./violation.component.css']
})
export class ViolationComponent {

  searchText: string;
  _selectedViolation: any = null;
  _caseViolationViewModel: ViolationTypeModel;
  _violationActiveDataList: any[] = [];
  _violationDataList: any[] = [];
  jsonData: any[] = [];
  _violation: ViolationDataViewModel;
  _selectedViolationID: number;
  constructor(private _http: HttpClient, private _fb: FormBuilder, private _urlConstant: APIURLConstant, private _complaintServiceCall: ComplaintService,
    private router: Router, private _activatedRoute: ActivatedRoute) {

  }
  isDescriptionHasData = false;
  isDescriptionMessage = 'Description is required';
  isCorrectiveActionHasData = false;
  isCorrectiveActionMessage = 'Corrective action is required';
  isShortDescriptionHasData = false;
  isShortDescriptionMessage = 'Short description is required';
  ngOnInit() {
    this.resetViolationViewModel();
    this.loadViolation();
  }
  resetViolationViewModel() {
    this.focusoutMethod('searchshortdesc', ' ');
    this.focusoutMethod('correctiveaction', ' ');
    this.focusoutMethod('description', ' ');
    this._caseViolationViewModel = {
      id: -1,
      status: true,
      cost: 0,
      frc: "",
      violationtypecode: "",
      prioritycode: "",
      correctiveaction: "",
      searchmunicipalcode: "",
      searchviolationcode: "",
      violationcode: "",
      searchshortdesc: "",
      uniformcode: "",
      municipalcode: "",
      shortdesc: "",
      alertflag: "",
      fulldesc: ""
    };

  }
  loadViolation() {

    this._complaintServiceCall.get(this._urlConstant.ViolationTypeModule, this._urlConstant.GetAll).subscribe((response) => {
      console.log("Violation Response : " + JSON.stringify(response.data));
      this._violationDataList = [];
      this._violationDataList = response.data;
      this._violationActiveDataList = this._violationDataList.filter((x: any) => x.status == true);
      this.jsonData = [];
      this._violationDataList.forEach(e => {
        this._violation = {
          text: "",
          children: []
        }
        let violationChildDataList = [];
        violationChildDataList = e.violations;
        this._violation.text = e.violationdescr;
        violationChildDataList.forEach((e1: any) => {
          return this._violation.children.push({ "id": e1.id, "text": e1.municipalcode + " " + e1.shortdesc });
        });
        this.jsonData.push({
          "text": e.violationdescr, "children": this._violation.children
        });
        //console.log("JSONData : " + JSON.stringify(this.jsonData));
      });
      let vsid = -1;
      this._selectedViolationID = vsid;
      let self = this;
      jQuery("#violationList").jstree('destroy', true);
      jQuery('#violationList')
        .on("changed.jstree", function (e: any, data: any) {
          if (data.selected.length) {
            //            vsid = data.instance.get_node(data.selected[0]).id;
            //jQuery("#_selectedViolationID").val(data.instance.get_node(data.selected[0]).id);
            // alert('The selected node is: ' + data.instance.get_node(data.selected[0]).id);
            self.onViolationSelection(data.instance.get_node(data.selected[0]).id);
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
  onViolationSelection(selectedID: any) {
    this._selectedViolationID = selectedID;
    this._violationDataList.forEach(e => {
      let violationChildDataList = [];
      violationChildDataList = e.violations;
      violationChildDataList.forEach((e1: any) => {
        if (e1.id == selectedID) {
          let str: string = JSON.stringify(e1)
          this._selectedViolation = JSON.parse(str);
          console.log("Element : " + JSON.stringify(e1));
          this._caseViolationViewModel = this._selectedViolation;
        }
      });
    });
  }
  focusoutMethod(id: any, data: string) {
    console.log('Event:', event);
    if (id == 'searchshortdesc') {
      if (data.length <= 0) {
        this.isShortDescriptionHasData = true;
      } else {
        this.isShortDescriptionHasData = false;
      }
    }
    if (id == 'correctiveaction') {
      if (data.length <= 0) {
        this.isCorrectiveActionHasData = true;
      } else {
        this.isCorrectiveActionHasData = false;
      }
    }
    if (id == 'description') {
      if (data.length <= 0) {
        this.isDescriptionHasData = true;
      } else {
        this.isDescriptionHasData = false;
      }
    }
  }

  saveViolation() {
    //this._caseViolationViewModel.violationtypecode=jQuery('#violationtypecode').val();
    let isPlaceCall = false;
    if (this._caseViolationViewModel.correctiveaction.length <= 0) {
      this.isCorrectiveActionHasData = true;
      isPlaceCall = true;
    }
    if (this._caseViolationViewModel.fulldesc.length <= 0) {
      this.isDescriptionHasData = true;
      isPlaceCall = true;
    }
    if (this._caseViolationViewModel.searchshortdesc.length <= 0) {
      this.isShortDescriptionHasData = true;
      isPlaceCall = true;
    }
    if (!isPlaceCall) {
      this._complaintServiceCall.save(this._urlConstant.ViolationModule, this._caseViolationViewModel).subscribe((response) => {
        if (response.status == 'SUCCESS') {

          this._urlConstant.displaySuccess('Saved Successfully');
          this.loadViolation();
        } else {
          // alert(response.errorMessage);
          let errors = JSON.parse(response.errorMessage);
          errors.forEach((v: any) => {
            if (v.includes('Short description')) {
              this.isShortDescriptionHasData = true;
              this.isShortDescriptionMessage = v;
            } else if (v.includes('Full description')) {
              this.isDescriptionHasData = true;
              this.isDescriptionMessage = v;
            } else if (v.includes('Corrective')) {
              this.isCorrectiveActionHasData = true;
              this.isCorrectiveActionMessage = v;
            }

          });
        }
      });
    }

  }
  cancelViolation() {
    // if ((this._selectedViolationID != -1) || (this._selectedViolationID != undefined)) {
    //   this.onViolationSelection(this._selectedViolationID);
    // } else {
    //   this.newViolation();
    // }
    this.newViolation();
  }
  search() {
    let to = false;
    if (to) { clearTimeout(to); }
    setTimeout(function () {
      var v = $('#search').val();
      jQuery('#violationList').jstree(true).search(v);
    }, 250);
    jQuery('#violationList').jstree(true).search(this.searchText);
  }
  newViolation() {
    this.resetViolationViewModel();
    this._selectedViolationID = -1;
  }
}
