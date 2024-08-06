import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaysComponent } from './gateways.component';

describe('GatewaysComponent', () => {
  let component: GatewaysComponent;
  let fixture: ComponentFixture<GatewaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
