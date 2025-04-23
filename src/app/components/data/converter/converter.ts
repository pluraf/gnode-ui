

export interface Converter {
  converterId: string;
  description?: string;
}


export class ConverterComponent {
  converterId = '';
  autoId = false;
  converterCode = '';
  description = '';

  constructor() { }

}