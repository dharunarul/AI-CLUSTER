import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

function verifySessionToken(token) {
  if (!token) return false;
  try {
    const payload = decodeJwt(token);
    if (!payload) return false;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    return !!payload.sub;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedPage =
    pathname.startsWith("/home") || pathname.startsWith("/agents");
  const authenticated = await verifySessionToken(token);

  if (isProtectedPage && !authenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthPage && authenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/agents/:path*", "/signin", "/signup"],
};
