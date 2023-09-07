import { NextResponse } from "next/server";
import {
  withMiddlewareAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired(async function middleware(req) {
  const user = await getSession(req);

  // Check for Admin privileges
  if (!user.user["http://localhost:3000/roles"].includes("Admin")) {
    // Redirect non-admin users to home page when requesting admin  routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // Send forbidden status for non-admin api requests
    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      return new Response("Unauthorized", { status: 401 });
    }
  }
  // Continue if no filtering is done
  return NextResponse.next();
});

// Only look at api and /Admin routes
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
