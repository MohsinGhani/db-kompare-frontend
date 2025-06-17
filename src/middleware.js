// src/middleware.js

import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

/**
 * Unauthenticated pages (e.g. sign-in, sign-up)
 * should only be visible to guests.
 */
const PUBLIC_ROUTES = [
  "/signin",
  "/signup",
  "/verification-code",
  "/new-password",
  "/email-verification",
];

/**
 * Pages requiring at least a logged-in user.
 */
const PROTECTED_ROUTES = [
  "/user-profile",
  "/add-blog",
  "/edit-blog",
];

/**
 * Admin-only sections.
 */
const ADMIN_ROUTES = ["/admin"];

/**
 * Helper: does `pathname` start with any of `routes`?
 */
function matches(pathname, routes) {
  return routes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // --- 1) Unauthenticated visitors ---
  if (!token) {
    // Redirect guests away from protected/admin pages
    if (matches(pathname, PROTECTED_ROUTES) || matches(pathname, ADMIN_ROUTES)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    // Everything else is fine
    return NextResponse.next();
  }

  // --- 2) Authenticated users ---
  let userRole = null;
  try {
    const payload = jwtDecode(token);
    userRole = payload["cognito:groups"]?.[0] ?? null;
  } catch (err) {
    console.error("Invalid JWT:", err);
    // Treat invalid token as logged-out
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2a) Block signed-in users from seeing auth pages
  if (matches(pathname, PUBLIC_ROUTES)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2b) Enforce admin-only routes
  if (matches(pathname, ADMIN_ROUTES) && userRole !== "ADMINS") {
    // Non-admins get bounced to homepage (or show a 403 page)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2c) All other pages are fine
  return NextResponse.next();
}

// Only run middleware on all non-API, non-_next, non-static, non-favicon routes
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
