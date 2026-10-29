"use client";

import { useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addComment, type CommentState } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Send } from "lucide-react";
import type { Comment } from "@/lib/types";

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || name[0] || "?").toUpperCase();
}

export function Comments({ initial }: { initial: Comment[] }) {
  const [list, setList] = useState<Comment[]>(initial);
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    addComment,
    null,
  );

  useEffect(() => {
    if (state?.ok && state.comment) {
      const c = state.comment;
      setList((prev) => [c, ...prev.filter((x) => x.id !== c.id)]);
    }
  }, [state]);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Mur de commentaires"
          title="Laissez un petit mot"
          description="Un retour, un bonjour, une recommandation ? C'est public, et ça fait toujours plaisir."
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Formulaire */}
          <form
            action={formAction}
            className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
          >
            <div>
              <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium">
                Nom
              </label>
              <input id="c-name" name="name" required className={inputCls} />
            </div>
            <div>
              <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium">
                Message
              </label>
              <textarea id="c-message" name="message" rows={4} required className={inputCls} />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600 dark:text-red-500">{state.error}</p>
            )}
            {state?.ok && (
              <p className="text-sm text-green-600 dark:text-green-500">
                Merci pour ton message !
              </p>
            )}
            <Button type="submit" disabled={pending}>
              <Send className="h-4 w-4" /> {pending ? "Envoi…" : "Publier"}
            </Button>
          </form>

          {/* Liste */}
          <div className="space-y-3">
            {list.length === 0 && (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Sois le premier à laisser un commentaire.
              </p>
            )}
            <AnimatePresence initial={false}>
              {list.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-xs font-bold text-white">
                      {initialsOf(c.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {c.message}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
