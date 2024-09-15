import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MqttBrokerServiceService {
  private apiUrl = 'broker/command';

  constructor(
    private http: HttpClient,
    private user: UserService,
  ) {}

  loadConnectorList(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
        'Content-Type': 'application/json',
      }),
    };
    const postData = {
      commands: [{ command: 'listClients', verbose: false }],
    };
    return this.http.post(this.apiUrl, postData, httpOptions);
  }

  updateData(connid: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
        'Content-Type': 'application/json',
      }),
    };
    const postData = {
      commands: [{ command: 'modifyClient', connid: connid }],
    };
    return this.http.post(this.apiUrl, postData, httpOptions);
  }

  loadConnectorDetails(connid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
        'Content-Type': 'application/json',
      }),
    };
    const postData = {
      commands: [{ command: 'getClient', connid: connid }],
    };

    return this.http.post(this.apiUrl, postData, httpOptions);
  }

  deleteConnectors(connid: string[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
        'Content-Type': 'application/json',
      }),
    };
    const postData = {
      commands: [{ command: 'deleteConnectors', connectors: connid }],
    };
    console.log('Payload for deleteConnectors:', JSON.stringify(postData));
    return this.http.post(this.apiUrl, postData, httpOptions);
  }

  createConnector(conn_params: object): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
        'Content-Type': 'application/json',
      }),
    };

    const postData: any = {
      commands: [
        {
          command: 'createClient',
          ...conn_params
        },
      ],
    };

    return this.http.post(this.apiUrl, postData, httpOptions);
  }
}
