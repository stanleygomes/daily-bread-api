export interface Bread {
  _id?: string;
  message: {
    title?: string;
    verse?: string;
    summary?: string;
    devotional?: string[];
    prayer?: string[];
    [key: string]: any;
  };
  date: string;
  created_at: Date | string;
  image?: string;
}
