import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // 🔒 If NO token and trying to access protected page (not /login or /signup), redirect to /login
  if (!token && pathname !== "/login" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ If token exists and trying to access /login or /signup, redirect to dashboard or home
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url)); // Or "/"
  }

  // Otherwise, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on all routes except static files and API
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};
