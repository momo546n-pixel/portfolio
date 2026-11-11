import { createClient } from "@/lib/supabase/server";
import { ExperiencesManager } from "@/components/admin/experiences-manager";
import type { Experience } from "@/lib/types";

export default async function ExperiencesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Expériences</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajoutez, modifiez, réordonnez ou supprimez vos expériences professionnelles.
      </p>
      <div className="mt-6">
        <ExperiencesManager initial={(data as Experience[]) ?? []} />
      </div>
    </div>
  );
}
