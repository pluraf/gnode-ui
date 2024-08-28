import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesCreateComponent } from './devices-create.component';

describe('DevicesCreateComponent', () => {
  let component: DevicesCreateComponent;
  let fixture: ComponentFixture<DevicesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
