import { format } from "date-fns";

export function capitalizeFirstChar(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatDate = (date: Date) => {
  return format(new Date(date), "PPP, pp");
};
