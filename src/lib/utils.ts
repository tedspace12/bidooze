import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getToken = async (): Promise<string | undefined> => {
  const maxAttempts = 10;
  const delay = 500; // milliseconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const token = Cookies.get("bidooze_token");

    if (token) {
      return token;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return undefined;
};

