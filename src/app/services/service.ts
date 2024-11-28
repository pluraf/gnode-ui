export interface ApiInfo {
  mode: string;
  version: string;
  serial_number: string;
}

export interface Settings {
  allow_anonymous: boolean;
  time: {
    timestamp: number;
    iso8601: string;
    timezone: string;
  };
  network_settings: any;
  authentication: boolean;
  gcloud: boolean;
}
