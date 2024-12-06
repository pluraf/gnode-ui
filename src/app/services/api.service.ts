import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiInfo, Settings } from './service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  private authbundleUrl = 'api/authbundle/';
  // Settings API
  private settingsUrl = 'api/settings/';
  // Pipeline API
  private pipelineConfigUrl = 'api/pipeline/config/';
  private pipelineControlUrl = 'api/pipeline/control/';
  private pipelineStatusUrl = 'api/pipeline/status/';
  // Channel API
  private channelUrl = 'api/channel/';
  // Version API
  private apiVersionUrl = '/api/version';
  // Status API
  private statusUrl = '/api/status';
  // Info API
  private apiInfoUrl = '/api/info';

  http = inject(HttpClient);

  /////////////////////////// Authbundles ///////////////////////////

  listAuthbundles(): Observable<any> {
    return this.http.get(this.authbundleUrl);
  }

  deleteAuthbundle(authbundleId: string): Observable<any> {
    return this.http.delete(this.authbundleUrl + authbundleId);
  }

  getAuthbundles(authbundleId: string): Observable<any> {
    return this.http.get(this.authbundleUrl + authbundleId);
  }

  createAuthbundle(formData: object): Observable<any> {
    return this.http.post(this.authbundleUrl, formData);
  }

  editAuthbundle(authbundle_id: string, formData: FormData): Observable<any> {
    return this.http.put(this.authbundleUrl + authbundle_id, formData);
  }

  /////////////////////////// Settings ///////////////////////////

  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(this.settingsUrl);
  }

  updateSettings(settings: object): Observable<any> {
    return this.http.put(this.settingsUrl, settings);
  }

  /////////////////////////// Channels ///////////////////////////

  channelList(): Observable<any> {
    return this.http.get(this.channelUrl);
  }

  channelGet(chanid: string) {
    return this.http.get(this.channelUrl + chanid);
  }

  channelUpdate(chanid: string, chandata: object): Observable<any> {
    return this.http.put(this.channelUrl + chanid, chandata);
  }

  channelCreate(chanid: string, chandata: object): Observable<any> {
    return this.http.post(this.channelUrl + chanid, chandata);
  }

  channelDelete(chanid: string): Observable<any> {
    return this.http.delete(this.channelUrl + chanid);
  }

  /////////////////////////// Pipelines ///////////////////////////

  pipelineList(): Observable<any> {
    return this.http.get(this.pipelineConfigUrl);
  }

  pipelineGet(pipeid: string): Observable<any> {
    return this.http.get(this.pipelineConfigUrl + pipeid);
  }

  pipelineEdit(pipeid: string, pipedata: string): Observable<any> {
    return this.http.put(this.pipelineConfigUrl + pipeid, pipedata);
  }

  pipelineCreate(pipeid: string, pipedata: object): Observable<any> {
    return this.http.post(this.pipelineConfigUrl + pipeid, pipedata);
  }

  pipelineDelete(pipeid: string): Observable<any> {
    return this.http.delete(this.pipelineConfigUrl + pipeid);
  }

  pipelineStatusGet(pipeid: string): Observable<any> {
    return this.http.get(this.pipelineStatusUrl + pipeid);
  }

  pipelineStatusList(): Observable<any> {
    return this.http.get(this.pipelineStatusUrl);
  }

  startPipeline(pipeid: string): Observable<any> {
    const postData = {
      commands: [{ command: 'start' }],
    };
    return this.http.put(
      `${this.pipelineControlUrl}/start/${pipeid}`,
      postData,
    );
  }

  stopPipeline(pipeid: string): Observable<any> {
    const postData = {
      commands: [{ command: 'stop' }],
    };
    return this.http.put(this.pipelineControlUrl + '/stop/' + pipeid, postData);
  }

  /////////////////////////// Version ///////////////////////////

  getApiVersion(): Observable<any> {
    return this.http.get<any>(this.apiVersionUrl);
  }

  /////////////////////////// Status ///////////////////////////

  getStatus(): Observable<any> {
    return this.http.get<any>(this.statusUrl);
  }

  /////////////////////////// API Info ///////////////////////////

  getApiInfo(): Observable<ApiInfo> {
    return this.http.get<ApiInfo>(this.apiInfoUrl);
  }

  ////////////////////////// Auth Token //////////////////////////

  getAuthToken(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post('api/auth/token/', body.toString(), { headers });
  }

  //Modify to send the encrypted data
  /*   getAuthToken(userDetail: any): Observable<any> {
    const body = JSON.stringify({ userDetail });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('api/auth/token/', body, { headers });
  } */

  //////////////////////////////// Users ///////////////////

  getUsers(): Observable<any> {
    return this.http.get('api/user/');
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete('api/user/' + userId);
  }

  createUser(userObj: any): Observable<any> {
    return this.http.post('api/user/', userObj);
  }

  ///////////////////////////////// TimeZones ////////////////////////////

  getTimeZones(): Observable<any> {
    return this.http.get('api/timezones');
  }

  ///////////////////////////////// Next ////////////////////////////
}
