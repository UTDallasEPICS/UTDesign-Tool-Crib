import { NextResponse } from "next/server";
import { withMiddlewareAuthRequired , getSession} from "@auth0/nextjs-auth0/edge";

// export default withMiddlewareAuthRequired();


export default withMiddlewareAuthRequired(async function middleware(req) {
    const user = await getSession(req);
    // console.log(user.user["http://localhost:3000/roles"][0])
    // if (user.user["http://localhost:3000/roles"][0] === undefined) {
    //     res.cookies.set('isAdmin', false)
    //     // console.log("NO ADMIN")
    // } else {
    //     res.cookies.set('isAdmin', true)
    //     // console.log("ADMIN")
    // }
    // res.cookies.set('hl', user.language);
    
    if (user.user["http://localhost:3000/roles"].includes('Admin')) {
        if (req.nextUrl.pathname.startsWith('/Admin')) {
            const url = req.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
            return new Response("Unauthorized", {status:  401});
        }
    }
    return NextResponse.next();
  });

// export const config = {
//     matcher: '/api/:path*'
// }