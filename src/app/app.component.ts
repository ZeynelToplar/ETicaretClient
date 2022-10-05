import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
import { AuthService } from './services/common/auth.service';
import { DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { HttpClientService } from './services/common/http-client.service';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from './services/ui/customer-toastr.service';
import { ComponentType } from '../app/services/common/dynamic-load-component.service';
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  title = 'ETicaretClient';
  constructor(private customToastr: CustomerToastrService,
    public authService: AuthService,
    private toastrService: CustomerToastrService,
    private router: Router,
    private httpClientService: HttpClientService,
    private dynamicLoadComponentService: DynamicLoadComponentService) {


    httpClientService.get({
      controller: "baskets"
    }).subscribe(data => {
    });

    authService.identityCheck();
  }

  signOut() {
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();

    this.router.navigate([""]);

    this.toastrService.message("Oturum kapatıldı", "Başarılı", {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    })
  }

  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(ComponentType.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef);
  }
}
