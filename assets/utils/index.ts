import { format, formatDistanceToNow, Locale } from "date-fns";

export function capitalizeFirstChar(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatDate = (date: Date) => {
  return format(new Date(date), "PPP, pp");
};

/**
 * Formats a date into a human-readable relative time string.
 *
 * @param date - The date to format. Can be a Date object, timestamp, or string.
 * @param options - Optional config for locale and whether to add a suffix.
 * @returns A relative time string like "3 minutes ago" or "in 2 days".
 */
export function formatRelativeTime(
  date: Date | number | string,
  options?: {
    addSuffix?: boolean; // true = "ago"/"in", false = no suffix
    locale?: Locale; // e.g., import { enUS } from 'date-fns/locale'
  }
): string {
  try {
    const parsedDate = new Date(date);
    return formatDistanceToNow(parsedDate, {
      addSuffix: options?.addSuffix ?? true,
      locale: options?.locale,
    });
  } catch (error) {
    console.log("Error formatting relative time:", error);

    console.error("Invalid date passed to formatRelativeTime:", date);
    return "";
  }
}
