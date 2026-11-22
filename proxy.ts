import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/profile/edit", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthenticated = Boolean(accessToken);

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/notes/filter/all", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
