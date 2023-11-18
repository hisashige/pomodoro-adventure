import { format, utcToZonedTime } from "date-fns-tz";

const timezone = "Asia/Tokyo";

export const now = () =>
  format(utcToZonedTime(new Date(), timezone), "yyyy/MM/dd HH:mm");
