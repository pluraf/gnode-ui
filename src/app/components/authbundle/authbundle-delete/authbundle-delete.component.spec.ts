import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthbundleDeleteComponent } from './authbundle-delete.component';

describe('ChannelDeleteComponent', () => {
  let component: AuthbundleDeleteComponent;
  let fixture: ComponentFixture<AuthbundleDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthbundleDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthbundleDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
