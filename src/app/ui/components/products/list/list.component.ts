import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { BaseUrl } from '../../../../contracts/baseUrl';
import { Create_Basket_Item } from '../../../../contracts/basket/create_basket_item';
import { List_Product } from '../../../../contracts/list_product';
import { Position } from '../../../../services/admin/alertify.service';
import { BasketService } from '../../../../services/common/models/basket.service';
import { FileService } from '../../../../services/common/models/fileService';
import { ProductService } from '../../../../services/common/models/product.service';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from '../../../../services/ui/customer-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private basketService: BasketService,
    spinner: NgxSpinnerService,
    private toastrService: CustomerToastrService)
  {
    super(spinner);
  }

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  pageList: number[] = [];
  baseUrl: BaseUrl;
  products: List_Product[];

  async ngOnInit() {

    this.baseUrl = await this.fileService.getBaseUrl();

    this.activatedRoute.params.subscribe(async params => {

      this.currentPageNo = parseInt(params["pageNo"] ?? 1);


      const data: { totalProductCount: number, products: List_Product[] } = await this.productService.read(this.currentPageNo - 1, this.pageSize, () => {

      }, errorMessage => {

      });

      this.products = data.products;
      debugger;

      this.products = this.products.map<List_Product>(p => {

        const listProduct: List_Product = 
        {
          id: p.id,
          createDate: p.createDate,
          imagePath: p.productImageFiles.length ? p.productImageFiles.find(p => p.showCase).path : "",
          name: p.name,
          price: p.price,
          stock: p.stock,
          updatedDate: p.updatedDate,
          productImageFiles: p.productImageFiles
        };
        debugger;
        return listProduct;
      });


      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.currentPageNo - 3 <= 0)
        for (let i = 1; i <= 7; i++) {
          this.pageList.push(i);
        }
      else if (this.currentPageNo + 3 >= this.totalPageCount)
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      else
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++) {
          this.pageList.push(i);
        }
    })

  }

  async addToBasket(product: List_Product) {
    this.ShowSpinner(SpinnerType.Timer);
    let _basketItem: Create_Basket_Item = new Create_Basket_Item();
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    await this.basketService.add(_basketItem);
    this.HideSpinner(SpinnerType.Timer);
    this.toastrService.message("Ürün sepete eklendi.", "Sepete Eklendi", {
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight
    });
  }

}
