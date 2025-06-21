import { BreadType } from "../enums/bread-type.enum.js";

export interface Bread {
  _id?: string;
  uuid: string;
  title: string;
  type: BreadType;
  message: string;
  date: string;
  created_at: Date | string;
  image: string;
}
