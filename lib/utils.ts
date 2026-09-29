import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Lowercase a category name for mid-sentence use, keeping acronyms such as HVAC intact. */
export function lowerCategory(name: string): string {
  return name.split(' ').map((word) => (/^[A-Z]{2,}$/.test(word.replace(/[^A-Za-z]/g, '')) && word === word.toUpperCase() ? word : word.toLowerCase())).join(' ');
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
