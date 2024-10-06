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
    return this.http.get(this.authbundleUrl, this.httpOptions);
  }

  deleteAuthbundles(authbundleId: string[]): Observable<any> {
    return this.http.delete(
      this.authbundleUrl + authbundleId,
      this.httpOptions,
    );
  }
  getAuthbundles(authbundleId: string): Observable<any> {
    return this.http.get(this.authbundleUrl + authbundleId, {
      ...this.httpOptions,
    });
  }

  createAuthbundle(formData: object): Observable<any> {
    return this.http.post(this.authbundleUrl, formData, this.httpOptions);
  }

  editAuthbundle(formData: object): Observable<any> {
    return this.http.put(this.authbundleUrl + formData, this.httpOptions);
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

  pipelineGet(pipeid: string): Observable<any> {
    return this.http.get(this.pipelineUrl + pipeid, {
      ...this.httpOptions,
      // responseType: 'text'
    });
  }

  pipelineEdit(pipeid: string, pipedata: string): Observable<any> {
    return this.http.put(this.pipelineUrl + pipeid, pipedata, this.httpOptions);
  }

  pipelineCreate(pipeid: string, pipedata: object): Observable<any> {
    return this.http.post(
      this.pipelineUrl + pipeid,
      pipedata,
      this.httpOptions,
    );
  }

  pipelineDelete(pipeid: string, pipeids: string[]): Observable<any> {
    return this.http.delete(this.pipelineUrl + pipeid, {
      headers: this.httpOptions.headers,
      body: pipeids,
    });
  }

  /*   getPipelineConfig(): Observable<any> {
    console.log(this.httpOptions);
    return this.http.get(`${this.pipelineUrl}config-file`, this.httpOptions);
  } */

  /////////////////////////// Next ///////////////////////////
}
