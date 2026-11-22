import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/profile/edit", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let refreshedCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();

      const setCookie = session.headers["set-cookie"];

      if (setCookie) {
        refreshedCookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      }

      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  refreshedCookies.forEach((rawCookie) => {
    const parsedCookie = parseSetCookie(rawCookie);
    const { name, value, ...options } = parsedCookie;

    if (name && value !== undefined) {
      response.cookies.set(name, value, options);
    }
  });

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
