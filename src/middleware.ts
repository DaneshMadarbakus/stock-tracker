import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export default async function middleware(req: NextRequest) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/handler/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings", "/watchlist"],
};
