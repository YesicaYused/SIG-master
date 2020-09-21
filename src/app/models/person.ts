export interface person {
  id?: number;
  name: string;
  last_name: string;
  state: string;
  code: string;
  observatory_id?: number;
  password: string;
  getToken?: boolean;
  created_at?: string;
  updated_at?: string;
}
