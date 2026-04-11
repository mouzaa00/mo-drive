import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function firstOrUndefined<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[0];
}
