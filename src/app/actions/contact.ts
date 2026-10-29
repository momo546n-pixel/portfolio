"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().email("E-mail invalide").max(200),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  body: z.string().trim().min(10, "Message trop court (10 caractères min.)").max(5000),
});

export type ContactState = { ok: boolean; error?: string } | null;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    body: parsed.data.body,
  });

  if (error) {
    return { ok: false, error: "Envoi impossible pour le moment. Réessayez plus tard." };
  }
  return { ok: true };
}
