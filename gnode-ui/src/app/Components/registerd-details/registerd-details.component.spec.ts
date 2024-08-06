import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterdDetailsComponent } from './registerd-details.component';

describe('RegisterdDetailsComponent', () => {
  let component: RegisterdDetailsComponent;
  let fixture: ComponentFixture<RegisterdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterdDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
