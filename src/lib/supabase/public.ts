import { createClient } from "@supabase/supabase-js";

// Un fetch borné dans le temps : évite qu'une requête reste bloquée
// (utile au build et en production si la base est injoignable).
function timedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeout),
  );
}

/**
 * Client Supabase anonyme (sans cookies) pour les lectures PUBLIQUES.
 * Il ne dépend pas de la requête, ce qui permet au site public d'être mis en
 * cache / rendu statiquement (ISR). Il respecte la RLS : il ne voit que les
 * contenus publiés.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: timedFetch },
    },
  );
}
