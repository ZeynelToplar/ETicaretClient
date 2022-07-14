import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AuthService } from '../../../services/common/auth.service';
import { UserService } from '../../../services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userService: UserService, spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    super(spinner);
  }

  ngOnInit(): void {
  }

  async login(txtUsernameOrEmail: string, txtPassword: string) {
    this.ShowSpinner(SpinnerType.Timer);
    await this.userService.login(txtUsernameOrEmail, txtPassword, () => {
      this.authService.identityCheck();

      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl = params["returnUrl"];
        if (returnUrl)
          this.router.navigate([returnUrl]);
      });

      this.HideSpinner(SpinnerType.Timer)
    });
  }

}
