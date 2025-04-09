import { inject, Injectable, signal } from '@angular/core';
import { ApiInfo } from './service';
import { ApiService } from './api.service';
import { catchError, of, tap, map } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class InfoService {
  apiService = inject(ApiService);

  infoData = signal<ApiInfo>({
    mode: '',
    version: '',
    serial_number: '',
    hostname: '',
    anonymous: null,
    time: null
  });

  private http: HttpClient;
  private basicsCached = false;
  private infoCached = false;

  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(this.httpBackend);
  }

  public loadInfo() {
    if (this.infoCached) {
      return;
    }
    this.apiService
      .getApiInfo()
      .pipe(
        tap((response: ApiInfo) => {
          this.infoCached = true;
          this.infoData.update((v) => {
            return {
              mode: response.mode,
              serial_number: response.serial_number,
              hostname: `gnode-${response.serial_number}`,
              version: response.version,
              anonymous: v.anonymous,
              time: response.time
            }
          });
        }),
        catchError((error) => {
          return of(null);
        }),
      )
      .subscribe();
  }

  private cacheBasics(resp: any) {
    if (resp.status == 204) {
      this.infoData.update((v) => {
        return {
          mode: v.mode,
          serial_number: v.serial_number,
          hostname: `gnode-${v.serial_number}`,
          version: v.version,
          anonymous: true,
          time: v.time
        }
      });
    } else if (resp.status == 405) {
      this.infoData.update((v) => {v.anonymous = false; return v;});
    }
    this.basicsCached = true;
  }

  public loadBasics() {
    // Cached
    if (this.basicsCached) {
      return of(true);
    }
    // Fetch and cache
    return this.http.get('/api/auth/token/', {observe: 'response'}).pipe(
      tap(resp => this.cacheBasics(resp)),
      catchError((resp) => {
        this.cacheBasics(resp);
        return of(true);
      })
    );
  }

  public dropCache() {
    this.infoCached = false;
    this.basicsCached = false;
    this.infoData.set({
      mode: '',
      version: '',
      serial_number: '',
      hostname: '',
      anonymous: null,
      time: null
    });
  }
}
