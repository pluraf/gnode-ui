import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthbundleEditComponent } from './authbundle-edit.component';

describe('AuthbundleEditComponent', () => {
  let component: AuthbundleEditComponent;
  let fixture: ComponentFixture<AuthbundleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthbundleEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthbundleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
