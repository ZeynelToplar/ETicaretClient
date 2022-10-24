import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { SingleOrder } from '../../contracts/Order/single_order';
import { DialogService } from '../../services/common/dialog.service';
import { OrderService } from '../../services/common/models/order.service';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/customer-toastr.service';
import { BaseDialog } from '../base/base-dialog';
import { CompleteOrderDialogComponent, CompleteOrderState } from '../complete-order-dialog/complete-order-dialog.component';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss']
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService: OrderService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private toastr: CustomerToastrService) {
    super(dialogRef);
  }

  singleOrder: SingleOrder;
  totalPrice: number;

  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();

  async ngOnInit(): Promise<void> {
    this.singleOrder = await this.orderService.getOrderById(this.data as string)
    debugger;
    this.dataSource = this.singleOrder.basketItems;

    this.totalPrice = this.singleOrder.basketItems.map((basketItem, index) => basketItem.price * basketItem.quantity).reduce((price,current) => price + current);
  }

  completeOrder() {
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data : CompleteOrderState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.Timer);
        await this.orderService.completeOrder(this.data as string);
        this.spinner.hide(SpinnerType.Timer);
        this.toastr.message("Sipariş başarıyla tamamlanmıştır ! Müşteriye bilgi verilmiştir.", "Sipariş Tamamlandı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
      }
    })
  }
}

export enum OrderDetailDialogState {
  Close,
  OrderComplete
}

