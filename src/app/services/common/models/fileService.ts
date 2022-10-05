import { Injectable } from '@angular/core';
import { first, firstValueFrom, Observable } from 'rxjs';
import { BaseUrl } from '../../../contracts/baseUrl';
import { HttpClientService } from '../http-client.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClientService: HttpClientService) {

  }

  async getBaseUrl(): Promise<BaseUrl> {
    const getObservable: Observable<BaseUrl> = this.httpClientService.get<BaseUrl>({
      controller: "files",
      action: "GetBaseUrl"
    });

    return await firstValueFrom(getObservable);
  }

}
