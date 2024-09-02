import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorDetailComponent } from './connector-detail.component';

describe('ConnectorDetailComponent', () => {
  let component: ConnectorDetailComponent;
  let fixture: ComponentFixture<ConnectorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectorDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
