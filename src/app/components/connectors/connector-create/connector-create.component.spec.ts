import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorCreateComponent } from '../devices-create/devices-create.component';

describe('ConnectorCreateComponent', () => {
  let component: ConnectorCreateComponent;
  let fixture: ComponentFixture<ConnectorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectorCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
