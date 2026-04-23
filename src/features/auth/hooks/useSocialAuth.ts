/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

// Ambient globals — avoids installing large type packages for SDK stubs
declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const loadScript = (src: string, id: string): Promise<void> =>
  new Promise((resolve) => {
    if (typeof document === "undefined" || document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

export type SocialProvider = "google" | "facebook";

/**
 * Loads the Google GIS and Facebook JS SDKs on mount.
 * Exposes getGoogleToken() and getFacebookToken() which open the provider
 * consent popup and resolve with an OAuth2 access_token.
 */
export const useSocialAuth = () => {
  useEffect(() => {
    // Google Identity Services — provides access_token (not id_token)
    loadScript("https://accounts.google.com/gsi/client", "google-gis-sdk");

    // Facebook JS SDK
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "",
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
    };
    loadScript("https://connect.facebook.net/en_US/sdk.js", "facebook-js-sdk");
  }, []);

  const getGoogleToken = (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error("Google sign-in is not ready. Please try again."));
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
    new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error("Facebook sign-in is not ready. Please try again."));
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
