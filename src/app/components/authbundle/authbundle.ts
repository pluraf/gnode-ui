import { ElementRef } from '@angular/core';

export interface Authbundle {
  authbundle_id: string;
  connector_type: string;
  description?: string;
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

export enum AuthType {
  JWT_ES256 = 'jwt_es256',
  PASSWORD = 'password',
  SERVICE_KEY = 'service_key',
  ACCESS_KEY = 'access_key',
  WEBHOOK = 'webhook',
}

export enum AuthTypeLabel {
  JWT_ES256 = 'JWT_ES256',
  PASSWORD = 'Username & Password',
  SERVICE_KEY = 'Service Key',
  ACCESS_KEY = 'Access Key',
  WEBHOOK = 'Webhook URL',
}

export enum ConnectorType {
  GCP = 'gcp',
  MQTT311 = 'mqtt311',
  MQTT50 = 'mqtt50',
  AWS = 'aws',
  SLACK = 'slack',
}

export enum ConnectorTypeLabel {
  GCP = 'Google Cloud',
  MQTT311 = 'MQTT v3.11',
  MQTT50 = 'MQTT v5.0',
  AWS = 'Amazon Web Services',
  SLACK = 'Slack',
}


export class AuthbundleComponent {
  authbundleId = '';
  username = '';
  password = '';
  description = '';
  autoId = true;
  usermessage: string = '';

  authOptions: { [key: string]: string } = {};
  ConnectorTypes: { [key: string]: string } = {};

  selServiceType: any;
  selAuthOption: string = '';
  keyFile: File | null = null;

  constructor(){
    this.ConnectorTypes[ConnectorType.GCP] = ConnectorTypeLabel.GCP;
    this.ConnectorTypes[ConnectorType.AWS] = ConnectorTypeLabel.AWS;
    this.ConnectorTypes[ConnectorType.MQTT50] = ConnectorTypeLabel.MQTT50;
    this.ConnectorTypes[ConnectorType.MQTT311] = ConnectorTypeLabel.MQTT311;
    this.ConnectorTypes[ConnectorType.SLACK] = ConnectorTypeLabel.SLACK;

    this.authOptions[AuthType.SERVICE_KEY] = AuthTypeLabel.SERVICE_KEY;
  }

  showUploadKey(): boolean {
    return (
      this.selServiceType == ConnectorType.GCP ||
      this.selAuthOption == AuthType.JWT_ES256
    );
  }

  showUsername(): boolean {
    return (
      this.selServiceType == ConnectorType.MQTT50 ||
      this.selServiceType == ConnectorType.MQTT311 ||
      this.selServiceType == ConnectorType.AWS
    );
  }

  showPassword(): boolean {
    return (
      this.selAuthOption === AuthType.PASSWORD ||
      this.selAuthOption == AuthType.ACCESS_KEY ||
      this.selAuthOption == AuthType.WEBHOOK
    );
  }

  getUsernameMQTTMessage(): string {
    if (this.selServiceType === ConnectorType.MQTT50) {
      this.usermessage = 'Username can be empty for MQTT v5.0';
    } else if (this.selServiceType === ConnectorType.MQTT311) {
      this.usermessage = 'Username can be empty for MQTT v3.11';
    } else {
      this.usermessage = '';
    }
    return this.usermessage;
  }

  getUsernameLabel(): string {
    if (this.selServiceType == ConnectorType.AWS) {
      return 'Access key';
    }
    return 'Username';
  }

  getPasswordLabel(): string {
    if (this.selServiceType == ConnectorType.AWS) {
      return 'Secret access key';
    } else if (this.selServiceType == ConnectorType.SLACK) {
      return 'Webhook URL';
    }
    return 'Password';
  }

  cleanIrrelevantInputs(keyFileInput: ElementRef) {
    if (this.selAuthOption == AuthType.PASSWORD) {
      this.keyFile = null;
      if (keyFileInput) {
        keyFileInput.nativeElement.value = '';
      }
    } else if (
      this.selAuthOption == AuthType.JWT_ES256 ||
      this.selAuthOption == AuthType.SERVICE_KEY ||
      this.selAuthOption == AuthType.ACCESS_KEY
    ) {
      this.password = '';
    } else {
      this.keyFile = null;
      if (keyFileInput) {
        keyFileInput.nativeElement.value = '';
      }
      this.username = '';
      this.password = '';
    }

    if (this.selServiceType == ConnectorType.GCP) {
      this.username = '';
      this.password = '';
    }
  }

  onChangeAuthOption(event: any, keyFileInput: ElementRef) {
    this.cleanIrrelevantInputs(keyFileInput);
  }

  onChangeConnectorType(event: any, keyFileInput: ElementRef) {
    this.authOptions = {};
    if (event === ConnectorType.GCP) {
      this.authOptions[AuthType.SERVICE_KEY] = AuthTypeLabel.SERVICE_KEY;
      this.selAuthOption = AuthType.SERVICE_KEY;
    } else if (event === ConnectorType.AWS) {
      this.authOptions[AuthType.ACCESS_KEY] = AuthTypeLabel.ACCESS_KEY;
      this.selAuthOption = AuthType.ACCESS_KEY;
    } else if (
      event === ConnectorType.MQTT311 ||
      event == ConnectorType.MQTT50
    ) {
      this.authOptions[AuthType.JWT_ES256] = AuthTypeLabel.JWT_ES256;
      this.authOptions[AuthType.PASSWORD] = AuthTypeLabel.PASSWORD;
      this.selAuthOption = AuthType.JWT_ES256;
    } else if (event == ConnectorType.SLACK) {
      this.authOptions[AuthType.WEBHOOK] = AuthTypeLabel.WEBHOOK;
      this.selAuthOption = AuthType.WEBHOOK;
    }
    this.cleanIrrelevantInputs(keyFileInput);
  }
}