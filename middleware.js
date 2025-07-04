import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

// export default withMiddlewareAuthRequired(async function middleware(req) {
//   const user = await getSession(req);

//   // Check for Admin privileges
//   if (!user.user["http://localhost:3000/roles"].includes("Admin")) {
//     // Redirect non-admin users to home page when requesting admin  routes
//     if (req.nextUrl.pathname.startsWith("/admin")) {
//       const url = req.nextUrl.clone();
//       url.pathname = "/";
//       return NextResponse.redirect(url);
//     }
//     // Send forbidden status for non-admin api requests
//     if (req.nextUrl.pathname.startsWith("/api/admin")) {
//       return new Response("Unauthorized", { status: 401 });
//     }
//   }
//   // Continue if no filtering is done
//   return NextResponse.next();
// });

// // Only look at api and /Admin routes
// export const config = {
//   matcher: ["/admin/:path*", "/api/:path*"],
// };

export async function middleware(request) {
  const authRes = await auth0.middleware(request); // Returns a NextResponse object

  // Ensure your own middleware does not handle the `/auth` routes, auto-mounted and handled by the SDK
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  // // Allow access to public routes without requiring a session
  // if (request.nextUrl.pathname === ("/")) {
  //   return authRes;
  // }

  // Any route that gets to this point will be considered a protected route, and require the user to be logged-in to be able to access it
  const { origin } = new URL(request.url);
  const session = await auth0.getSession(request);

  // If the user does not have a session, redirect to login
  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  // If a valid session exists, continue with the response from Auth0 middleware
  // You can also add custom logic here...
  return authRes;
}
