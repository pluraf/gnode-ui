import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MBrokerCService {
  private apiUrl = 'broker/command';
  private httpOptions: { headers: HttpHeaders };
  http = inject(HttpClient);
  user = inject(UserService);

  constructor() {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  loadChannelList(): Observable<any> {
    const postData = {
      commands: [{ command: 'listChannels', verbose: false }],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  updateChannel(updateData: object): Observable<any> {
    const postData = {
      commands: [
        {
          command: 'modifyChannel',
          ...updateData,
        },
      ],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  loadChannelDetails(chanid: string) {
    const postData = {
      commands: [{ command: 'getChannel', chanid: chanid }],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  deleteChannels(chanid: string[]): Observable<any> {
    const postData = {
      commands: [{ command: 'deleteChannels', channels: chanid }],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  createChannel(conn_params: object): Observable<any> {
    const postData: any = {
      commands: [
        {
          command: 'createChannel',
          ...conn_params,
        },
      ],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }
}
