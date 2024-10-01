export interface Authbundle {
  authbundle_id: string;
  connector_type: string;
  description?: string;
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
