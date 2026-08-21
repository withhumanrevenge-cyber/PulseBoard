import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/explore(.*)",
  "/u/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public/(.*)",
  "/api/v1/(.*)",
  // Webhooks arrive without a Clerk session — svix verifies them itself.
  // Without this, auth.protect() rejects the request before route code runs
  // and no user row is ever written on sign-up.
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
