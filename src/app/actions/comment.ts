"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Comment } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  message: z.string().trim().min(2, "Message trop court").max(500),
});

export type CommentState =
  | { ok: boolean; error?: string; comment?: Comment }
  | null;

export async function addComment(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ name: parsed.data.name, message: parsed.data.message })
    .select()
    .single();

  if (error || !data) {
    return { ok: false, error: "Envoi impossible pour le moment. Réessayez." };
  }
  return { ok: true, comment: data as Comment };
}
