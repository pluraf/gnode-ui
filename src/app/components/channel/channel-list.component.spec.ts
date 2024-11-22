import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { MBrokerCService } from '../../services/mbrokerc.service';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let fixture: ComponentFixture<ChannelListComponent>;
  let brokerService: MBrokerCService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChannelListComponent],
      providers: [MBrokerCService, provideHttpClient()],
    }).compileComponents;

    fixture = TestBed.createComponent(ChannelListComponent);
    component = fixture.componentInstance;
    brokerService = TestBed.inject(MBrokerCService);
  });

  it('should create ChannelListComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should loadChannellist when response contains channels ', () => {
    const mockResponse = {
      responses: [
        {
          command: 'listChannels',
          data: {
            channels: ['channel1', 'channel2'],
            totalCount: 2,
          },
          verbose: false,
        },
      ],
    };
    spyOn(brokerService, 'loadChannelList').and.returnValue(of(mockResponse));
    component.loadChannels();
    expect(brokerService.loadChannelList).toHaveBeenCalled();
    expect(component.totalRecords).toBe(2);
    expect(component.channelList[0].id).toBe('channel1');
    expect(component.channelList[1].id).toBe('channel2');
  });

  it('should show showmessage equal to true when there are no channels', () => {
    const mockResponse = {
      responses: [
        {
          command: 'listChannels',
          data: {
            channels: [],
            totalCount: 0,
          },
          verbose: false,
        },
      ],
    };
    spyOn(brokerService, 'loadChannelList').and.returnValue(of(mockResponse));
    component.loadChannels();
    expect(component.totalRecords).toBe(0);
    expect(component.showMessage).toBe(true);
  });
  it('should mark channels as blocked when verbose is false', () => {
    const mockResponse = {
      responses: [
        {
          command: 'listChannels',
          data: { channels: ['channel1', 'channel2'], totalCount: 2 },
          verbose: true,
        },
      ],
    };

    spyOn(brokerService, 'loadChannelList').and.returnValue(of(mockResponse));

    component.loadChannels();

    expect(component.channelList[0].communication).toBe('Blocked');
    expect(component.channelList[1].communication).toBe('Blocked');
  });
  it('should show alert if no channels are selected in showDialog()', () => {
    spyOn(window, 'alert');

    component.selectedChannels = [];
    component.showDialog();

    expect(window.alert).toHaveBeenCalledWith('No channels selected');
    expect(component.visibleDialog).toBeFalsy();
  });

  it('should show dialog when channels are selected in showDialog()', () => {
    component.selectedChannels = [
      {
        id: 'channel1',
        communication: '',
      },
    ];
    component.showDialog();

    expect(component.visibleDialog).toBeTruthy();
  });
});
