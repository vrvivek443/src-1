import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CaseHistoryViewModel, SimpleSearchExViewModel, CaseSearchResult, AdvancedSearchViewModel } from '../case-history/case-history.viewmodel';
import { CaseHistoryService } from '../services/casehistory.service';
import { APIURLConstant } from '../api.url.constant';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { data } from 'jquery';
declare var jQuery: any;

@Component({
  selector: 'app-complaint',
  templateUrl: './ai-search.component.html',
  styleUrls: ['./ai-search.component.css']
})
export class AiSearchComponent {
  dataArray: string[];
  statusWord: string[] = 'draft,open,reopen'.split(',');
  inspectorWord: string[] = 'Amuthasakaran,madhusudanan,muthu,karthi'.split(',');
  _caseSearchResults: any[] = [];
  constructor(private _fb: FormBuilder,
    private _urlConstant: APIURLConstant,
    private router: Router,
    private _apiUrlConstant: APIURLConstant,
    private _caseHistoryServiceCall: CaseHistoryService,
    private _activatedRoute: ActivatedRoute) {


  }
  _searchResultTable: any;
  simpleSearch: SimpleSearchExViewModel
  caseHistoryDataList: any = [];
  InitializeTable() {
    var cols = [
      {
        data: "id",
        targets: 0,
        render: function (data: any, type: any, row: any) {
          if (row.isStarred == true) {
            return `<i class="bx bxs-star"></i>&nbsp; <a href='complaint?caseId=${row.id}'>${row.id}</a>`;
          }
          return `<i class="bx bx-star"></i>&nbsp; <a href='complaint?caseId=${row.id}'>${row.id}</a>`;
        }
      },
      {
        data: "address",
        targets: 1,
        render: function (data: any, type: any, row: any) {
          var addr = "";
          if (row.caseaddress?.houseNumber != null) { addr += row.caseaddress?.houseNumber + " " }
          if (row.caseaddress?.streetName != null) { addr += row.caseaddress?.streetName + " " }
          //
          if (row.caseaddress?.streetType != null) { addr += row.caseaddress?.streetType + " " }
          return addr;
        }
      },
      {
        data: "programcode",
        targets: 2,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "cudate",
        targets: 3,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "casestatus",
        targets: 4,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "opendate",
        targets: 5,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "closedate",
        targets: 6,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "inspector1id",
        targets: 7,
        render: function (data: any, type: any, row: any) {
          if (data != null) {
            return data;
          } else {
            return "";
          }
        }
      },
      {
        data: "caseaddress.district",
        targets: 8,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "description",
        targets: 9,
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      }];
    this._searchResultTable = jQuery('#searchResult').DataTable({ columns: cols });
    this._searchResultTable.clear().rows.add(this.caseHistoryDataList).draw();
  }
  ngOnInit() {
    this.InitializeTable();
  }
  searchai() {
    let inp = jQuery('#searchtext').val();
    let patternRemoved: string
    console.log("AI Search:", jQuery('#searchtext').val());
    if (this.processPattern(inp) == "get") {
      patternRemoved = this.removeString(inp, "get");
      patternRemoved = this.removeString(patternRemoved, "case");
      patternRemoved = this.removeString(patternRemoved, "cases");
      patternRemoved = this.removeString(patternRemoved, "records");
      patternRemoved = this.removeString(patternRemoved, "record");
    }
    this.dataArray = patternRemoved.split(' ');
    let status = this.searchStatus(this.dataArray);
    if (status.length > 0) {
      status = status.join(',').replace('draft', 'D').replace('open', 'O').replace('reopen', 'RO').replace('duplicate', 'DP').replace('close', 'C').split(',');
    }
    console.log('Status:', JSON.stringify(status));
    jQuery('#searchHistory').val(JSON.stringify(status))
    let currentVal = jQuery('#searchHistory').val();
    let inspectors = this.searchInspector(this.dataArray);
    if (inspectors.length > 0) {
      inspectors = inspectors.join(',').replace('Amuthasakaran', '3').split(',');
    }
    console.log('Inspectors:', JSON.stringify(inspectors));
    jQuery('#searchHistory').val(currentVal + JSON.stringify(inspectors));
    currentVal = jQuery('#searchHistory').val();

    let caseNumbers = this.searchCaseNumber(this.dataArray);
    console.log('Case Numbers:', JSON.stringify(caseNumbers));
    jQuery('#searchHistory').val(currentVal + JSON.stringify(caseNumbers));

    this.simpleSearch = new SimpleSearchExViewModel();
    this.simpleSearch.caseId = caseNumbers;
    this.simpleSearch.inspectorId = inspectors;
    this.simpleSearch.status = status;
    this.fetchSearchResult();
    return inp;
  }
  fetchSearchResult() {
    let jsonString: any;
    this._caseSearchResults = [];
    this.caseHistoryDataList = [];

    jsonString = JSON.stringify(this.simpleSearch);

    if (jsonString.length > 0) {
      //http://localhost:8080/api/casemaster/search
      this._caseHistoryServiceCall.caseSearch('casemaster', '/search', jsonString.toString()).subscribe((response) => {
        if (response.status == "SUCCESS") {
          var data = response.data;
          this.caseHistoryDataList = data;
          // this.caseHistoryDataList.forEach((v: any, index: any) => {

          //   let inspectorId = v.inspector1id;
          //   let inspectorname = this._inspectorList.find((v1: any, index: any) => v1.id == inspectorId)?.name;
          //   this.caseHistoryDataList[index].inspector1id = inspectorname;


          //   //sourcecode
          //   let casestatus = v.casestatus;
          //   let _casestatus = this._statusList.find((v1: any, index: any) => v1.code == casestatus)?.value;
          //   this.caseHistoryDataList[index].casestatus = _casestatus;

          //   let programcode = v.programcode;
          //   let _programcode = this._programTypeList.find((v1: any, index: any) => v1.code == programcode)?.value;
          //   this.caseHistoryDataList[index].programcode = _programcode;
          // })
          if (this._searchResultTable === undefined) {
            this.InitializeTable();
          } else {
            this._searchResultTable.clear().rows.add(this.caseHistoryDataList).draw();
          }
        } else if (response.status == "ERROR") {
          alert('Error:' + response.errorMessage);
        }
      });
    }
  }
  processPattern(inp: string) {
    if ((inp.includes('get')) || (inp.includes('fetch'))) {
      return "get";
    } else {
      return "update";
    }
  }
  removeString(target: string, data: string) {
    return target.replaceAll('get', '').trim();
  }
  searchInspector(target: string[]): string[] {

    let foundInspectors: string[] = [];
    this.inspectorWord.forEach((w: string) => {
      if (target.includes(w)) {
        foundInspectors.push(w);
      }
    });
    return foundInspectors;
  }
  searchStatus(target: string[]): string[] {
    let foundStatus: string[] = [];
    this.statusWord.forEach((w: string) => {
      if (target.includes(w)) {
        foundStatus.push(w);
      }
    });
    return foundStatus;
  }
  searchCaseNumber(target: string[]): string[] {
    let caseNumber: string[] = [];
    target.forEach((w: string) => {
      let res = this.isCasenumber(w);
      if (res != 0) {
        caseNumber.push(res.toString());
      }
    });
    return caseNumber;
  }
  isCasenumber(data: string) {
    if ((data.endsWith('th')) || ((data.endsWith('rd')))) {
      if (!Number.isNaN(Number(data.slice(0, data.length - 2)))) {
        return Number(data.slice(0, data.length - 2));
      } else {
        return 0;
      }
    }
    return 0;
  }
}
