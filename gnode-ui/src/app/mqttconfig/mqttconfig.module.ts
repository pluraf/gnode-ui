import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'iotplan.io',
  port: 9001,
  protocol: 'ws',
  path: '',
};

@NgModule({
  declarations: [],
  imports: [ CommonModule, MqttModule.forRoot(MQTT_SERVICE_OPTIONS), MqttModule  ]
 })
export class MqttconfigModule { }
