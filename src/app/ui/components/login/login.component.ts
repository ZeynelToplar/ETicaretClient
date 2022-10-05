import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AuthService } from '../../../services/common/auth.service';
import { HttpClientService } from '../../../services/common/http-client.service';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private httpClientService: HttpClientService) {
    super(spinner);
    socialAuthService.authState.subscribe( async (user: SocialUser) => {
      console.log(user);
      this.ShowSpinner(SpinnerType.Timer)
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            authService.identityCheck();
          });
          break;
        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            authService.identityCheck();
          })
          break;
      }
      this.HideSpinner(SpinnerType.Timer);
    })
  }

  ngOnInit(): void {
  }

  async login(txtUsernameOrEmail: string, txtPassword: string) {
    this.ShowSpinner(SpinnerType.Timer);
    await this.userAuthService.login(txtUsernameOrEmail, txtPassword, () => {
      this.authService.identityCheck();

      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl = params["returnUrl"];
        if (returnUrl)
          this.router.navigate([returnUrl]);
      });

      this.HideSpinner(SpinnerType.Timer)
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID); //Bu işlem facebook login page açar.
  }

}
