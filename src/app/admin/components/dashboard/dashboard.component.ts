import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from '../../../constants/hub-url';
import { ReceiveFunctions } from '../../../constants/receive-functions';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { SignalRService } from '../../../services/common/signalr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private signalRService: SignalRService, private alertifyService: AlertifyService) {
    super(spinner);
    //signalRService.start(HubUrls.OrderHub);
    //signalRService.start(HubUrls.ProductHub);
   }

  ngOnInit(): void {
    this.signalRService.on(HubUrls.ProductHub, ReceiveFunctions.ProductAddedMessageReceiveFunction, message => {
      this.alertifyService.message(message, {
        messageType: MessageType.Notify,
        dismissOthers: true,
        position: Position.TopRight
      })
    });

    this.signalRService.on(HubUrls.OrderHub,ReceiveFunctions.OrderAddedMessageReceiveFunction, message => {
      this.alertifyService.message(message, {
        messageType: MessageType.Notify,
        dismissOthers: true,
        position: Position.TopCenter
      })
    });
  }

}
