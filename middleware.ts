import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // N'exécuter le middleware que sur l'espace d'administration.
  matcher: ["/admin/:path*"],
};
