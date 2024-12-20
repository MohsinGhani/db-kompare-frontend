import { NextResponse } from "next/server";

const PUBLIC_PAGES = [
  "/signin",
  "/signup",
  "/verification-code",
  "/new-password",
  "/email-verification",
];

const PROTECTED_PAGES = ["/user-profile"];

export function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isPublicPage = PUBLIC_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  const isProtectedPage = PROTECTED_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  if (token) {
    // If user is logged in and tries to access a public page, redirect to home
    if (isPublicPage) {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
    // Logged-in user accessing other pages, allow
    return NextResponse.next();
  } else {
    // If not logged in and accessing a protected page, redirect to sign in
    if (isProtectedPage) {
      const signInUrl = new URL("/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
    // If not logged in, allow access to all other pages
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes
     * - Static files
     * - Next.js internals (/_next, /favicon.ico)
     */
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};
