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
}

export enum AuthTypeLabel {
  JWT_ES256 = 'JWT_ES256',
  PASSWORD = 'Username & Password',
  SERVICE_KEY = 'Service Key',
}

export enum ConnectorType {
  GCP_PUBSUB = 'gcp_pubsub',
  MQTT311 = 'mqtt311',
  MQTT50 = 'mqtt50',
}

export enum ConnectorTypeLabel {
  GCP_PUBSUB = 'Google Pubsub',
  MQTT311 = 'MQTT v3.11',
  MQTT50 = 'MQTT v5.0',
}
