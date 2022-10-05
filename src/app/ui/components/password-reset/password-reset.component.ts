import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends BaseComponent {

  constructor(spinner: NgxSpinnerService, private userAuhtService: UserAuthService, private alertifyService: AlertifyService) {
    super(spinner)
  }

  passwordReset(email: string) {
    this.ShowSpinner(SpinnerType.Timer);
    this.userAuhtService.passwordReset(email, () => {
      this.HideSpinner(SpinnerType.Timer);
      this.alertifyService.message("Şifre talebi gönderildi", {
        dismissOthers: true,
        messageType: MessageType.Notify,
        position: Position.TopRight
      })
    });
  }
}
