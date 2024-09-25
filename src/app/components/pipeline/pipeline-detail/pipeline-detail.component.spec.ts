import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineDetailComponent } from './pipeline-detail.component';

describe('PipelineDetailComponent', () => {
  let component: PipelineDetailComponent;
  let fixture: ComponentFixture<PipelineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
