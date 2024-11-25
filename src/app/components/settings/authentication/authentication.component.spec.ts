/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthenticationComponent } from './authentication.component';
import { ApiService } from '../../../services/api.service';
import { MessageService } from 'primeng/api';
import { SettingsService } from '../../../services/settings.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('AuthenticationComponent', () => {
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let settingsServiceMock: jasmine.SpyObj<SettingsService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['updateSettings']);
    messageServiceMock = jasmine.createSpyObj('MessageService', [
      'add',
      'clear',
    ]);
    settingsServiceMock = jasmine.createSpyObj('SettingsService', [
      'loadSettingsData',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    settingsServiceMock.loadSettingsData.and.returnValue(
      of({
        allow_anonymous: false,
        time: {
          timestamp: 1617657381000,
          iso8601: '2024-11-19T00:00:00Z',
          timezone: 'UTC',
        },
        network_settings: {},
        authentication: true,
        gcloud: true,
      }),
    );

    apiServiceMock.updateSettings.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AuthenticationComponent, CommonModule, FormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load settings data and set isAuthentication to true', () => {
    expect(settingsServiceMock.loadSettingsData).toHaveBeenCalledOnceWith();
    expect(component.settings.isAuthentication).toBe(true);
  });

  it('should call onSubmit and update settings', () => {
    component.onSubmit();
    expect(apiServiceMock.updateSettings).toHaveBeenCalledOnceWith({
      authentication: true,
    });

    /*     expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      detail: 'Submitted successfully',
    }); 
  });*/
