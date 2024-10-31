import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientModule],
      providers: [UserService, provideHttpClientTesting()],
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

    expect(component.errorMessage).toBe('Username and Password are required.');
  });
});
