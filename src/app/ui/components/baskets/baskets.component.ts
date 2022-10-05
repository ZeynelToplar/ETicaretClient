import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';
import { Create_Order } from '../../../contracts/Order/create_order';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from '../../../dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent, ShoppingCompleteState } from '../../../dialogs/shopping-complete-dialog/shopping-complete-dialog.component';
import { DialogService } from '../../../services/common/dialog.service';
import { BasketService } from '../../../services/common/models/basket.service';
import { OrderService } from '../../../services/common/models/order.service';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/customer-toastr.service';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})
export class BasketsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService,
    private basketService: BasketService,
    private orderService: OrderService,
    private toastrService: CustomerToastrService,
    private router: Router,
    private dialogService: DialogService) {
    super(spinner)
  }

  basketItems: List_Basket_Item[];
  async ngOnInit() {
    this.ShowSpinner(SpinnerType.Timer);
    this.basketItems = await this.basketService.get();
    this.HideSpinner(SpinnerType.Timer);
  }

  async changeQuantity(object: any) {
    this.ShowSpinner(SpinnerType.Timer);
    const basketItemId = object.target.attributes["id"].value;
    const quantity: number = object.target.value;
    const basketItem: Update_Basket_Item = new Update_Basket_Item();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    await this.basketService.updateQuantity(basketItem)
    this.HideSpinner(SpinnerType.Timer);
  }

  removeBasketItem(basketItemId: string) {
    $("#basketModal").modal("hide");
    this.dialogService.openDialog({
      componentType: BasketItemRemoveDialogComponent,
      data: BasketItemDeleteState.Yes,
      afterClosed: async () => {
        this.ShowSpinner(SpinnerType.Timer);

        await this.basketService.remove(basketItemId);

        $("." + basketItemId).fadeOut(500, () => {
          this.HideSpinner(SpinnerType.Timer)
        })
        $("#basketModal").modal("show");
      }
    })
  }

  shoppingComplete() {
    $("#basketModal").modal("hide");
    this.dialogService.openDialog({
      componentType: ShoppingCompleteDialogComponent,
      data: ShoppingCompleteState.Yes,
      afterClosed: async () => {
        this.ShowSpinner(SpinnerType.Timer);
        const order: Create_Order = new Create_Order();
        order.address = "Konya-Karatay";
        order.description = "Falanca filanca..."
        await this.orderService.create(order);
        this.HideSpinner(SpinnerType.Timer);
        this.toastrService.message("Siparişiniz alındı.", "Sipariş oluşturuldu", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        this.router.navigate(["/"]);
      }
    })
  }

}
