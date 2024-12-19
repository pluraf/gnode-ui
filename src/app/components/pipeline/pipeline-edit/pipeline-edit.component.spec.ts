import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PipelineEditComponent } from './pipeline-edit.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

describe('PipelineEditComponent', () => {
  let component: PipelineEditComponent;
  let fixture: ComponentFixture<PipelineEditComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let noteService: jasmine.SpyObj<NoteService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', [
      'pipelineGet',
      'pipelineEdit',
    ]);

    apiService.pipelineGet.and.returnValue(
      of({ pipelineName: 'Test Pipeline' }),
    );
    apiService.pipelineEdit.and.returnValue(of({}));

    noteService = jasmine.createSpyObj('NoteService', ['handleMessage']);
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    activatedRoute.snapshot.params = { pipeid: '123' };

    TestBed.configureTestingModule({
      imports: [CommonModule, PipelineEditComponent],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: MessageService, useValue: messageService },
        { provide: NoteService, useValue: noteService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelineEditComponent);
    component = fixture.componentInstance;
  });

  it('should create PipelineEditComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set pipeid from route params on initialization', () => {
    expect(component.pipeid).toBe('123');
  });

  it('should call apiService.pipelineGet on initialization', () => {
    fixture.detectChanges();

    expect(apiService.pipelineGet).toHaveBeenCalledWith('123');
    expect(component.pipelineJson).toBe(
      JSON.stringify({ pipelineName: 'Test Pipeline' }, null, 2),
    );
  });

  it('should update the pipeline successfully and show a success message', fakeAsync(() => {
    component.onUpdatePipeline();
    tick();
    expect(noteService.handleMessage).toHaveBeenCalledWith(
      messageService,
      'success',
      'Pipeline edited successfully!',
    );
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Pipeline edited successfully!',
    });
  }));

  it('should handle error when pipeline edit fails', fakeAsync(() => {
    const errorResponse = { error: 'Some error message\nDetails' };
    apiService.pipelineEdit.and.returnValue(throwError(() => errorResponse));

    component.onUpdatePipeline();
    tick();
    expect(noteService.handleMessage).toHaveBeenCalledWith(
      messageService,
      'error',
      'Details',
    );

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Details',
    });
  }));
});
