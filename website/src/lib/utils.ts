export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

/**
 * Combines class names into a clean space-separated string.
 *
 * @param inputs - List of class values, objects, or arrays to combine.
 * @returns Merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

/**
 * Formats a byte size into a human-readable string (e.g. B, KB, MB, GB).
 *
 * @param bytes - Size in bytes.
 * @param decimals - Number of decimal places to include (default: 2).
 * @returns Formatted size string.
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes <= 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}

/**
 * Truncates a string to a specified length and appends an ellipsis if truncated.
 *
 * @param str - Input string to truncate.
 * @param length - Maximum length before truncation.
 * @returns Truncated string.
 */
export function truncateString(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Safely parses a JSON string, returning a fallback value if parsing fails.
 *
 * @template T - Expected return type.
 * @param jsonString - Raw JSON string to parse.
 * @param fallback - Default value if JSON unmarshaling fails.
 * @returns Parsed object or fallback value.
 */
export function safeJSONParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Extracts a human-readable error message from an unknown catch error.
 *
 * @param error - Caught error object or unknown value.
 * @returns Error message string.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred.";
}
