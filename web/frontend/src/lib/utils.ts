import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge to avoid Tailwind class conflicts.
 *
 * @param inputs - Class names, conditional objects, or arrays.
 * @returns Merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

