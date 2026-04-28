'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUser } from "@/features/auth/context/UserContext";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const getErrorMessage = (error: unknown): string => {
  const err = error as
    | {
        message?: string;
        response?: { data?: { message?: string } };
        errors?: Record<string, string[] | string>;
      }
    | undefined;

  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message) return err.message;

  if (err?.errors) {
    const firstError = Object.values(err.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) return firstError[0];
    if (typeof firstError === "string") return firstError;
  }

  return "Google sign-in failed. Please try again.";
};

const getFriendlyOneTapMessage = (message: string): string => {
  if (message.toLowerCase().includes("already registered for a different account")) {
    return "This email already exists with a different sign-in method. Sign in with the original method for that account, or reset your password if you created it with email and password.";
  }

  return message;
};

const GoogleOneTap = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { socialAuth } = useAuth();
  const { user, setUser } = useUser();
  const [statusText, setStatusText] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false);
  const loadingToastIdRef = useRef<string | number | null>(null);

  const showLoadingState = (message: string) => {
    setStatusText(message);
    if (loadingToastIdRef.current !== null) {
      toast.dismiss(loadingToastIdRef.current);
    }
    loadingToastIdRef.current = toast.loading(message);
  };

  const clearLoadingState = () => {
    setStatusText(null);
    if (loadingToastIdRef.current !== null) {
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = null;
    }
  };

  useEffect(() => {
    // Skip on in-progress auth steps — One Tap would interrupt the flow
    const AUTH_FLOW_PATHS = [
      "/auth/verify-otp",
      "/auth/create-password",
      "/auth/personal-information",
      "/auth/profile-setup",
      "/auth/reset-password",
    ];
    if (AUTH_FLOW_PATHS.some((p) => pathname.startsWith(p))) return;
    // Skip if already logged in
    if (user) return;
    // Skip if no client ID configured
    if (!CLIENT_ID) return;

    const initOneTap = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accounts = (window as any).google?.accounts?.id;
      if (!accounts) return false;

      accounts.initialize({
        client_id: CLIENT_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: async (response: any) => {
          if (!response.credential || isAuthenticatingRef.current) return;

          isAuthenticatingRef.current = true;
          showLoadingState("Signing you in with Google...");

          try {
            const data = await socialAuth.mutateAsync({
              provider: "google",
              token: response.credential,
            });

            if (data?.status === "registration_required") {
              clearLoadingState();
              toast("Complete your account setup", {
                description: "We found your Google account. Finish a few details to continue.",
              });
              const params = new URLSearchParams();
              if (data.prefilled?.email) params.set("email", data.prefilled.email);
              if (data.prefilled?.name) params.set("name", data.prefilled.name);
              if (data.token) params.set("social_token", data.token);
              router.push(`/auth/personal-information?${params.toString()}`);
            } else if (data?.token && data?.user) {
              clearLoadingState();
              Cookies.set("bidooze_token", data.token, { expires: 7 });
              setUser(data.user);
              toast.success("Logged in successfully");
              router.refresh();
            } else {
              clearLoadingState();
              toast.error("Google sign-in couldn't complete", {
                description: "Unexpected response from server. Please try again.",
              });
            }
          } catch (error) {
            clearLoadingState();
            toast.error("Google sign-in couldn't complete", {
              description: getFriendlyOneTapMessage(getErrorMessage(error)),
            });
          } finally {
            isAuthenticatingRef.current = false;
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      accounts.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn("[OneTap] not displayed:", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.warn("[OneTap] skipped:", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.info("[OneTap] dismissed:", notification.getDismissedReason());
        }
      });
      return true;
    };

    // GIS script may already be loaded (e.g. from a previous page visit)
    if (initOneTap()) return;

    // Otherwise inject the script and init once it loads
    const scriptId = "google-gis-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => initOneTap();
      document.head.appendChild(script);
    } else {
      // Script tag exists but google object not ready yet — poll briefly
      let attempts = 0;
      const interval = setInterval(() => {
        if (initOneTap() || ++attempts > 30) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user]);

  return statusText ? (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80]">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm font-medium text-foreground">{statusText}</span>
      </div>
    </div>
  ) : null;
};

export default GoogleOneTap;
