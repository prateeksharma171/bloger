import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuth = request.cookies.get("isAuth")?.value === "true";
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/Login" || pathname === "/SignUp";

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Login", "/SignUp"],
};
