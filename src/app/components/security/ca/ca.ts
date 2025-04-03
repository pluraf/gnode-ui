export interface CA {
  id: string;
  description?: string;
}

export class CAComponent {
  caId = '';
  description = '';
  caFile: File | null = null;

  types: { [key: string]: string } = {};

  constructor() {}

}
