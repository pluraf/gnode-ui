export interface Device {
  id: string;
  type: string;
  enabled: string;
  description: string;
}

export interface DeviceData {
  devid: string;
  type: string;
  enabled: boolean;
  description: string;
}

export interface CommandResponse {
  command: string;
  data: {
    device: DeviceData;
  };
}

export interface Responses {
  responses: CommandResponse[];
}

export interface Details {
  key: string;
  value: string | boolean;
}

export enum SubmitType {
  EDIT,
  CREATE
}


export class DeviceComponent {
  devid: string = '';
  enabled = true;
  description = '';

  selectedAuthOption: string = '';
  selectedTypeOption: string = ''

  deviceTypes = [
    {value: 'cnode', label: 'C-NODE'}
  ];


  onChangeDeviceType(type: string) {
  }


  getSubmitPayload(action: SubmitType) {
    let payload: Partial<DeviceData> = {
      type: this.selectedTypeOption,
      enabled: this.enabled,
      description: this.description
    }

    return payload;
  }
}
