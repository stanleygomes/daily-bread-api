import { format as formatDate } from "date-fns";

export class DateFormat {
  static getCurrentDate(format = "yyyy-MM-dd"): string {
    const date = new Date();
    return formatDate(date, format);
  }
}
