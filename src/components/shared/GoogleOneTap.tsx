'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUser } from "@/features/auth/context/UserContext";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const GoogleOneTap = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { socialAuth } = useAuth();
  const { user, setUser } = useUser();

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
          if (!response.credential) return;
          try {
            const data = await socialAuth.mutateAsync({
              provider: "google",
              token: response.credential,
            });

            if (data?.status === "registration_required") {
              const params = new URLSearchParams();
              if (data.prefilled?.email) params.set("email", data.prefilled.email);
              if (data.prefilled?.name) params.set("name", data.prefilled.name);
              if (data.token) params.set("social_token", data.token);
              router.push(`/auth/personal-information?${params.toString()}`);
            } else if (data?.token && data?.user) {
              Cookies.set("bidooze_token", data.token, { expires: 7 });
              setUser(data.user);
              toast.success("Logged in successfully");
              router.refresh();
            }
          } catch {
            // Fail silently — One Tap is progressive enhancement,
            // don't interrupt the user's browsing with a toast.
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

  return null;
};

export default GoogleOneTap;
