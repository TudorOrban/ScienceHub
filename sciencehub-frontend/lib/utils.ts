import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Util for Shadcn UI component library
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
