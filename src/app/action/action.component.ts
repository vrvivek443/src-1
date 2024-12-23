import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { APIURLConstant } from '../api.url.constant';
import { ComplaintService } from '../services/complaint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionLogViewModel } from '../complaint/complaint.viewmodel';
import { Action, Category } from '../app.complaintmodel';

declare var jQuery: any;

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent {

  _action: Action = null;
  _actionType: Category[] = [];
  _actions: Action[] = [];
  jsonData: any[] = [];
  private _selectedActionID: number = -1;
  private _selectedAction: any;
  public isActionCodeHasData = false;
  isActionCodeErrorMessage = 'Action code is required';
  constructor(private _http: HttpClient, private _fb: FormBuilder, private _urlConstant: APIURLConstant, private _complaintServiceCall: ComplaintService,
    private router: Router, private _activatedRoute: ActivatedRoute) {

  }
  ngOnInit() {
    this._action = new Action();
    this.loadActionType();

    jQuery('#flags').select2({});
    jQuery('#status').select2({});
  }
  focusoutMethod(id: string, data: string) {
    if (data.length <= 0) {
      this.isActionCodeHasData = true;
    } else {
      this.isActionCodeHasData = false;
    }
  }
  loadActionType() {
    this._complaintServiceCall.getByModuleAndMethod(this._urlConstant.CategoryModule, this._urlConstant.GetByCategory + "?catgory=ActionType").subscribe((response) => {
      if (response.status == "SUCCESS") {
        this._actionType = response.data;
        this.loadAction();
      }
    });

  }
  loadAction() {
    this._complaintServiceCall.get(this._urlConstant.ActionModule, this._urlConstant.GetAll).subscribe((response) => {
      this._actions = [];
      this._actions = response.data;
      this._actionType.forEach(e => {
        let children: any[] = [];
        //this.jsonData = [];
        this._actions.forEach((e1: any) => {
          if (e1.actionType == e.code)
            children.push({ "id": e1.id, "text": e1.actionDescription });
        });
        this.jsonData.push({
          "text": e.value, "children": children
        });

      });
      let vsid = 0;

      let self = this;
      jQuery("#actionList").jstree('destroy', true);
      jQuery('#actionList')
        .on("changed.jstree", function (e: any, data: any) {
          if (data.selected.length) {
            self.onActionSelection(data.instance.get_node(data.selected[0]).id);
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
  search() {
    setTimeout(function () {
      var v = $('#search').val();
      jQuery('#actionList').jstree(true).search(v);
    }, 250);
    jQuery('#actionList').jstree(true).search(this.searchText);
  }
  searchText: any;
  saveAction() {
    // let isPlaceCall = false;

    // if (this._action.actionCode == undefined) {
    //   this.isActionCodeHasData = true;
    // } else if (this._action.actionCode.length <= 0) {
    //   this.isActionCodeHasData = true;
    // } else {
    //   this.isActionCodeHasData = false;
    // }
    // if (isPlaceCall) {
    this.flagValueToData();
    this._complaintServiceCall.save(this._urlConstant.ActionModule, this._action).subscribe((response) => {
      if (response.status == 'SUCCESS') {
        alert('saved successfully');
        this.loadAction();
      } else {
        // alert(response.errorMessage);
        if (response.errorMessage.includes('ActionType')) {
          this.focusoutMethod('actioncode', '');
          this.isActionCodeErrorMessage = JSON.parse(response.errorMessage)[0];
        }

      }
    });
    // }
  }
  newAction() {
    this._action = new Action();
    this._selectedActionID = -1;
    jQuery('#flags').val(this._action.flags).trigger('change');
  }
  cancelAction() {
    if (this._selectedActionID != -1) {
      this.onActionSelection(this._selectedActionID);
    } else {
      this.newAction();
    }
  }
  onActionSelection(selectedID: number) {
    this._selectedActionID = selectedID;
    this._actions.forEach(e => {
      let violationChildDataList = [];

      this._actions.forEach((e1: any) => {
        if (e1.id == selectedID) {
          this._selectedAction = e1;
          let str: string = JSON.stringify(e1)
          this._action = JSON.parse(str);
          this.flagValueFromData();
          jQuery('#flags').val(this._action.flags).trigger('change');
        }
      });
    });
  }
  flagValueFromData(): void {
    this._action.flags = [];
    if (this._action.confidentialFlag)
      this._action.flags.push("C");
    if (this._action.firstContactFlag)
      this._action.flags.push("F");
    if (this._action.firstWrittenContactFlag)
      this._action.flags.push("FW");
    if (this._action.hearingBoardFlag)
      this._action.flags.push("H");
    if (this._action.hearingBoardOtherFlag)
      this._action.flags.push("Hc");
    if (this._action.mailToComplainants)
      this._action.flags.push("MC");
    if (this._action.mailToRespParties)
      this._action.flags.push("MP");
    if (this._action.voluntaryCampFlag)
      this._action.flags.push("VC");
  }
  public flagValueToData(): void {
    this._action.confidentialFlag = false;
    this._action.firstContactFlag = false;
    this._action.firstWrittenContactFlag = false;
    this._action.hearingBoardFlag = false;
    this._action.hearingBoardOtherFlag = false;
    this._action.mailToComplainants = false;
    this._action.mailToRespParties = false;
    this._action.voluntaryCampFlag = false;
    this._action.flags = jQuery('#flags').val();
    this._action.flags.forEach(x => {
      switch (x) {
        case 'C': this._action.confidentialFlag = true; break;
        case 'F': this._action.firstContactFlag = true; break;
        case 'FW': this._action.firstWrittenContactFlag = true; break;
        case 'H': this._action.hearingBoardFlag = true; break;
        case 'HC': this._action.hearingBoardOtherFlag = true; break;
        case 'MC': this._action.mailToComplainants = true; break;
        case 'MP': this._action.mailToRespParties = true; break;
        case 'VC': this._action.voluntaryCampFlag = true; break;
      }
    });

  }
}
