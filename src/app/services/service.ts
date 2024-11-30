export interface ApiInfo {
  mode: string;
  version: string;
  serial_number: string;
  anonymous: boolean | null;
}

export interface Settings {
  allow_anonymous: boolean;
  time: {
    timestamp: number;
    iso8601: string;
    timezone: string;
    auto: boolean;
  };
  network_settings: any;
  authentication: boolean;
  gcloud: boolean;
}
