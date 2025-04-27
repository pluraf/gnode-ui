
export interface Apitoken {
  id: string;
  created: Date;
  till: Date;
  duration: Number;
  state: Number;
  token: String;
  description: string;
}


export class ApitokenComponent {
  apitoken!: Apitoken;

  constructor() {
    this.apitoken = {
      id: '',
      created: new Date(),
      till: new Date(),
      duration: 0,
      state: 1,
      token: '',
      description: ''
    };
  }

}