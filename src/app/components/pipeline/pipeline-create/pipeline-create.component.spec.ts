import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { NoteService } from '../../../services/note.service';
import { ApiService } from '../../../services/api.service';
import { PipelineCreateComponent } from './pipeline-create.component';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('PipelineCreateComponent', () => {
  let component: PipelineCreateComponent;
  let fixture: ComponentFixture<PipelineCreateComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiService;
  let messageService: MessageService;
  let noteService: NoteService;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', [
      'snapshot',
      'params',
      'queryParams',
    ]);
    // activatedRoute.snapshot = { paramMap: { get: () => 'mockPipeId' } };
    activatedRoute.params = of({ pipeid: '123' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        MessageService,
        NoteService,

        { provide: ActivatedRoute, useValue: activatedRoute },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineCreateComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
    messageService = TestBed.inject(MessageService);
    noteService = TestBed.inject(NoteService);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch pipeline config data on init', () => {
    const mockPipelineConfig = { key: 'value' };

    const req = httpMock.expectOne('/assets/pipelineConfig.json');
    req.flush(mockPipelineConfig);

    expect(component.pipelineConfig).toEqual(mockPipelineConfig);
  });

  it('should handle success message when pipeline is created', () => {
    const mockPipelineData = { id: 1, name: 'Test Pipeline' };
    spyOn(apiService, 'pipelineCreate').and.returnValue(of({}));
    spyOn(noteService, 'handleMessage');

    component.pipeid = '123';
    component.pipelineJson = JSON.stringify(mockPipelineData);

    component.onCreatePipeline();

    expect(apiService.pipelineCreate).toHaveBeenCalledWith(
      '123',
      mockPipelineData,
    );
    expect(noteService.handleMessage).toHaveBeenCalledWith(
      messageService,
      'success',
      'Pipeline edited successfully!',
    );
  });

  it('should handle error message when pipeline creation fails', () => {
    const mockError = { message: 'Some error occurred' };
    spyOn(apiService, 'pipelineCreate').and.returnValue(
      throwError(() => mockError),
    );
    spyOn(noteService, 'handleMessage');

    component.pipeid = '123';
    component.pipelineJson = '{"id": 1}';

    component.onCreatePipeline();

    expect(apiService.pipelineCreate).toHaveBeenCalled();
    expect(noteService.handleMessage).toHaveBeenCalledWith(
      messageService,
      'error',
      'Some error occurred',
    );
  });

  it('should generate pipeline JSON config', () => {
    const mockConfig = { key: 'value' };

    component.pipelineConfig = mockConfig;
    component.onGenerateConfig();

    expect(component.pipelineJson).toBe(JSON.stringify(mockConfig, null, 2));
  });
});
