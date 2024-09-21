import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class BackendService {
  // Authbundle APIs
  private authbundleUrl = 'api/authbundle/';
  private authbundleListUrl = this.authbundleUrl + 'list';
  private authbundleCreateUrl = this.authbundleUrl + 'create';
  private authbundleDeleteUrl = this.authbundleUrl + 'delete';
  // Channel APIs
  private channelApiUrl = 'broker/command';
  private httpOptions: { headers: HttpHeaders };
  http = inject(HttpClient);
  user = inject(UserService);

  constructor() {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.user.getToken()}`,
      }),
    };
  }

/////////////////////////// Authbundles ///////////////////////////

  listAuthbundles(): Observable<any> {
    return this.http.get(this.authbundleListUrl, this.httpOptions);
  }

  deleteAuthbundles(authbundleId: string[]): Observable<any> {
    return this.http.delete(
      this.authbundleDeleteUrl + authbundleId, this.httpOptions
    );
  }

  createAuthbundle(formData: object): Observable<any> {
    return this.http.post(
      this.authbundleCreateUrl, formData, this.httpOptions
    );
  }
}

/////////////////////////// Next ///////////////////////////
