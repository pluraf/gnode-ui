export interface ApiInfo {
  mode: string;
  version: string;
  serial_number: string;
  hostname: string;
  anonymous: boolean | null;
  time: any;
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
  api_authentication: boolean;
  gcloud: {
    https: number | null;
    ssh: number | null;
  };
}
