import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupremeTableComponent } from './supreme-table.component';

describe('SupremeTableComponent', () => {
  let component: SupremeTableComponent;
  let fixture: ComponentFixture<SupremeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupremeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupremeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
