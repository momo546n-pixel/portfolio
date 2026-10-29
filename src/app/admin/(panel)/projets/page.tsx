import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonClasses } from "@/components/ui/button";
import { ProjectsAdminList } from "@/components/admin/projects-admin-list";
import { Plus } from "lucide-react";
import type { Project } from "@/lib/types";

export default async function ProjetsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Projets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez vos projets, leur statut, leur mise en avant et leur ordre.
          </p>
        </div>
        <Link href="/admin/projets/nouveau" className={buttonClasses("primary", "sm")}>
          <Plus className="h-4 w-4" /> Nouveau
        </Link>
      </div>
      <div className="mt-6">
        <ProjectsAdminList initial={(data as Project[]) ?? []} />
      </div>
    </div>
  );
}
