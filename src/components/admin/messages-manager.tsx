"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";
import { Mail, MailOpen, Trash2 } from "lucide-react";

export function MessagesManager({ initial }: { initial: Message[] }) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initial);

  async function toggleRead(m: Message) {
    const read = !m.read;
    setMessages((p) => p.map((x) => (x.id === m.id ? { ...x, read } : x)));
    await supabase.from("messages").update({ read }).eq("id", m.id);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce message ?")) return;
    setMessages((p) => p.filter((x) => x.id !== id));
    await supabase.from("messages").delete().eq("id", id);
  }

  if (!messages.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Aucun message pour le moment.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`rounded-lg border bg-card p-4 ${m.read ? "border-border" : "border-accent"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">
                {m.name}{" "}
                <a
                  href={`mailto:${m.email}`}
                  className="text-sm font-normal text-accent hover:underline"
                >
                  &lt;{m.email}&gt;
                </a>
              </p>
              {m.subject && <p className="text-sm text-muted-foreground">{m.subject}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => toggleRead(m)}
                aria-label={m.read ? "Marquer comme non lu" : "Marquer comme lu"}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {m.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => remove(m.id)}
                aria-label="Supprimer"
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{m.body}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(m.created_at).toLocaleString("fr-FR")}
          </p>
        </li>
      ))}
    </ul>
  );
}
