import { ElementRef } from '@angular/core';

export interface Authbundle {
  authbundle_id: string;
  connector_type: string;
  description?: string;
}

export enum AuthType {
  JWT_ES256 = 'jwt_es256',
  PASSWORD = 'password',
  SERVICE_KEY = 'service_key',
  ACCESS_KEY = 'access_key',
  WEBHOOK = 'webhook',
  ROOT_CA = 'root_ca',
}

export enum AuthTypeLabel {
  JWT_ES256 = 'JWT_ES256',
  PASSWORD = 'Username & Password',
  SERVICE_KEY = 'Service Key',
  ACCESS_KEY = 'Access Key',
  WEBHOOK = 'Webhook URL',
  ROOT_CA = 'Root CA',
}

export enum ConnectorType {
  GCP = 'gcp',
  MQTT311 = 'mqtt311',
  MQTT50 = 'mqtt50',
  AWS = 'aws',
  SLACK = 'slack',
  AZURE = 'azure',
  HTTP = 'http',
  EMAIL = 'email'
}

export enum ConnectorTypeLabel {
  GCP = 'Google Cloud',
  MQTT311 = 'MQTT v3.11',
  MQTT50 = 'MQTT v5.0',
  AWS = 'Amazon Web Services',
  SLACK = 'Slack',
  AZURE = 'Azure',
  HTTP = 'HTTP',
  EMAIL = 'Email',
}


export class AuthbundleComponent {
  authbundleId = '';
  username = '';
  password = '';
  description = '';
  autoId = true;
  usermessage: string = '';

  authOptions: { [key: string]: string } = {};
  connectorTypes: { [key: string]: string } = {};

  selServiceType: any;
  selAuthOption: string = '';
  keyFile: File | null = null;
  caFile: File | null = null;

  constructor(){
    this.connectorTypes[ConnectorType.GCP] = ConnectorTypeLabel.GCP;
    this.connectorTypes[ConnectorType.AWS] = ConnectorTypeLabel.AWS;
    this.connectorTypes[ConnectorType.AZURE] = ConnectorTypeLabel.AZURE;
    this.connectorTypes[ConnectorType.HTTP] = ConnectorTypeLabel.HTTP;
    this.connectorTypes[ConnectorType.MQTT50] = ConnectorTypeLabel.MQTT50;
    this.connectorTypes[ConnectorType.MQTT311] = ConnectorTypeLabel.MQTT311;
    this.connectorTypes[ConnectorType.SLACK] = ConnectorTypeLabel.SLACK;
    this.connectorTypes[ConnectorType.EMAIL] = ConnectorTypeLabel.EMAIL;


    this.authOptions[AuthType.SERVICE_KEY] = AuthTypeLabel.SERVICE_KEY;
  }

  showCARoot(): boolean {
    return this.selAuthOption === AuthType.ROOT_CA;
  }

  showUploadKey(): boolean {
    return (
      this.selServiceType == ConnectorType.GCP ||
      this.selAuthOption == AuthType.JWT_ES256
    );
  }

  showUsername(): boolean {
    return (
      (this.selServiceType == ConnectorType.MQTT50 ||
      this.selServiceType == ConnectorType.MQTT311 ||
      this.selServiceType == ConnectorType.AWS) &&
      this.selAuthOption !== AuthType.ROOT_CA
    );
  }

  showPassword(): boolean {
    return (
      this.selAuthOption === AuthType.PASSWORD ||
      this.selAuthOption === AuthType.ACCESS_KEY ||
      this.selAuthOption === AuthType.WEBHOOK
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

  cleanIrrelevantInputs(keyFileInput: ElementRef, caFileInput: ElementRef) {
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

    if (this.selAuthOption !== AuthType.ROOT_CA) {
      this.caFile = null;
      if (caFileInput) {
        caFileInput.nativeElement.value = '';
      }
      if (this.autoId) {
        this.authbundleId = '';
      }
    }
  }

  onChangeAuthOption(event: any, keyFileInput: ElementRef, caFileInput: ElementRef) {
    this.cleanIrrelevantInputs(keyFileInput, caFileInput);
  }

  onChangeConnectorType(event: any, keyFileInput: ElementRef, caFileInput: ElementRef) {
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
      // this.authOptions[AuthType.ROOT_CA] = AuthTypeLabel.ROOT_CA;
      this.selAuthOption = AuthType.JWT_ES256;
    } else if (event == ConnectorType.SLACK) {
      this.authOptions[AuthType.WEBHOOK] = AuthTypeLabel.WEBHOOK;
      this.selAuthOption = AuthType.WEBHOOK;
    }
    this.cleanIrrelevantInputs(keyFileInput, caFileInput);
  }

  onFileSelected(event: any) {
    if (event.target.name === 'caFile') {
      this.caFile = event.target.files[0];
      if (this.autoId) {
        this.authbundleId = this.caFile?.name ?? this.authbundleId;
      }
    } else if (event.target.name === 'keyFile') {
      this.keyFile = event.target.files[0];
    }
  }

}