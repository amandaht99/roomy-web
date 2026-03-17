import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";

type RouteHandler = (
  request: NextRequest,
  context: any,
) => Promise<NextResponse | void | Response>;

/**
 * Wraps an API route handler with comprehensive logging
 */
export function withLogging(handler: RouteHandler, routeName: string) {
  return async (request: NextRequest, context: any) => {
    const startTime = Date.now();
    const { pathname, searchParams } = request.nextUrl;
    const method = request.method;

    try {
      // Log incoming request
      const params = Object.fromEntries(searchParams);
      logger.request(
        method,
        pathname,
        Object.keys(params).length > 0 ? params : undefined,
      );

      // Execute the handler
      const response = await handler(request, context);

      // Log successful response
      const duration = Date.now() - startTime;
      const status = response?.status || 200;
      logger.response(
        method,
        pathname,
        status,
        duration,
        `${routeName} completed`,
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      logger.error(`${routeName} failed`, {
        error: errorMessage,
        path: pathname,
        method,
        duration,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return NextResponse.json(
        { error: errorMessage, type: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
