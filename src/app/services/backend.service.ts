import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

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
  // Version API
  private apiVersionUrl = '/api/version';
  // Status API
  private statusUrl = '/api/status';
  // Info API
  private apiInfoUrl = '/api/info';

  http = inject(HttpClient);
  user = inject(UserService);

  private cachedApiInfo: any = null;

  constructor() {
    if (this.user.getToken()) {
      this.httpOptions = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.user.getToken()}`,
        }),
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders(),
      };
    }
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

  getSettings(): Observable<any> {
    return this.http.get<any>(this.settingsUrl, this.httpOptions);
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

  startPipeline(pipeid: string): Observable<any> {
    const postData = {
      commands: [{ command: 'start' }],
    };
    return this.http.put(
      `${this.pipelineControlUrl}/start/${pipeid}`,
      postData,
      this.httpOptions,
    );
  }

  stopPipeline(pipeid: string): Observable<any> {
    const postData = {
      commands: [{ command: 'stop' }],
    };
    return this.http.put(
      this.pipelineControlUrl + '/stop/' + pipeid,
      postData,
      this.httpOptions,
    );
  }

  /////////////////////////// Version ///////////////////////////

  getApiVersion(): Observable<any> {
    return this.http.get<any>(this.apiVersionUrl);
  }

  /////////////////////////// Status ///////////////////////////

  getStatus(): Observable<any> {
    return this.http.get<any>(this.statusUrl, this.httpOptions);
  }

  /////////////////////////// API Info ///////////////////////////

  loadApiInfo(): Observable<any> {
    if (this.cachedApiInfo) {
      return of(this.cachedApiInfo);
    } else {
      return new Observable((observer) => {
        this.http
          .get<any>(this.apiInfoUrl, this.httpOptions)
          .subscribe((response) => {
            this.cachedApiInfo = response;
            observer.next(response);
            observer.complete();
          });
      });
    }
  }

  getApiInfo(): Observable<any> {
    if (this.cachedApiInfo) {
      return of(this.cachedApiInfo);
    } else {
      return this.loadApiInfo();
    }
  }

  clearApiInfoCache() {
    this.cachedApiInfo = null;
  }

  /////////////////////////// Next ///////////////////////////
}
