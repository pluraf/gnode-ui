import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MqttChannelsComponent } from './mqtt-channels.component';
import { ApiService } from '../../../services/api.service';

describe('MqttChannelsComponent', () => {
  let component: MqttChannelsComponent;
  let fixture: ComponentFixture<MqttChannelsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttChannelsComponent, HttpClientModule],
      providers: [ApiService, provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MqttChannelsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
