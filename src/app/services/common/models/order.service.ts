import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { Create_Order } from '../../../contracts/Order/create_order';
import { List_Order } from '../../../contracts/Order/list_order';
import { SingleOrder } from '../../../contracts/Order/single_order';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService: HttpClientService) { }

  async create(order: Create_Order): Promise<void> {
    const observable: Observable<any> = await this.httpClientService.post({
      controller: "orders"
    }, order);

    await firstValueFrom(observable);
  }

  async getAllOrder(page: number = 0, size: number = 0, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalOrderCount: number, orders: List_Order[] }> {
    const observable: Observable<{ totalOrderCount: number, orders: List_Order[] }> = await this.httpClientService.get({
      controller: "orders",
      queryString: `page= ${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error))
    return await promiseData;
  }

  async getOrderById(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<SingleOrder> = this.httpClientService.get<SingleOrder>({
      controller: "orders"
    }, id);

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error))

    return await promiseData;
  }

  async completeOrder(id: string) {
    const observable: Observable<any> = this.httpClientService.get({
      controller: "orders",
      action: "complete-order"
    }, id);

    await firstValueFrom(observable);
  }
}
