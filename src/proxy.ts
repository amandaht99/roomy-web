import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, request) => {
  const { pathname, search } = request.nextUrl;
  const method = request.method;
  const startTime = Date.now();

  console.log(
    `\n📥 [${new Date().toISOString()}] ${method.padEnd(6)} ${pathname}${search}`,
  );

  const response = NextResponse.next();
  const duration = Date.now() - startTime;
  response.headers.set("X-Response-Time", `${duration}ms`);

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
