import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getSafeRedirectPath } from "@/lib/authRedirect";

const AUTH_ONBOARDING_ALLOWED_WITH_TOKEN = [
  "/auth/personal-information",
  "/auth/profile-setup",
];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("bidooze_token")?.value;

  const { pathname, searchParams } = request.nextUrl;

  const protectedRoutes = [
    "/account",
    "/auction/register",
    "/bids",
    "/watchlist",
    "/settings",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    const nextPath = `${pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/auth") && token) {
    const isAllowedOnboardingRoute = AUTH_ONBOARDING_ALLOWED_WITH_TOKEN.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowedOnboardingRoute) {
      const nextPath = getSafeRedirectPath(searchParams.get("next"), "/account");
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};