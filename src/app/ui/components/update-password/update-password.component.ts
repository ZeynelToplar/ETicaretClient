import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { User } from '../../../entities/user';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { UserService } from '../../../services/common/models/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private userAuthService: UserAuthService, private activatedRoute: ActivatedRoute, private alertifyService: AlertifyService,
    private userService: UserService, private router: Router) {
    super(spinner);
  }

  state: any;

  ngOnInit(): void {
    this.ShowSpinner(SpinnerType.Timer)
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        this.state = await this.userAuthService.verifyResetToken(resetToken, userId, () => {
          this.HideSpinner(SpinnerType.Timer);
        })
      }
    })
  }

  updatePassword(password: string, passwordConfirm: string) {
    this.ShowSpinner(SpinnerType.Timer);
    if (password != passwordConfirm) {
      this.alertifyService.message("Şifreler uyuşmamaktadır.", {
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      this.HideSpinner(SpinnerType.Timer);
      return;
    }

    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId, resetToken, password, passwordConfirm,
          () => {
            this.alertifyService.message("Şifre başarıyla güncellenmiştir", {
              messageType: MessageType.Success,
              position: Position.TopRight
            })
            this.router.navigate(["/login"]);
          },
          error => {
            console.log(error);
          });
        this.HideSpinner(SpinnerType.Timer);
      }
    })

  }

}
