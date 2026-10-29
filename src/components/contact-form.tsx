"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    null,
  );

  if (state?.ok) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-6 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
        <p>Merci, votre message a bien été envoyé. Je vous répondrai rapidement.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Nom
          </label>
          <input id="name" name="name" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            E-mail
          </label>
          <input id="email" name="email" type="email" required className={inputCls} />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          Sujet <span className="text-muted-foreground">(optionnel)</span>
        </label>
        <input id="subject" name="subject" className={inputCls} />
      </div>
      <div>
        <label htmlFor="body" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea id="body" name="body" rows={5} required className={inputCls} />
      </div>
      {state?.error && (
        <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500">
          <AlertCircle className="h-4 w-4" />
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
