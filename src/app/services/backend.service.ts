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
  private pipelineConfigUrl = 'm2e/pipeline/config/';
  private pipelineControlUrl = 'm2e/pipeline/control/';
  private pipelineStatusUrl = 'm2e/pipeline/status/';
  // API Version
  private apiVersionUrl = '/api/version';

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

  deleteAuthbundles(authbundleIds: string[]): Observable<any> {
    return this.http.delete(this.authbundleUrl, {
      headers: this.httpOptions.headers,
      body: authbundleIds,
    });
  }

  getAuthbundles(authbundleId: string): Observable<any> {
    return this.http.get(this.authbundleUrl + authbundleId, {
      ...this.httpOptions,
    });
  }

  createAuthbundle(formData: object): Observable<any> {
    return this.http.post(this.authbundleUrl, formData, this.httpOptions);
  }

  editAuthbundle(authbundle_id: string, formData: FormData): Observable<any> {
    return this.http.put(
      this.authbundleUrl + authbundle_id,
      formData,
      this.httpOptions,
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
    return this.http.get(this.pipelineConfigUrl, this.httpOptions);
  }

  pipelineGet(pipeid: string): Observable<any> {
    return this.http.get(this.pipelineConfigUrl + pipeid, {
      ...this.httpOptions,
      // responseType: 'text'
    });
  }

  pipelineEdit(pipeid: string, pipedata: string): Observable<any> {
    return this.http.put(
      this.pipelineConfigUrl + pipeid,
      pipedata,
      this.httpOptions,
    );
  }

  pipelineCreate(pipeid: string, pipedata: object): Observable<any> {
    return this.http.post(
      this.pipelineConfigUrl + pipeid,
      pipedata,
      this.httpOptions,
    );
  }

  pipelineDelete(pipeid: string, pipeids: string[]): Observable<any> {
    return this.http.delete(this.pipelineConfigUrl + pipeid, {
      headers: this.httpOptions.headers,
      body: pipeids,
    });
  }

  getPipelineStatus(pipeid: string): Observable<any> {
    return this.http.get(this.pipelineStatusUrl + pipeid, {
      ...this.httpOptions,
    });
  }
  /////////////////////////// Next ///////////////////////////

  getApiVersion(): Observable<any> {
    return this.http.get<any>(this.apiVersionUrl);
  }
}
