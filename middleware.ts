import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { validateApiKey } from "@/server/utils/api-key-middleware";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/"]);
const isV1ApiRoute = createRouteMatcher(["/api/v1(.*)"]);

export default clerkMiddleware((auth, request) => {
  // Handle v1 API routes with API key authentication
  if (isV1ApiRoute(request)) {
    const apiKeyValidation = validateApiKey(request);
    if (apiKeyValidation) {
      return apiKeyValidation;
    }
    return NextResponse.next();
  }

  // Handle other routes with Clerk authentication
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
