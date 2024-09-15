import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class MqttBrokerServiceService {
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

  loadConnectorList(): Observable<any> {
    const postData = {
      commands: [{ command: 'listClients', verbose: false }],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  updateConnector(updateData: {
    connid: string;
    communicationStatus: string;
  }): Observable<any> {
    const postData = {
      commands: [
        {
          command: 'modifyClient',
          clientid: updateData.connid,
          textname: '',
          textdescription: '',
          roles: [],
          groups: [],
          communicationStatus: updateData.communicationStatus,
        },
      ],
    };
    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  loadConnectorDetails(connid: string) {
    const postData = {
      commands: [{ command: 'getClient', connid: connid }],
    };

    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  deleteConnectors(connid: string[]): Observable<any> {
    const postData = {
      commands: [{ command: 'deleteConnectors', connectors: connid }],
    };

    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  createConnector(
    connid: string,
    username?: string,
    password?: string,
    authType?: string,
    disabled: boolean = false,
  ): Observable<any> {
    const postData: any = {
      commands: [
        {
          command: 'createClient',
          connid: connid,
          username: username,
          password: password,
          disabled: disabled,
          authType: authType,
        },
      ],
    };

    return this.http.post(this.apiUrl, postData, this.httpOptions);
  }

  // Temporaray service function for uploading files
  uploadPrivatePublicKey(file: File): Observable<any> {
    const formObj = new FormData();
    formObj.append('file', file);

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
      }),
    };

    return this.http.post(this.apiUrl, formObj, httpOptions);
  }
}
