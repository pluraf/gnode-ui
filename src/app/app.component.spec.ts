import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DatetimeService } from './services/datetime.service';
import { BackendService } from './services/backend.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeaderComponent } from './components/header/header.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let datetimeService: DatetimeService;
  let backendService: BackendService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HeaderComponent, HttpClientTestingModule],
      providers: [DatetimeService, BackendService, provideHttpClient],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    datetimeService = TestBed.inject(DatetimeService);
    backendService = TestBed.inject(BackendService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'gnode-ui' title`, () => {
    expect(app.title).toEqual('gnode-ui');
  });

  it(`should create dateTimeService`, () => {
    expect(datetimeService).toBeTruthy();
  });
  it(`should create BackendService`, () => {
    expect(backendService).toBeTruthy();
  });
});
