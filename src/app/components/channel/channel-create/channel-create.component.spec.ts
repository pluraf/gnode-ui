import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelCreateComponent } from './channel-create.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { of, throwError } from 'rxjs';

fdescribe('ChannelCreateComponent', () => {
  let component: ChannelCreateComponent;
  let fixture: ComponentFixture<ChannelCreateComponent>;
  let mockBrokerService: jasmine.SpyObj<MBrokerCService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockBrokerService = jasmine.createSpyObj('MBrokerCService', [
      'createChannel',
    ]);
    mockMessageService = jasmine.createSpyObj('MessageService', [
      'add',
      'clear',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ChannelCreateComponent],
      providers: [
        { provide: MBrokerCService, useValue: mockBrokerService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with the first category selected', () => {
    expect(component.selectedCategory.name).toBe('Enabled');
  });

  it('should call createChannel with correct payload on form submit', () => {
    component.chanid = '123';
    component.selectedOption = 'jwt_es256';
    component.password = 'password123';
    component.selectedCategory = { name: 'Enabled', key: 'A' };

    mockBrokerService.createChannel.and.returnValue(
      of({ responses: [{ success: true }] }),
    );

    component.onSubmit();

    expect(mockBrokerService.createChannel).toHaveBeenCalledWith(
      jasmine.objectContaining({
        chanid: '123',
        authtype: 'jwt_es256',
        password: 'password123',
        disabled: false,
      }),
    );
  });

  it('should display success message on successful channel creation', () => {
    mockBrokerService.createChannel.and.returnValue(
      of({ responses: [{ success: true }] }),
    );
    component.onSubmit();

    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        detail: 'Channel created successfully',
      }),
    );
  });

  it('should display error message on failed channel creation', () => {
    mockBrokerService.createChannel.and.returnValue(
      throwError({ error: { detail: 'Error' } }),
    );
    component.onSubmit();

    expect(mockMessageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'error',
        detail: 'Error',
        sticky: true,
      }),
    );
  });

  it('should navigate to /channels after clearing messages', () => {
    component.clear();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/channels');
  });
});
