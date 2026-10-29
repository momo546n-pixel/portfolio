import { createClient } from "@/lib/supabase/server";
import { MessagesManager } from "@/components/admin/messages-manager";
import type { Message } from "@/lib/types";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Messages reçus</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Les messages envoyés depuis le formulaire de contact du site.
      </p>
      <div className="mt-6">
        <MessagesManager initial={(data as Message[]) ?? []} />
      </div>
    </div>
  );
}
