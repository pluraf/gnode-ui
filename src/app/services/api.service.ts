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
  // CA API
  private caUrl = 'api/ca/'
  // Settings API
  private settingsUrl = 'api/settings/';
  // Pipeline API
  private pipelineConfigUrl = 'api/pipeline/config/';
  private pipelineControlUrl = 'api/pipeline/control/';
  private pipelineStatusUrl = 'api/pipeline/status/';
  private pipelineSchemaUrl = 'api/pipeline/schema/';
  // Channel API
  private channelUrl = 'api/channel/';
  // Converter API
  private converterUrl = 'api/converter/';
  // Version API
  private apiVersionUrl = '/api/version';
  // Status API
  private statusUrl = '/api/status';
  // Info API
  private apiInfoUrl = '/api/info';

  http = inject(HttpClient);

  ////////////////////////////// ANY ////////////////////////////////

  get(url: string): Observable<any> {
    return this.http.get(url);
  }

  /////////////////////////// Authbundles ///////////////////////////

  authbundleList(): Observable<any> {
    return this.http.get(this.authbundleUrl);
  }

  authbundleDelete(authbundleId: string): Observable<any> {
    return this.http.delete(this.authbundleUrl + authbundleId, {observe: 'response'});
  }

  authbundleGet(authbundleId: string): Observable<any> {
    return this.http.get(this.authbundleUrl + authbundleId);
  }

  authbundleCreate(formData: object): Observable<any> {
    return this.http.post(this.authbundleUrl, formData);
  }

  authbundleEdit(authbundle_id: string, formData: FormData): Observable<any> {
    return this.http.put(this.authbundleUrl + authbundle_id, formData);
  }

  /////////////////////////// CA Certificates ///////////////////////////

  caList(): Observable<any> {
    return this.http.get(this.caUrl);
  }

  caDelete(caId: string): Observable<any> {
    return this.http.delete(this.caUrl + caId, {observe: 'response'});
  }

  caGet(caId: string): Observable<any> {
    return this.http.get(this.caUrl + caId);
  }

  caAdd(formData: object): Observable<any> {
    return this.http.post(this.caUrl, formData);
  }

  caEdit(caId: string, formData: FormData): Observable<any> {
    return this.http.put(this.caUrl + caId, formData);
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
    return this.http.delete(this.channelUrl + chanid, {observe: 'response'});
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

  pipelineCreate(pipeid: string, pipedata: string): Observable<any> {
    return this.http.post(this.pipelineConfigUrl + pipeid, pipedata);
  }

  pipelineDelete(pipeid: string): Observable<any> {
    return this.http.delete(this.pipelineConfigUrl + pipeid, {observe: 'response'});
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

  pipelineSchema() {
    return this.http.get(this.pipelineSchemaUrl);
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('api/auth/token/', userDetail, { headers });
  } */

  //////////////////////////////// Users ///////////////////

  getUsers(): Observable<any> {
    return this.http.get('api/user/');
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete('api/user/' + userId, {observe: 'response'});
  }

  createUser(userObj: any): Observable<any> {
    return this.http.post('api/user/', userObj);
  }

  ///////////////////////////////// TimeZones ////////////////////////////

  getTimeZones(): Observable<any> {
    return this.http.get('api/timezones');
  }

  /////////////////////////// Authbundles ///////////////////////////

  converterList(): Observable<any> {
    return this.http.get(this.converterUrl);
  }

  converterDelete(converterId: string): Observable<any> {
    return this.http.delete(this.converterUrl + converterId, {observe: 'response'});
  }

  converterGet(converterId: string): Observable<any> {
    return this.http.get(this.converterUrl + converterId);
  }

  converterCreate(formData: object): Observable<any> {
    return this.http.post(this.converterUrl, formData);
  }

  converterUpdate(converterId: string, formData: FormData): Observable<any> {
    return this.http.put(this.converterUrl + converterId, formData);
  }

  ///////////////////////////////// Next ////////////////////////////
}
