
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getFirstValidString(url?: string | string[]): string | undefined {
    if (typeof url === 'string' && url.trim() !== '') {
        return url.trim();
    }
    if (Array.isArray(url)) {
        return url.find(u => typeof u === 'string' && u.trim() !== '');
    }
    return undefined;
}


export function getDisplayImageUrl(url?: string | string[]): string | undefined {
  const validUrl = getFirstValidString(url);
  
  if (!validUrl) {
    return undefined;
  }

  // Handle Instagram URLs
  if (validUrl.includes('instagram.com/p/') || validUrl.includes('instagram.com/reel/')) {
    try {
      const urlObject = new URL(validUrl);
      let { pathname } = urlObject;
      if (!pathname.endsWith('/')) {
        pathname += '/';
      }
      return `https://www.instagram.com${pathname}media/?size=l`;
    } catch (e) {
      return validUrl;
    }
  }

  // Handle Google Drive URLs
  if (validUrl.includes('drive.google.com/file/d/')) {
    try {
        const urlObject = new URL(validUrl);
        const pathParts = urlObject.pathname.split('/');
        const fileIdIndex = pathParts.findIndex(part => part === 'd') + 1;
        if (fileIdIndex > 0 && fileIdIndex < pathParts.length) {
            const fileId = pathParts[fileIdIndex];
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
    } catch (e) {
        return validUrl;
    }
  }
  
  return validUrl;
}
