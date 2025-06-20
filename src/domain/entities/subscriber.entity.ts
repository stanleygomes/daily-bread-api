export interface Subscriber {
  uuid: string;
  email: string;
  enabled: boolean;
  created_at?: Date;
  updated_at?: Date;
}
