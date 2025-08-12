import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function enumToSelectOptions<T extends Record<string, string>>(
  e: T
): { label: string; value: string }[] {
  return Object.values(e).map((value) => ({
    value,
    label: toLabel(value),
  }));
}

// Converts "every_fifteen_mins" -> "Every Fifteen Mins"
function toLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const isSyncedRecently = (
  lastSynced: string,
  syncFrequency: string
): boolean => {
  if (!lastSynced) return false;

  const now = new Date();
  const lastSyncDate = new Date(lastSynced);
  const timeDifferenceInMinutes =
    (now.getTime() - lastSyncDate.getTime()) / (1000 * 60);

  switch (syncFrequency) {
    case "daily":
      return timeDifferenceInMinutes < 24 * 60; // 24 hours in minutes
    case "every_hour":
      return timeDifferenceInMinutes < 60; // 60 minutes
    default:
      return false;
  }
};
