import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientModule],
      providers: [UserService, AuthService, provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error message when fields are empty', () => {
    component.loginUser.username = '';
    component.loginUser.password = '';
    component.onLogin();

    expect(component.errorMessage).toBe('Username and password are required.');
  });
  it('should show an error message when credentials are invalid', () => {
    component.loginUser.username = 'wrongUser';
    component.loginUser.password = 'wrongPassword';
    spyOn(component.apiService, 'getAuthToken').and.returnValue(
      throwError({ error: { detail: 'Invalid credentials' } }),
    );

    component.onLogin();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should show an error message when password is incorrect', () => {
    component.loginUser.username = 'admin';
    component.loginUser.password = 'wrongPassword';
    spyOn(component.apiService, 'getAuthToken').and.returnValue(
      throwError({ error: { detail: 'Incorrect username or password' } }),
    );

    component.onLogin();

    expect(component.errorMessage).toBe('Incorrect username or password');
  });

  it('should store the token and navigate to /channels on successful login', () => {
    component.loginUser.username = 'validUser';
    component.loginUser.password = 'validPassword';
    const mockToken = 'valid_token_123';
    spyOn(component.apiService, 'getAuthToken').and.returnValue(
      of({ access_token: mockToken }),
    );
    spyOn(component.authService, 'storeToken');
    spyOn(component.router, 'navigateByUrl');

    component.onLogin();

    expect(component.authService.storeToken).toHaveBeenCalledWith(mockToken);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/channels');
  });
  it('should show a generic error message when an unknown error occurs', () => {
    component.loginUser.username = 'validUser';
    component.loginUser.password = 'validPassword';
    spyOn(component.apiService, 'getAuthToken').and.returnValue(
      throwError({ message: 'Server error' }),
    );

    component.onLogin();

    expect(component.errorMessage).toBe('Server error');
  });

  it('should call the API service to get the auth token with valid credentials', () => {
    component.loginUser.username = 'validUser';
    component.loginUser.password = 'validPassword';
    const spyApiCall = spyOn(
      component.apiService,
      'getAuthToken',
    ).and.returnValue(of({ access_token: 'mock_token' }));

    component.onLogin();

    expect(spyApiCall).toHaveBeenCalledWith('validUser', 'validPassword');
  });
  it('should show a fallback error message when the error does not contain detail or message', () => {
    component.loginUser.username = 'validUser';
    component.loginUser.password = 'validPassword';
    spyOn(component.apiService, 'getAuthToken').and.returnValue(throwError({}));

    component.onLogin();

    expect(component.errorMessage).toBe('An unknown error occurred.');
  });

  it('should show an error message when there is no token or the token is invalid', fakeAsync(() => {
    component.loginUser.username = 'validUser';
    component.loginUser.password = 'validPassword';
    const mockToken = '';
    spyOn(component.apiService, 'getAuthToken').and.returnValue(
      of({ access_token: mockToken }),
    );
    spyOn(component.authService, 'storeToken');

    component.onLogin();

    tick();

    expect(component.errorMessage).toBe('Invalid token');
  }));
});
