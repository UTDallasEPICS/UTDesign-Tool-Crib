import { NextResponse } from "next/server";
import { withMiddlewareAuthRequired , getSession} from "@auth0/nextjs-auth0/edge";

// export default withMiddlewareAuthRequired();


export default withMiddlewareAuthRequired(async function middleware(req) {
    const res = NextResponse.next();
    const user = await getSession(req, res);
    // console.log(user.user["http://localhost:3000/roles"][0])
    if (user.user["http://localhost:3000/roles"][0] === undefined) {
        res.cookies.set('isAdmin', false)
        // console.log("NO ADMIN")
    } else {
        res.cookies.set('isAdmin', true)
        // console.log("ADMIN")
    }
    // res.cookies.set('hl', user.language);
    return res;
  });

// export const config = {
//     matcher: '/api/:path*'
// }