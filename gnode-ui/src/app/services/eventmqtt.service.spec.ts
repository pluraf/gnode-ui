import { TestBed } from '@angular/core/testing';

import { EventmqttService } from './eventmqtt.service';

describe('EventmqttService', () => {
  let service: EventmqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventmqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
