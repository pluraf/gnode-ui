import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PipelineListComponent } from './pipeline-list.component';
import { MessageService } from 'primeng/api';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';

describe('PipelineListComponent', () => {
  let component: PipelineListComponent;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let noteServiceSpy: jasmine.SpyObj<NoteService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'pipelineList',
      'pipelineStatusList',
      'pipelineDelete',
    ]);
    apiSpy.pipelineList.and.returnValue(of({}));
    apiSpy.pipelineStatusList.and.returnValue(of({}));

    const noteSpy = jasmine.createSpyObj('NoteService', ['handleMessage']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        PipelineListComponent,
        { provide: ApiService, useValue: apiSpy },
        { provide: NoteService, useValue: noteSpy },
        { provide: MessageService, useValue: messageSpy },
      ],
    });

    component = TestBed.inject(PipelineListComponent);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    noteServiceSpy = TestBed.inject(NoteService) as jasmine.SpyObj<NoteService>;
    messageServiceSpy = TestBed.inject(
      MessageService,
    ) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call loadpipelines() when ngOnInit is called', () => {
    spyOn(component, 'loadPipelines');
    component.ngOnInit();
    expect(component.loadPipelines).toHaveBeenCalled();
  });

  it('should load pipelines and set showMessage to true if no pipelines', () => {
    apiServiceSpy.pipelineList.and.returnValue(of({}));

    component.loadPipelines();

    expect(apiServiceSpy.pipelineList).toHaveBeenCalled();
    expect(component.showMessage).toBeTrue();
  });

  it('should load pipelines and map pipeline data correctly', () => {
    const mockPipelineConfig = {
      pipeline1: {
        connector_in: { type: 'type1' },
        connector_out: { type: 'type2' },
      },
    };
    const mockPipelineStatus = {
      pipeline1: { status: 'active' },
    };

    apiServiceSpy.pipelineList.and.returnValue(of(mockPipelineConfig));
    apiServiceSpy.pipelineStatusList.and.returnValue(of(mockPipelineStatus));

    component.loadPipelines();

    expect(apiServiceSpy.pipelineList).toHaveBeenCalled();
    expect(apiServiceSpy.pipelineStatusList).toHaveBeenCalled();
    expect(component.pipelines).toEqual([
      {
        id: 'pipeline1',
        connector_in: 'type1',
        connector_out: 'type2',
        status: 'active',
        error: '',
      },
    ]);
  });

  it('should show a warning message if no pipelines are selected for deletion', () => {
    component.selectedPipelines = [];
    component.showDialog();
    expect(noteServiceSpy.handleMessage).toHaveBeenCalledWith(
      messageServiceSpy,
      'warn',
      'No pipelines selected.',
    );

    expect(component.visibleDialog).toBeFalse();
  });

  it('should call showDialog when delete pipeline command is executed', () => {
    spyOn(component, 'showDialog');

    const deleteMenuItem: MenuItem = component.menubarActions[1];
    const mockEvent: MenuItemCommandEvent = { originalEvent: {} as MouseEvent };

    if (deleteMenuItem.command) {
      deleteMenuItem.command(mockEvent);
    }

    expect(component.showDialog).toHaveBeenCalled();
  });

  it('should set visibleDialog to true  if pipelines are selected for deletion', () => {
    component.selectedPipelines = [
      {
        id: 'pipeline1',
        connector_in: 'type1',
        connector_out: 'type2',
        status: 'active',
        error: '',
      },
    ];
    component.showDialog();
    expect(component.visibleDialog).toBeTrue();
  });

  it('should delete selected pipelines', () => {
    component.selectedPipelines = [
      {
        id: 'pipeline1',
        connector_in: 'type1',
        connector_out: 'type2',
        status: 'active',
        error: '',
      },
    ];
    apiServiceSpy.pipelineDelete.and.returnValue(of({}));

    component.onDeletePipelines();

    expect(apiServiceSpy.pipelineDelete).toHaveBeenCalledWith('pipeline1');
    expect(component.visibleDialog).toBeFalse();
    expect(component.selectedPipelines).toEqual([]);
  });

  it('should handle errors during pipeline deletion gracefully', () => {
    component.selectedPipelines = [
      {
        id: 'pipeline1',
        connector_in: 'type1',
        connector_out: 'type2',
        status: 'active',
        error: '',
      },
    ];
    apiServiceSpy.pipelineDelete.and.returnValue(
      throwError(() => new Error('Error')),
    );

    component.onDeletePipelines();

    expect(apiServiceSpy.pipelineDelete).toHaveBeenCalledWith('pipeline1');
    expect(component.visibleDialog).toBeFalse();
    expect(component.selectedPipelines).toEqual([]);
  });
});
