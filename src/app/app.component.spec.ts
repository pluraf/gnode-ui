import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  provideRouter,
  RouterModule,
  ActivatedRoute,
  RouterState,
} from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { InfoService } from './services/info.service';

class MockRouter {
  events: Observable<NavigationStart | NavigationEnd | Event> = of(
    new NavigationStart(1, '/channels'),
  );

  simulateNavigationEnd(url: string) {
    this.events = of(new NavigationEnd(1, url, url));
  }

  simulateNavigationStart(url: string) {
    this.events = of(new NavigationStart(1, url));
  }
}

class MockInfoService {
  infoData() {
    return { mode: 'virtual', anonymous: false as boolean | null };
  }
}

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: MockRouter;
  let mockInfoService: MockInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: Router, useClass: MockRouter },
        { provide: InfoService, useClass: MockInfoService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
    mockInfoService = TestBed.inject(InfoService);

    spyOn(mockInfoService, 'infoData').and.returnValue({
      mode: 'virtual',
      anonymous: false,
    });
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should set margin_left to 0px when route is "/login"', () => {
    window.history.pushState({}, '', '/login');
    component.ngOnInit();
    expect(component.margin_left).toBe('0px');
  });

  it('should set margin_left to 210px when route is not "/login"', () => {
    window.history.pushState({}, '', '/channels');
    component.ngOnInit();
    expect(component.margin_left).toBe('210px');
  });

  it('should update isVirtualMode and isAuthentication based on InfoService data', () => {
    component.ngOnInit();
    expect(component.isVirtualMode).toBeTrue();
    expect(component.isAuthentication).toBeTrue();
  });

  it('should update the menu items based on authentication and virtual mode', () => {
    spyOn(component, 'updateMenuItems').and.callThrough();

    component.ngOnInit();
    expect(component.updateMenuItems).toHaveBeenCalled();

    component.isVirtualMode = true;
    component.isAuthentication = false;
    component.updateMenuItems();

    expect(component.items[2].visible).toBe(false);

    const settingsMenu = component.items[3]?.items;
    expect(settingsMenu?.[1]?.visible).toBe(false);
    expect(settingsMenu?.[3]?.visible).toBe(false);
  });

  it('should subscribe to router events and update margin_left when route changes', () => {
    spyOn(component, 'ngOnInit').and.callThrough();

    mockRouter.simulateNavigationEnd('/status');
    fixture.detectChanges();

    expect(component.margin_left).toBe('210px');
  });
});
