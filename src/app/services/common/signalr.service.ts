import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(@Inject("baseSignalRUrl") private baseSignalRUrl: string) { }


  start(hubUrl: string) {
    hubUrl = this.baseSignalRUrl + hubUrl

    const builder: HubConnectionBuilder = new HubConnectionBuilder();

    const hubConnection: HubConnection = builder.withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    hubConnection.start()
      .then(() => {
        console.log("Bağlandı");
      })
      .catch(error => setTimeout(() => this.start(hubUrl), 2000));


    hubConnection.onreconnected(connectionId => console.log("Tekrar bağlandı."));
    hubConnection.onreconnecting(error => console.log("Tekrar bağlanılıyor."));
    hubConnection.onclose(error => console.log("Bağlandı başarısız."));

    return hubConnection;
  }

  invoke(hubUrl: string, procedureName: string, message: any, successCallBack?: (value) => void, errorCallBack?: (error) => void) {
    this.start(hubUrl).invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }

  on(hubUrl: string, procedureName: string, callBack: (...message: any) => void) {
    this.start(hubUrl).on(procedureName, callBack)
  }
}
