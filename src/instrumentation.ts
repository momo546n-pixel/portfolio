// Au démarrage du serveur Node, on fournit un WebSocket global si absent
// (Node < 22 n'en a pas, et @supabase/supabase-js en exige un).
// Sur l'edge runtime, WebSocket existe déjà : rien à faire.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const g = globalThis as { WebSocket?: unknown };
    if (typeof g.WebSocket === "undefined") {
      const { WebSocket } = await import("ws");
      g.WebSocket = WebSocket;
    }
  }
}
