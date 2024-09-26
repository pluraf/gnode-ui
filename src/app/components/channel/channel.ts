export interface Channel {
  id: string;
  communication: string;
  lastseen?: string;
}

export interface PageEvent {
  first: number;
  rows: number;
}
