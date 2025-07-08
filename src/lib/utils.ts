import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisplayImageUrl(url?: string): string | undefined {
  if (url && (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/'))) {
    try {
      const urlObject = new URL(url);
      let { pathname } = urlObject;
      // Ensure the pathname ends with a slash
      if (!pathname.endsWith('/')) {
        pathname += '/';
      }
      // Rebuild the URL to point to the media endpoint, stripping any query params
      return `https://www.instagram.com${pathname}media/?size=l`;
    } catch (e) {
      // If parsing fails, just return the original URL
      return url;
    }
  }
  return url;
}
