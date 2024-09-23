import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class BackendService {
  // Authbundle API
  private authbundleUrl = 'api/authbundle/';
  private authbundleListUrl = this.authbundleUrl + 'list';
  private authbundleCreateUrl = this.authbundleUrl + 'create';
  private authbundleDeleteUrl = this.authbundleUrl + 'delete';
  // Channel API
  private channelApiUrl = 'broker/command';
  private httpOptions: { headers: HttpHeaders };
  // Settings API
  private settingsUrl = 'api/settings/';
  // Pipeline API
  private pipelineUrl = 'm2e/pipeline/';

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


/////////////////////////// Settings ///////////////////////////

  loadSettings(): Observable<any> {
    return this.http.get(this.settingsUrl, this.httpOptions);
  }

  updateSettings(settings: object): Observable<any> {
    return this.http.put(this.settingsUrl, settings, this.httpOptions);
  }

/////////////////////////// Pipelines ///////////////////////////

  pipelinesList(): Observable<any> {
    return this.http.get(this.pipelineUrl, this.httpOptions);
  }

/////////////////////////// Next ///////////////////////////



}