import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { Create_Product } from '../../../../contracts/create_product';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FileUploadOptions } from '../../../../services/common/file-upload/file-upload.component';
import { ProductService } from '../../../../services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private productService: ProductService, private alertifyService: AlertifyService) {
    super(spinner);
  }

  ngOnInit(): void {
  }

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();
  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action: "upload",
    controller: "products",
    explanation : "Resimleri sürükleyin veya seçin...",
    isAdminPage: true,
    accept : ".png, .jpg, .jpeg"
  };

  createProduct(txtName: HTMLInputElement, txtStock: HTMLInputElement, txtPrice: HTMLInputElement) {
    this.ShowSpinner(SpinnerType.Timer);
    const create_product: Create_Product = new Create_Product();
    create_product.name = txtName.value;
    create_product.stock = parseInt(txtStock.value);
    create_product.price = parseFloat(txtPrice.value);

    this.productService.createProduct(create_product, () => {
      this.HideSpinner(SpinnerType.Timer);
      this.alertifyService.message("Ürün Ekleme başarılı.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    });
  }

}
