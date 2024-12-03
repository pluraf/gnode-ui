import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelEditComponent } from './channel-edit.component';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { HttpBackend, HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

fdescribe('ChannelEditComponent', () => {
  let component: ChannelEditComponent;
  let fixture: ComponentFixture<ChannelEditComponent>;
  let brokerService: MBrokerCService;

  beforeEach(() => {
    const activatedRouteMock = {
      paramMap: of({
        get: (key: string) => {
          return key === 'chanid' ? 'channel123' : null;
        },
      }),
    };

    TestBed.configureTestingModule({
      imports: [ChannelEditComponent],
      providers: [
        HttpClient,
        HttpHandler,
        HttpBackend,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        MBrokerCService,
      ],
    }).compileComponents;

    fixture = TestBed.createComponent(ChannelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    brokerService = TestBed.inject(MBrokerCService);
  });

  it('should create ChannelEditComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should set chanid correctly from route params', () => {
    expect(component.chanid).toBe('channel123');
  });

  it('should load channel details when loadChannelDetails id called', () => {
    const mockResponse = {
      responses: [
        {
          data: {
            channel: {
              clientid: 'client123',
              username: 'testuser',
              authtype: 'jwt_es256',
              jwtkey:
                'longjwtkeystringlongjwtkeystringlongjwtkeystringlongjwtkeystring',
            },
          },
        },
      ],
    };
    spyOn(brokerService, 'loadChannelDetails').and.returnValue(
      of(mockResponse),
    );
    component.ngOnInit();
    component.chanid = 'channel123';

    expect(brokerService.loadChannelDetails).toHaveBeenCalledWith('channel123');
    expect(component.clientid).toBe('client123');
    expect(component.username).toBe('testuser');
    expect(component.password).toBe('');
    expect(component.selectedOption).toBe('jwt');
    expect(component.jwtKey).toBe(
      'longjwtkeystringlongjwtkeystringlongjwtkeystringlongjwtkeystring'.replace(
        /(.{64})/g,
        '$1\n',
      ),
    );
  });

  it('should load channel details with password when authtype is not jwt_es256 on loadChannelDetails called', () => {
    const mockResponse = {
      responses: [
        {
          data: {
            channel: {
              clientid: 'client123',
              username: 'testuser',
              authtype: 'password',
              jwtkey: '',
            },
          },
        },
      ],
    };
    spyOn(brokerService, 'loadChannelDetails').and.returnValue(
      of(mockResponse),
    );
    component.ngOnInit();
    component.chanid = 'channel123';

    expect(brokerService.loadChannelDetails).toHaveBeenCalledWith('channel123');
    expect(component.clientid).toBe('client123');
    expect(component.username).toBe('testuser');
    expect(component.selectedOption).toBe('password');
    expect(component.jwtKey).toBe('');
  });

  it('should set selectedChannelState to Enabled when channel is not disabled', () => {
    component.enabled = true;
    component.ngOnInit();

    expect(component.selectedChannelState.key).toBe('Allow');
  });

  it('should set selectedChannelState to Disabled when channel is disabled', () => {
    const mockChannel = {
      clientid: 'client123',
      username: 'user123',
      authtype: 'password',
      disabled: true,
      jwtkey: '',
    };

    spyOn(brokerService, 'loadChannelDetails').and.returnValue(
      of({
        responses: [{ data: { channel: mockChannel } }],
      }),
    );

    component.ngOnInit();

    expect(component.selectedChannelState).toEqual({
      name: 'Disabled',
      key: 'Block',
    });
  });

  it('should update the channel state when onUpdate is called for Enabled', () => {
    component.selectedChannelState = { key: 'Allow', name: 'Enabled' };
    component.selectedOption = 'password';
    component.password = 'newPassword';

    spyOn(brokerService, 'updateChannel').and.returnValue(
      of({ responses: [{ success: true }] }),
    );

    component.onUpdate();

    expect(brokerService.updateChannel).toHaveBeenCalled();

    const updateData = {
      chanid: component.chanid,
      communicationStatus: 'Enabled',
      authtype: 'password',
      password: 'newPassword',
    };

    expect(brokerService.updateChannel).toHaveBeenCalledWith(updateData);
  });

  it('should update the channel state when onUpdate is called for Disabled', () => {
    component.selectedChannelState = { key: 'Block', name: 'Disabled' };
    component.selectedOption = 'jwt';
    component.jwtKey = 'some-jwt-key';

    spyOn(brokerService, 'updateChannel').and.returnValue(
      of({ responses: [{ success: true }] }),
    );

    component.onUpdate();

    expect(brokerService.updateChannel).toHaveBeenCalled();

    const updateData = {
      chanid: component.chanid,
      communicationStatus: 'Disabled',
      authtype: 'jwt',
      jwtkey: 'some-jwt-key',
    };

    expect(brokerService.updateChannel).toHaveBeenCalledWith(updateData);
  });
});
