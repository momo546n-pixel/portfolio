import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";
import type { ProjectWithImages } from "@/lib/types";

export default async function EditProjetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const project = data as ProjectWithImages;
  project.project_images?.sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Modifier le projet</h1>
      <p className="mt-1 text-sm text-muted-foreground">{project.title}</p>
      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
