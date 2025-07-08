import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisplayImageUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  // Handle Instagram URLs
  if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
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

  // Handle Google Drive URLs
  if (url.includes('drive.google.com/file/d/')) {
    try {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/');
        // The file ID is usually after '/d/'
        const fileIdIndex = pathParts.findIndex(part => part === 'd') + 1;
        if (fileIdIndex > 0 && fileIdIndex < pathParts.length) {
            const fileId = pathParts[fileIdIndex];
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
    } catch (e) {
        // If parsing fails, just return the original URL
        return url;
    }
  }
  
  return url;
}
