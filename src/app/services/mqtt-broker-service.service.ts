import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MqttBrokerServiceService {
  private apiUrl = 'broker/command';

  constructor(private http: HttpClient) {}

  testBroker(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ey',
        'Content-Type': 'application/json',
      }),
    };

    const postData = {
      commands: [
        { command: 'listClients' },
        { command: 'listGroups' },
        { command: 'listRoles' },
      ],
    };

    return this.http.post(this.apiUrl, postData, httpOptions);
  }
}
