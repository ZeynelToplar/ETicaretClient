import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { List_Role } from '../../contracts/Role/list_role';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { RoleService } from '../../services/common/models/role.service';
import { UserService } from '../../services/common/models/user.service';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.scss']
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService) {
    super(dialogRef)

  }
  roles: { datas: List_Role[], totalCount: number };
  assignedRoles: string[];
  listRoles: { name: string, selected: boolean }[];
  async ngOnInit() {
    this.spinner.show(SpinnerType.Timer)
    this.assignedRoles = await this.userService.getRolesToUser(this.data, () => {
      this.spinner.hide(SpinnerType.Timer)
    });
    this.roles = await this.roleService.getRoles(-1, -1);
    this.listRoles = this.roles.datas.map((r: any) => {

      return {
        name: r.name,
        selected: (this.assignedRoles?.indexOf(r.name) > - 1)
      }
    })
  }

  assignRoles(_roles: MatSelectionList) {
    const roles: string[] = _roles.selectedOptions.selected.map(o => o._text.nativeElement.innerText);
    this.spinner.show(SpinnerType.Timer);
    this.userService.assignRoleToUser(this.data, roles,
      () => {
        this.spinner.hide(SpinnerType.Timer);
        this.alertify.message("Rol atama işlemi başarılı", {
          messageType: MessageType.Success,
          position: Position.TopRight
        })
      }, error => {
        this.alertify.message("Rol atama işlemi başarısız", {
          messageType: MessageType.Error,
          position: Position.TopRight
        })
      });
  }
}

