import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Token } from '../../../contracts/Token/token';
import { TokenResponse } from '../../../contracts/Token/tokenResponse';
import { Create_User } from '../../../contracts/User/create_user';
import { User } from '../../../entities/user';
import { CustomerToastrService, ToastrMessageType, ToastrPosition } from '../../ui/customer-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService,
    private toastrService: CustomerToastrService) { }

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as Create_User;
  }

  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, successCallBackFunction?: () => void, errorCallBackFunction?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "update-password"
    }, {
      userId: userId,
      resetToken: resetToken,
      password: password,
      passwordConfirm: passwordConfirm
    });

    const promiseData: Promise<any> = await firstValueFrom(observable);
    promiseData.then(value => successCallBackFunction()).catch(error => errorCallBackFunction(error));
    await promiseData;
  }
}
