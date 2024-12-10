import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipelineCreateComponent } from './pipeline-create.component';
import { ApiService } from '../../../services/api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';

fdescribe('PipelineCreateComponent', () => {
  let component: PipelineCreateComponent;
  let fixture: ComponentFixture<PipelineCreateComponent>;
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PipelineCreateComponent],
      providers: [ApiService, HttpClient, HttpHandler, provideRouter([])],
    });
    fixture = TestBed.createComponent(PipelineCreateComponent);
    component = fixture.componentInstance;
  });
  it('should create PipelineCreateComponent', () => {
    expect(component).toBeTruthy();
  });
});
