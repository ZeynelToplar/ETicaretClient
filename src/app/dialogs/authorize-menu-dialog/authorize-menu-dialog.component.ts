import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { List_Role } from '../../contracts/Role/list_role';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { AuthorizationEndpointService } from '../../services/common/models/authorization-endpoint.service';
import { RoleService } from '../../services/common/models/role.service';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss']
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private authEndpointService: AuthorizationEndpointService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService) {
    super(dialogRef)

  }
  roles: { datas: List_Role[], totalCount: number };
  assignedRoles: string[];
  listRoles: { name: string, selected: boolean }[];
  async ngOnInit() {
    this.assignedRoles = await this.authEndpointService.getRolesToEndpoint(this.data.code, this.data.menuName);
    this.roles = await this.roleService.getRoles(-1, -1);
    this.listRoles = this.roles.datas.map((r : any)=> {

      return {
        name: r.name,
        selected: (this.assignedRoles?.indexOf(r.name) > - 1)
      }
    })
  }

  assignRoles(_roles: MatSelectionList) {
    const roles: string[] = _roles.selectedOptions.selected.map(o => o._text.nativeElement.innerText);
    this.spinner.show(SpinnerType.Timer);
    this.authEndpointService.assignRoleEndpoint(roles, this.data.code, this.data.menuName,
      () => {
        this.spinner.hide(SpinnerType.Timer);
        this.alertify.message("Rol atama işlemi başarılı", {
          messageType: MessageType.Success,
          position: Position.TopRight
        })
      },
      error => {

    })
  }
}

export enum AuthorizeMenuState {
  Yes,
  No
}
