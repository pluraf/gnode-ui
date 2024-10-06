import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthbundleDetailComponent } from './authbundle-detail.component';

describe('AuthbundleDetailComponent', () => {
  let component: AuthbundleDetailComponent;
  let fixture: ComponentFixture<AuthbundleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthbundleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthbundleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
