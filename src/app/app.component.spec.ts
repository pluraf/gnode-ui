/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { DatetimeService } from './services/datetime.service';
import { ChangeDetectorRef } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { HttpClient } from '@angular/common/http';
import { ApiinfoService } from './services/apiinfo.service';
import { of } from 'rxjs';

// Mock services
class MockRouter {}
class MockDatetimeService {
  settings() {
    return { currentDateTime: '2024-11-21T10:00:00Z' }; // Mock datetime
  }
}
class MockSettingsService {
  loadSettingsData() {
    return of({ authentication: false }); // Mock authentication setting
  }
}

class MockChangeDetectorRef {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: MockRouter;
  let mockDatetimeService: MockDatetimeService;
  let mockSettingsService: MockSettingsService;
  let mockChangeDetectorRef: MockChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: DatetimeService, useClass: MockDatetimeService },
        { provide: SettingsService, useClass: MockSettingsService },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
        { provide: HttpClient, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    mockDatetimeService = TestBed.inject(DatetimeService);
    mockSettingsService = TestBed.inject(SettingsService);
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef);
  });

  it('should set currentDateTime from DatetimeService', () => {
    component.ngOnInit();
    expect(component.currentDateTime).toBe('2024-11-21T10:00:00Z');
  });

  it('should set isVirtualMode to true based on ApiinfoService mode', () => {
    component.ngOnInit();
    expect(component.isVirtualMode).toBeTrue();
  });

  it('should set isAuthentication to false based on SettingsService response', () => {
    component.ngOnInit();
    expect(component.isAuthentication).toBeFalse(); // As per mock settings
  });

  it('should call updateMenuItems when isVirtualMode is true', () => {
    spyOn(component, 'updateMenuItems');
    component.ngOnInit();
    expect(component.updateMenuItems).toHaveBeenCalled();
  });
});
 */
