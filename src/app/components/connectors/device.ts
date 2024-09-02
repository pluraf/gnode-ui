export interface Device {
  id?: number;
  clients: string;
  communication: string;
  lastseen?: string;
}

export interface Sidemenu {
  name: string;
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
