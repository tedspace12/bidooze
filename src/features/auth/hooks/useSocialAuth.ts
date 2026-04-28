/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
    __bidoozeFacebookInitialized?: boolean;
  }
}

const GOOGLE_SDK_URL = "https://accounts.google.com/gsi/client";
const FACEBOOK_SDK_URL = "https://connect.facebook.net/en_US/sdk.js";

let googleSdkPromise: Promise<void> | null = null;
let facebookSdkPromise: Promise<void> | null = null;

const loadScript = (src: string, id: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const existingScript = document.getElementById(id) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          existingScript.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

const ensureGoogleSdkReady = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is not available on the server."));
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (!googleSdkPromise) {
    googleSdkPromise = loadScript(GOOGLE_SDK_URL, "google-gis-sdk")
      .then(() => {
        if (!window.google?.accounts?.oauth2) {
          throw new Error("Google sign-in is not ready. Please try again.");
        }
      })
      .catch((error) => {
        googleSdkPromise = null;
        throw error;
      });
  }

  return googleSdkPromise;
};

const ensureFacebookSdkReady = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Facebook sign-in is not available on the server."));
  }

  if (window.FB && window.__bidoozeFacebookInitialized) {
    return Promise.resolve();
  }

  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();

  if (!appId) {
    return Promise.reject(new Error("Facebook app ID is not configured."));
  }

  if (!facebookSdkPromise) {
    facebookSdkPromise = new Promise<void>((resolve, reject) => {
      const finalizeInit = () => {
        if (!window.FB) {
          reject(new Error("Facebook sign-in is not ready. Please try again."));
          return;
        }

        if (!window.__bidoozeFacebookInitialized) {
          window.FB.init({
            appId,
            cookie: true,
            xfbml: false,
            version: "v19.0",
          });
          window.__bidoozeFacebookInitialized = true;
        }

        resolve();
      };

      const previousAsyncInit = window.fbAsyncInit;

      window.fbAsyncInit = () => {
        previousAsyncInit?.();
        finalizeInit();
      };

      loadScript(FACEBOOK_SDK_URL, "facebook-js-sdk")
        .then(() => {
          if (window.FB) {
            finalizeInit();
          }
        })
        .catch(reject);
    }).catch((error) => {
      facebookSdkPromise = null;
      throw error;
    });
  }

  return facebookSdkPromise;
};

export type SocialProvider = "google" | "facebook";

export const useSocialAuth = () => {
  useEffect(() => {
    void ensureGoogleSdkReady().catch(() => undefined);
    void ensureFacebookSdkReady().catch(() => undefined);
  }, []);

  const getGoogleToken = (): Promise<string> =>
    new Promise(async (resolve, reject) => {
      try {
        await ensureGoogleSdkReady();
      } catch (error) {
        reject(error);
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
        scope: "openid email profile",
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description ?? response.error));
          } else {
            resolve(response.access_token as string);
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message ?? "Google sign-in failed."));
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    });

  const getFacebookToken = (): Promise<string> =>
    new Promise(async (resolve, reject) => {
      try {
        await ensureFacebookSdkReady();
      } catch (error) {
        reject(error);
        return;
      }

      window.FB.login(
        (response: any) => {
          if (response.authResponse?.accessToken) {
            resolve(response.authResponse.accessToken as string);
          } else {
            reject(new Error("Facebook sign-in was cancelled or failed."));
          }
        },
        { scope: "public_profile,email" }
      );
    });

  return { getGoogleToken, getFacebookToken };
};
