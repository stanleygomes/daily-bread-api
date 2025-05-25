import { format as formatDate } from "date-fns";

export function getCurrentDate(format = "yyyy-MM-dd") {
  const date = new Date();
  return formatDate(date, format);
}
