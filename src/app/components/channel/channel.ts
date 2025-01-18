export interface Channel {
  id: string;
  communication: string;
  lastseen?: string;
  isLoading?: boolean;
}

export interface PageEvent {
  first: number;
  rows: number;
}

export interface ChannelData {
  authtype: string;
  chanid: string;
  disabled: boolean;
  msg_received: number;
  msg_timestamp: number;
  roles: string[];
  username: string;
  clientid?: string;
  secret?: string;
}

export interface CommandResponse {
  command: string;
  data: {
    channel: ChannelData;
  };
}

export interface Responses {
  responses: CommandResponse[];
}

export interface Details {
  key: string;
  value: string | boolean;
}
