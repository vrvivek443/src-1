import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { APIURLConstant } from '../api.url.constant';
import { UserService } from '../services/user.service';
import { Category, InspectorMapping } from '../app.complaintmodel';
import { UserModel } from '../user/user.viewmodel';

declare var jQuery: any;

@Component({
  selector: 'app-inspectormapping',
  templateUrl: './inspectormapping.component.html',
  styleUrls: ['./inspectormapping.component.css']
})
export class InspectormappingComponent {
  public _mapping: InspectorMapping[] = [];
  public _inspector: UserModel[] = [];
  public _missingInspector: UserModel[] = [];
  public _users: UserModel[] = [];
  public _program: Category[];
  public _insTbl: any;
  toUser: any;
  fromUser: any;
  _census: string[] = [];
  _edit: InspectorMapping = new InspectorMapping();
  constructor(
    private _http: HttpClient,
    private _apiUrlConstant: APIURLConstant,
    private _userServiceCall: UserService) {
  }
  ngOnInit() {
    this.loadAll();
  }
  loadAll() {
    this._userServiceCall.getAll(this._apiUrlConstant.InspectorMappingModule).subscribe((response) => {
      if (response.status == "SUCCESS") {
        this._mapping = response.data;
        this.loadInspector();
      } else {
        this._mapping = [];
        alert(response.errorMessage);
      }
    });

  }
  loadInspector() {
    this._userServiceCall.getAll(this._apiUrlConstant.UserDataModule).subscribe((response) => {
      if (response.status == "SUCCESS") {
        this._users = response.data;
        this._inspector = this._users.filter(x => x.role.isinspector == true);
        this.loadProgram();
      } else {
        this._inspector = [];
        alert(response.errorMessage);
      }
    });
  }
  loadProgram() {

    this._userServiceCall.getByModuleAndMethod(this._apiUrlConstant.CategoryModule, this._apiUrlConstant.GetByCategory + "?catgory=ProgramType").subscribe((response) => {
      if (response.status == "SUCCESS") {
        this._program = response.data;
        this.initializeDatatable();
      } else {
        this._program = [];
        alert(response.errorMessage);
      }
    });
  }

  initializeDatatable() {
    let self = this;
    var cols = [
      {
        data: 'programcode',
        render: function (data: any, type: any, row: any) {
          let pg = self._program.filter(x => x.code == row.programcode);
          if (!self._apiUrlConstant.isNull(pg) && pg.length > 0) {
            return pg[0].value;
          }
          return row.programcode;
        }
      },
      { data: 'censustract' },
      {
        data: 'Inspector',
        render: function (data: any, type: any, row: any) {
          let pg = self._inspector.find(x => x.id == row.inspectorid);
          let str: string = "";
          if (!self._apiUrlConstant.isNull(pg)) {
            str = pg.name;
          }
          else if (row.inspectorid == -1)
            str = "";
          else {
            let pg = self._users.find(x => x.id == row.inspectorid);
            if (!self._apiUrlConstant.isNull(pg)) {
              str = `Not Inspector [${pg.name}]`;
              self._missingInspector.push(pg);
            }
            else
              str = `Not Found [${row.inspectorid}]`;
          }
          return str;
        }
      },
      {
        data: 'status',
        render: function (data: any, type: any, row: any) {
          if (row.approveStatus === 'I') {
            return "Not approved";
          }
          if (row.approveStatus === 'R') {
            return `<span  data-toggle="tooltip" title="${row.rejectReason}">Rejected</span>`;
          }
          if (row.status) {
            return "Active";
          }
          return 'Inactive';
        }
      }
    ];

    this._insTbl = jQuery('#inspectorTbl').DataTable({
      paging: true,
      columns: cols,
      layout: {
        topStart: {
          buttons: [
            {
              extend: 'copyHtml5',
              // text: '<i class="fa fa-files-o"></i>',
              text: 'Copy All',
              className: 'btn btn-primary',
              titleAttr: 'Copy',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button')
              },
            },
            {
              extend: 'csv',
              className: 'btn btn-primary',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button')
              },
            },

            {
              extend: 'pdf',
              className: 'btn btn-primary',
              init: function (api: any, node: any, config: any) {
                $(node).removeClass('dt-button')
              },
            }

          ]
        }
      }
    });
    this._insTbl.on('click', 'tbody tr', (e: any) => {
      let classList = e.currentTarget.classList;

      if (classList.contains('selected')) {
        classList.remove('selected');
      }
      else {
        self._insTbl.rows('.selected').nodes().each((row: any) => row.classList.remove('selected'));
        classList.add('selected');
      }
      //self.enableButtons();
    });
    this.loadData();
  }
  loadData() {
    this._insTbl.rows().remove().draw();
    this._insTbl.rows.add(this._mapping).draw();
    this._census = this._apiUrlConstant.getDistinctItems(this._mapping, 'censustract');
  }

  importMapping() {
    throw new Error('Method not implemented.');
  }
  replaceInspector() {
    this.fromUser = -1;
    this.toUser = -1;
    jQuery('#assignInspectorModel').modal('show');
  }
  assignInspector() {
    this._userServiceCall.getByModuleAndMethod(this._apiUrlConstant.InspectorMappingModule, `assignInspector?from=${this.fromUser}&to=${this.toUser}`).subscribe((response) => {
      if (response.status == "SUCCESS") {
        this._apiUrlConstant.displaySuccess('Updated successfully');
        this._mapping = response.data;
        this.loadData();
        jQuery('#assignInspectorModel').modal('hide');
      } else {
        alert(response.errorMessage);
      }
    });
  }

  showMapping() {
    this._edit = new InspectorMapping();
    jQuery('#mappingModel').modal('show');
  }
  applyMapping() {
    if (this._edit.inspectorid == -1) {
      alert('Inspector should be selected');
    }
    this._userServiceCall.getByModuleAndMethod(this._apiUrlConstant.InspectorMappingModule,
      `updateMapping?program=${this._edit.programcode}&census=${this._edit.censustract}&inspectorId=${this._edit.inspectorid}`)
      .subscribe((response) => {
        if (response.status == "SUCCESS") {
          this._apiUrlConstant.displaySuccess('Updated successfully');
          this._mapping = response.data;
          this.loadData();
          jQuery('#mappingModel').modal('hide');
        } else {
          alert(response.errorMessage);
        }
      });
  }
}

