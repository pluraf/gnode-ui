export interface Channel {
  id: string;
  type: string;
  state: string;
  lastseen?: string;
  isLoading?: boolean;
}

export interface ChannelData {
  chanid: string;
  type: string;
  authtype: string;
  enabled: boolean;
  msg_received: number;
  msg_timestamp: number;
  roles: string[];
  username: string;
  clientid: string;
  secret: string;
  queue_name: string;
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


export class ChannelComponent {
  communication: string = 'Allow';
  chanid: string = '';
  clientid: string = '';
  username: string = '';
  authtype: string = '';
  secret: string = '';
  queue_name: string = '';
  enabled = true;

  selectedAuthOption: string = '';
  selectedTypeOption: string = ''

  authOptions = [{value: '', label: ''}];

  channelTypes = [
    {value: 'mqtt', label: 'MQTT'},
    {value: 'http', label: 'HTTP'}
  ];

  getPasswordLabel() {
    if (this.selectedTypeOption == 'mqtt') {
      return "Password";
    } else {
      return "Token";
    }
  }

  onChangeChannelType(type: string) {
    if (type == 'mqtt') {
      this.authOptions = [
        { value: 'jwt_es256', label: 'JWT_ES256' },
        { value: 'password', label: 'Username & Password' },
        { value: 'none', label: 'None'}
      ];
      this.selectedAuthOption = this.authOptions[0].value;
    } else if (type == 'http') {
      this.authOptions = [
        { value: 'token', label: 'Token'},
        { value: 'none', label: 'None'}
      ];
      this.selectedAuthOption = this.authOptions[0].value;
    }
    this.secret = '';
  }

  onChangeAuthenticationType(authType: string) {
    this.secret = '';
  }

  onGenerateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';

    for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    this.secret = result;
  }

  getSubmitPayload() {
    let payload: Partial<ChannelData> = {
      type: this.selectedTypeOption,
      authtype: this.selectedAuthOption,
    }
    if (this.secret.length > 0) {
      payload.secret = this.secret;
    }
    if (this.selectedTypeOption == 'mqtt') {
      payload.clientid = this.clientid;
      payload.enabled = this.enabled;
      payload.username = this.username;
    } else if (this.selectedTypeOption == 'http') {
      payload.enabled = this.enabled;
      payload.queue_name = this.queue_name;
    }
    return payload;
  }
}
