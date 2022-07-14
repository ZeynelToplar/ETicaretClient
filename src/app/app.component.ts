import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/common/auth.service';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from './services/ui/customer-toastr.service';
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ETicaretClient';
  constructor(private customToastr: CustomerToastrService,
    public authService: AuthService,
    private toastrService: CustomerToastrService,
    private router: Router) {

    authService.identityCheck();
  }

  signOut() {
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();

    this.router.navigate([""]);

    this.toastrService.message("Oturum kapatıldı", "Başarılı", {
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight
    })
  }
}
