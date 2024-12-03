import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubheaderComponent } from './subheader.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Directive, Input } from '@angular/core';

import { of } from 'rxjs';

@Directive({
  selector: '[routerLink]',
})
class MockRouterLinkDirective {
  @Input() routerLink: any;
}

@Directive({
  selector: '[routerLinkActive]',
})
class MockRouterLinkActiveDirective {
  @Input() routerLinkActive: any;
}

describe('SubheaderComponent', () => {
  let component: SubheaderComponent;
  let fixture: ComponentFixture<SubheaderComponent>;
  let locationMock: jasmine.SpyObj<Location>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(() => {
    locationMock = jasmine.createSpyObj('Location', ['back']);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    activatedRouteMock = {
      snapshot: { params: {}, queryParams: {}, data: {} },
    };
    TestBed.configureTestingModule({
      imports: [SubheaderComponent, RouterModule],
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      declarations: [MockRouterLinkDirective, MockRouterLinkActiveDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(SubheaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set default input values correctly', () => {
    expect(component.selectedMenuName).toBe('');
    expect(component.actions).toEqual([]);
    expect(component.items).toEqual([]);
    expect(component.backRoute).toBe('');
  });

  it('should call location.back() when useExplicitNavigation is false', () => {
    component.goBack();

    expect(locationMock.back).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should call router.navigate() when useExplicitNavigation is true and backRoute is provided', () => {
    component.backRoute = '/some-back-route';

    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/some-back-route']);
    expect(locationMock.back).not.toHaveBeenCalled();
  });

  it('should call location.back() when useExplicitNavigation is true but backRoute is not provided', () => {
    component.backRoute = '';

    component.goBack();

    expect(locationMock.back).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should handle input changes correctly', () => {
    component.selectedMenuName = 'Menu 1';
    component.actions = [{ label: 'Action 1' }];
    component.items = [{ label: 'Item 1' }];
    component.backRoute = '/new-back-route';

    fixture.detectChanges();

    expect(component.selectedMenuName).toBe('Menu 1');
    expect(component.actions).toEqual([{ label: 'Action 1' }]);
    expect(component.items).toEqual([{ label: 'Item 1' }]);
    expect(component.backRoute).toBe('/new-back-route');
  });
});
