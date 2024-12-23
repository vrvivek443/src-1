import { Component, setTestabilityGetter } from '@angular/core';
import { NoticeView } from '../app.complaintmodel';
import { ViewAllNotificationService } from '../services/viewallnotification.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { APIURLConstant } from '../api.url.constant';
import { notificationSearchModel } from './view-all-notification.viewmodel';
import { UserModel } from '../user/user.viewmodel';
import { Output, EventEmitter } from '@angular/core';
import { AppService } from '../services/app.services';
declare var jQuery: any;
@Component({
  selector: 'app-view-all-notification',
  templateUrl: './view-all-notification.component.html',
  styleUrls: ['./view-all-notification.component.css']
})
export class ViewAllNotificationComponent {
  public _notices: NoticeView[] = [];
  public _notificationSearchModel: notificationSearchModel = null;
  public tblViewAllNotification: any;
  public _inspectorList: any;
  public _user: UserModel[] = [];
  public _status: any[] = [];
  public _tmpcreatedBy: string[] = [];
  public _tmpStatus: string;

  // @Output() noticesCount = new EventEmitter<any>();
  ngOnInit() {
    jQuery('#readStatus').select2({});
    jQuery('#createdby').select2({});
    // jQuery('#datesearch').select2({});
    this._status = [{
      "id": 1,
      "value": "Read",
    }, {
      "id": 0,
      "value": "Unread",
    }]
    this.resetMockViewModel();
    this.loadMasterData();
  }
  loadMasterData() {
    this._viewAllNotificationServiceCall.getAll(this._urlConstant.UserDataModule).subscribe((response) => {
      console.log('User List:', response);
      this._user = response.data;
      console.log('User Data:', this._user);
    });
  }
  constructor(private router: Router, private _http: HttpClient, private _fb: FormBuilder, private _urlConstant: APIURLConstant, private _viewAllNotificationServiceCall: ViewAllNotificationService, private appservice: AppService) {
  }
  loadNoticeData() {
    this._viewAllNotificationServiceCall.get(this._urlConstant.UserDataModule, this._urlConstant.GetNotices).subscribe((response) => {
      this._notices = [];
      if (response.status == "SUCCESS") {
        this._notices = response.notices;
        this.tblViewAllNotification.rows().remove().draw();
        this.tblViewAllNotification.rows.add(this._notices).draw();
      } else {
        console.log("Unable to receive notices : " + response.errorMessage)
      }
    });
    // this._viewAllNotificationServiceCall.getAll(this._urlConstant.UserDataModule)
    //   .subscribe((response) => {
    //     this._user = response.data;
    //     console.log('User Data:', this._user);
    //   });
  }
  search() {
    let self = this;
    this.resetMockViewModel();
    jQuery(document).ready(function () {
      let status = jQuery('#ReadUnread :selected').text();

      self._notificationSearchModel.readStatus = status.trim(' ');
      self._tmpcreatedBy = jQuery('#createdby :selected').text();

      // jQuery('#createdby').select2({ dropdownParent: $("#createdby") }).on('change', function (e: any) {
      //   self._createdBy = e.currentTarget.value;
      //   console.log('OnChange:', self._createdBy);
      // });
    });
    this.fetchSearchResult();
  }
  ngAfterViewInit() {
    let self = this;
    this.loadNoticeData();
    jQuery(document).ready(function () {
      $('#tblViewAllNotification thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#tblViewAllNotification thead');
      self.initializeDatatable();
    });

    jQuery('.select2-selection__rendered').css('color', 'green');
    jQuery('.select2-selection__rendered').css('font-weight', 400);
    jQuery('.select2-selection__rendered').css('font-size', '1rem');
    jQuery('.select2-selection__choice').css('background-color', '#fffcfc');

    jQuery(document).ready(function () {
      $('#tblViewAllNotification tbody').on('click', 'tr', function () {
        var table = $('#tblViewAllNotification').DataTable();
        console.log(table.row(this).data());
        var r: any = table.row(this).data();
        if (r.isRead == false) {
          self.MakeItRead(r.id, r.actionId);
        }
      });
    });

  }
  MakeItRead(caseid: any, actionid: any) {
    //casemaster/messageRead?id=1--CaseId--&actionId=--actionID--
    let moduleName = this._urlConstant.MessageRead + '?id=' + caseid + '&actionId=' + actionid;
    this._viewAllNotificationServiceCall.get(this._urlConstant.CaseMasterModule, moduleName).subscribe((response) => {
      if (response.status == "SUCCESS") {
        console.log(response);
        this._notices = response.notices;
        //this.noticesCount.emit((this._notices.filter(x => x.isRead == false).length + 1).toString());
        this.appservice.setNoticeCount((this._notices.filter(x => x.isRead == false).length + 1).toString());
        this.appservice.currentNoticeCount.subscribe(list => {
          this._notices = list;
        });
        this.tblViewAllNotification.rows().remove().draw();
        this.tblViewAllNotification.rows.add(this._notices).draw();
        // var data = response.data;
        // this._notices = data;

        // if (this.tblViewAllNotification === undefined) {
        //   this.initializeDatatable();
        // }

        // this.tblViewAllNotification.rows().remove().draw();
        // this.tblViewAllNotification.rows.add(this._notices).draw();
      } else if (response.status == "ERROR") {
        alert('Error:' + response.errorMessage);
      }
    });
  }
  resetMockViewModel() {
    this._notificationSearchModel = {
      createdBy: [],
      // dateRange: null,
      readStatus: false
    }
    // this._notificationSearchModel.createdBy = [];
    // this._notificationSearchModel.dateRange = null;
    // this._notificationSearchModel.readStatus = false;
  }
  initializeDatatable() {
    let self = this;
    var cols = [
      {
        data: "id",
        render: function (data: any, type: any, row: any) {
          if (row.isRead == false) {
            return `<b><a href='complaint?caseId=${row.id}'>${row.id}</a></b>`;
          } else {
            return `<a href='complaint?caseId=${row.id}'>${row.id}</a>`;
          }
        }
      },
      { data: 'actionId' },
      {
        data: "message",
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "isRead",
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "actionDesription",
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "fullName",
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      },
      {
        data: "actionDate",
        render: function (data: any, type: any, row: any) {
          if (data != null)
            return data;
          else
            return "";
        }
      }];

    this.tblViewAllNotification = jQuery('#tblViewAllNotification').DataTable({
      paging: true,
      columns: cols,
      scrollX: true,
      fixedColumns: true,
      width: 100,
      columnDefs: [
        { width: 70, targets: [0] },
        { className: "dt-left", targets: "_all" }
      ],
      initComplete: function () {
        var api = this.api();
        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx: any) {
            // Set the header cell to contain the input element
            var cell = jQuery('.filters th').eq(
              jQuery(api.column(colIdx).header()).index()
            );
            var title = jQuery(cell).text();
            jQuery(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            jQuery(
              'input',
              jQuery('.filters th').eq(jQuery(api.column(colIdx).header()).index())
            )
              .off('keyup change')
              .on('change', function (this: any, e: any) {
                // Get the search value
                jQuery(this).attr('title', jQuery(this).val());
                var regexr = '({search})'; //$(this).parents('th').find('select').val();

                var cursorPosition = this.selectionStart;
                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ''
                      ? regexr.replace('{search}', '(((' + this.value + ')))')
                      : '',
                    this.value != '',
                    this.value == ''
                  )
                  .draw();
              })
              .on('keyup', function (this: any, e: any) {
                e.stopPropagation();

                jQuery(this).trigger('change');
                jQuery(this)
                  .focus()[0]
                //.setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      }
    });

  }

  fetchSearchResult() {
    let _createByList = [];
    let selectedCreatedBY = jQuery('#createdby option:selected').toArray().map((i: { text: any; }) => i.text);
    this._notificationSearchModel.createdBy = [];
    if ((selectedCreatedBY.length > 0) && (selectedCreatedBY !== '0')) {
      selectedCreatedBY.forEach((element: any) => {
        this._notificationSearchModel.createdBy.push((this._user.find(x => x.name === element?.trim()).email));
      });
    } else {
      this._notificationSearchModel.createdBy = null;
    }

    this._notificationSearchModel.readStatus = null;
    let selectedStatus = jQuery('#readStatus option:selected').text();
    if (selectedStatus.length > 0) {
      if (selectedStatus?.trim() === 'Read') {
        this._notificationSearchModel.readStatus = true;
      } else if (selectedStatus?.trim() === 'Unread') {
        this._notificationSearchModel.readStatus = false;
      }
    }

    const jsonString = JSON.stringify(this._notificationSearchModel);
    //http://localhost:8080/api/casemaster/search
    this._viewAllNotificationServiceCall.caseSearch('user', '/searchNotices', jsonString.toString()).subscribe((response) => {
      if (response.status == "SUCCESS") {
        var data = response.notices;
        this._notices = data;

        if (this.tblViewAllNotification === undefined) {
          this.initializeDatatable();
        }

        this.tblViewAllNotification.rows().remove().draw();
        if ((this._notices !== null) && (this._notices !== undefined)) {
          this.tblViewAllNotification.rows.add(this._notices).draw();
        }
      } else if (response.status == "ERROR") {
        alert('Error:' + response.errorMessage);
      }
    });
  }
}
