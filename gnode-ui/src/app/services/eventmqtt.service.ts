import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventmqttService {

  private endpoint: string;

  constructor(
    private _mqttService: MqttService,
  ) {
    this.endpoint = 'events';
  }

  topic(deviceId: string): Observable<IMqttMessage> {
    let topicName = `/${this.endpoint}/${deviceId}`;     
    return this._mqttService.observe(topicName);
  }
}
