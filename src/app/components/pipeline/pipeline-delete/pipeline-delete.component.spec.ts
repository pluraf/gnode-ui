import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineDeleteComponent } from './pipeline-delete.component';

describe('PipelineDeleteComponent', () => {
  let component: PipelineDeleteComponent;
  let fixture: ComponentFixture<PipelineDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
