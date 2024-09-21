import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorDeleteComponent } from './authbundle-delete.component';

describe('ConnectorDeleteComponent', () => {
  let component: ConnectorDeleteComponent;
  let fixture: ComponentFixture<ConnectorDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectorDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectorDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
