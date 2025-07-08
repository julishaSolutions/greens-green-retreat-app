import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisplayImageUrl(url?: string): string | undefined {
  if (url && url.includes('instagram.com/p/')) {
    const urlWithSlash = url.endsWith('/') ? url : `${url}/`;
    return `${urlWithSlash}media/?size=l`;
  }
  return url;
}
