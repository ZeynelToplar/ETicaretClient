import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerType } from '../../base/base.component';
import { _isAuthenticated } from '../../services/common/auth.service';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/customer-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private jwtHelper: JwtHelperService,
    private router: Router,
    private toastrService: CustomerToastrService,
    private spinner: NgxSpinnerService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.spinner.show(SpinnerType.Timer);

    //const token: string = localStorage.getItem("accessToken");

    //let expired: boolean;
    //try {
    //  expired = this.jwtHelper.isTokenExpired(token)

    //} catch {
    //  expired = true;
    //}

    if (!_isAuthenticated) {
      this.router.navigate(["login"], { queryParams: { returnUrl: state.url } });
      this.toastrService.message("Oturum açmanız gerekiyor.", "Yetkisiz Erişim", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      })
    }

    this.spinner.hide(SpinnerType.Timer);
    return true;
  }
  
}
