import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { List_Order } from '../../../../contracts/Order/list_order';
import { OrderDetailDialogComponent, OrderDetailDialogState } from '../../../../dialogs/order-detail-dialog/order-detail-dialog.component';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { OrderService } from '../../../../services/common/models/order.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private orderService: OrderService,
    private dialogService:DialogService) {
    super(spinner);
  }


  displayedColumns: string[] = ['orderCode', 'username','totalPrice', 'createDate','completed','viewDetail','delete'];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getAllOrders() {
    this.ShowSpinner(SpinnerType.Timer);
    const allOrders: { totalOrderCount: number, orders: List_Order[] } = await this.orderService.getAllOrder(this
      .paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5, () => this.HideSpinner(SpinnerType.Timer), errorMessage => this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      }));
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
  }

  async pageChanged() {
    await this.getAllOrders();
  }

  async ngOnInit() {
    await this.getAllOrders();
  }

  showOrderDetail(id: string) {
    this.dialogService.openDialog({
      componentType: OrderDetailDialogComponent,
      data: id,
      options: {
        width: "1000px"
      }
    })
  }
}
