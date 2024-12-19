import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipelineDetailComponent } from './pipeline-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { of } from 'rxjs';

fdescribe('PipelineDetailComponent', () => {
  let component: PipelineDetailComponent;
  let fixture: ComponentFixture<PipelineDetailComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PipelineDetailComponent],
      providers: [provideHttpClient(), provideRouter([]), ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineDetailComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create PipelineDetailComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load the pipeline details from service loadPipelineDetails() is called', () => {
    const mockPipeid = '1234';

    spyOn(apiService, 'pipelineGet').and.returnValue(of(mockPipeid));

    component.loadPipelineDetails(mockPipeid);

    expect(component.pipelines).toBe(mockPipeid);
  });

  it('should load the pipelinestatus of selected pipid on updatePipelineStatus call', () => {
    const mockPipeid = '12345';

    const mockPipelinesStatus = {
      status: 'running',
      count_in: 10,
      last_in: '2024-12-16T12:00:00Z',
      count_out: 50,
      last_out: '2024-12-16T13:00:00Z',
      error: null,
    };

    spyOn(apiService, 'pipelineStatusGet').and.returnValue(
      of(mockPipelinesStatus),
    );

    component.updatePipelineStatus();

    expect(component.pipelines.status).toBe('running');
    expect(component.pipelines.count_in).toBe(10);
    expect(component.pipelines.last_in).toBe('2024-12-16T12:00:00Z');
    expect(component.pipelines.count_out).toBe(50);
    expect(component.pipelines.last_out).toBe('2024-12-16T13:00:00Z');
  });
});
