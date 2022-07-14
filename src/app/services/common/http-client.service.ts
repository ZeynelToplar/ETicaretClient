import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) {}

  private url(requestParamaters: Partial<RequestParamaters>) {
    return `${
      requestParamaters.baseUrl ? requestParamaters.baseUrl : this.baseUrl
    }/${requestParamaters.controller}${
      requestParamaters.action ? `/${requestParamaters.action}` : ''
    }`;
  }

  get<T>(requestParamaters: Partial<RequestParamaters>, id?:string) : Observable<T> {
    let url: string = '';

    if (requestParamaters.fullEndPoint) url = requestParamaters.fullEndPoint;
    else url = `${this.url(requestParamaters)}${id ? `/${id}` : ""}${requestParamaters.queryString ? `?${requestParamaters.queryString}` : ""}`;

    return this.httpClient.get<T>(url, {headers :requestParamaters.headers})
  }

  post<T>(requestParamaters: Partial<RequestParamaters>,body:Partial<T>) : Observable<T> {
    let url:string ="";
    if(requestParamaters.fullEndPoint) url = requestParamaters.fullEndPoint;
    else url = `${this.url(requestParamaters)}${requestParamaters.queryString ? `?${requestParamaters.queryString}` : ""}`;
    return this.httpClient.post<T>(url,body,{headers:requestParamaters.headers})
  }

  put<T>(requestParamaters: Partial<RequestParamaters>,body:Partial<T>) :Observable<T> {
    let url:string ="";
    if(requestParamaters.fullEndPoint) url = requestParamaters.fullEndPoint;
    else url = `${this.url(requestParamaters)}${requestParamaters.queryString ? `?${requestParamaters.queryString}` : ""}`
    return this.httpClient.put<T>(url,body,{headers:requestParamaters.headers});
  }

  delete<T>(requestParamaters: Partial<RequestParamaters>,id:string) : Observable<T> {
    let url:string="";
    if(requestParamaters.fullEndPoint) url = requestParamaters.fullEndPoint;
    else url = `${this.url(requestParamaters)}/${id}${requestParamaters.queryString ? `?${requestParamaters.queryString}` : ""}`;
    return this.httpClient.delete<T>(url,{headers:requestParamaters.headers});
  }
}

export class RequestParamaters {
  controller?: string;
  action?: string;
  queryString?: string;
  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;
}
