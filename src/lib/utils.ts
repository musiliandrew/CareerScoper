import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes safely.
 * Combines `clsx` (conditional classes) + `twMerge` (removes duplicates/conflicts).
 *
 * @param {...any} inputs – class strings, arrays, objects, etc.
 * @returns {string} – merged Tailwind class string
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}