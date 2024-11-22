/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelDetailComponent } from './channel-detail.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import {
  HttpClient,
  HttpHandler,
  provideHttpClient,
} from '@angular/common/http';

let component: ChannelDetailComponent;
let fixture: ComponentFixture<ChannelDetailComponent>;

const mockActivatedRoute = {
  snapshot: {
    params: { chanid: '123' },
  },
};

fdescribe('ChannelDetailComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChannelDetailComponent],
      providers: [
        provideRouter([]),
        MBrokerCService,
        HttpClient,
        provideHttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create ChannelDetailComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should set chanid from the route parameters', () => {
    expect(component.chanid).toBe('123');
  });

  it('should initialize menubarItems correctly', () => {
    const editItem = component.menubarItems[0];
    expect(editItem.routerLink).toEqual(['/channels/channel-edit', '123']);
    expect(editItem.tooltipOptions?.tooltipLabel).toBe('Edit channel');
    expect(editItem.iconClass).toBe('pi pi-pencil m-1');

    const deleteItem = component.menubarItems[1];
    expect(deleteItem.tooltipOptions?.tooltipLabel).toBe('Delete channel');
    expect(deleteItem.iconClass).toBe('pi pi-trash m-1');
    expect(deleteItem.command).toBeDefined();

    if (deleteItem.command) {
      const spy = spyOn(component, 'showDialog');
      deleteItem.command({} as any);
      expect(spy).toHaveBeenCalled();
    } else {
      fail('Delete item command is undefined');
    }
  });
});
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelDetailComponent } from './channel-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('ChannelDetailComponent', () => {
  let component: ChannelDetailComponent;
  let fixture: ComponentFixture<ChannelDetailComponent>;
  let mockActivatedRoute: any;
  let mockBrokerService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        params: { chanid: '123' },
      },
    };

    mockBrokerService = {
      loadChannelDetails: jasmine
        .createSpy('loadChannelDetails')
        .and.returnValue(
          of({
            responses: [
              {
                data: {
                  channel: {
                    disabled: false,
                    authtype: 'jwt',
                    username: 'testUser',
                    clientid: 'client123',
                    msg_received: 100,
                    msg_timestamp: '2024-01-01T00:00:00Z',
                    jwtkey: 'testjwtkey1234567890abcdefghijklmnopqrstuvwxyz',
                  },
                },
              },
            ],
          }),
        ),
      deleteChannels: jasmine
        .createSpy('deleteChannels')
        .and.returnValue(of({ success: true })),
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    TestBed.configureTestingModule({
      imports: [ChannelDetailComponent, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MBrokerCService, useValue: mockBrokerService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set chanid from route params', () => {
    expect(component.chanid).toBe('123');
  });

  it('should initialize menubarItems correctly', () => {
    const editItem = component.menubarItems[0];
    expect(editItem.routerLink).toEqual(['/channels/channel-edit', '123']);
    expect(editItem.tooltipOptions?.tooltipLabel).toBe('Edit channel');

    const deleteItem = component.menubarItems[1];
    expect(deleteItem.tooltipOptions?.tooltipLabel).toBe('Delete channel');
    expect(deleteItem.command).toBeDefined();
  });

  it('should call loadChannelDetails and set channel and details', () => {
    expect(mockBrokerService.loadChannelDetails).toHaveBeenCalledWith('123');
    expect(component.channel).toEqual({
      disabled: false,
      authtype: 'jwt',
      username: 'testUser',
      clientid: 'client123',
      msg_received: 100,
      msg_timestamp: '2024-01-01T00:00:00Z',
      jwtkey: 'testjwtkey1234567890abcdefghijklmnopqrstuvwxyz',
    });

    expect(component.details).toEqual([
      ['Enabled', true],
      ['Last seen', 'date'],
      ['Authentication type', 'jwt'],
      ['Username', 'testUser'],
      ['MQTT Client ID', 'client123'],
      ['Messages received', 100],
      ['Last message timestamp', '2024-01-01T00:00:00Z'],
      ['JWT key', 'testjwtkey1234567890abcdefghijklmnopqrstuvwxyz'],
    ]);
  });

  it('should set visibleDialog to true when showDialog is called', () => {
    component.showDialog();
    expect(component.visibleDialog).toBeTrue();
  });

  it('should call deleteChannels and navigate to /channels when onDeleteChannel is called', () => {
    component.onDeleteChannel();
    expect(mockBrokerService.deleteChannels).toHaveBeenCalledWith(['123']);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/channels');
    expect(component.visibleDialog).toBeFalse();
    expect(component.channel).toBeNull();
    expect(component.details).toEqual([]);
  });
});
