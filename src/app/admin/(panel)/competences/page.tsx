import { createClient } from "@/lib/supabase/server";
import { SkillsManager } from "@/components/admin/skills-manager";
import type { Skill } from "@/lib/types";

export default async function CompetencesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Compétences</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajoutez, modifiez, réordonnez ou supprimez vos compétences par catégorie.
      </p>
      <div className="mt-6">
        <SkillsManager initial={(data as Skill[]) ?? []} />
      </div>
    </div>
  );
}
