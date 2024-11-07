import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { BackendService } from './backend.service';
import { UserService } from './user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

class MockUserService {
  getToken() {
    return 'mock-token';
  }
}

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BackendService,
        { provide: UserService, useClass: MockUserService },
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BackendService);
  });

  it('should create backendService', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of auth bundles', () => {
    const mockResponse = [{ id: '1', name: 'AuthBundle1' }];

    service.listAuthbundles().subscribe((bundles) => {
      expect(bundles).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/authbundle/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });
});
