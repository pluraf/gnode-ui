import { TestBed } from '@angular/core/testing';

import { MqttBrokerServiceService } from './mqtt-broker-service.service';

describe('MqttBrokerServiceService', () => {
  let service: MqttBrokerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttBrokerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
