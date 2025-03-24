import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Apply middleware to all protected routes
export const config = {
  matcher: ["/tasks:path*"],
};
