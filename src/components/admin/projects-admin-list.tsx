"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectsAdminList({ initial }: { initial: Project[] }) {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>(initial);

  async function patch(id: string, p: Partial<Project>) {
    setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
    await supabase.from("projects").update(p).eq("id", id);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce projet et toutes ses images ?")) return;
    setProjects((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("projects").delete().eq("id", id);
  }

  if (!projects.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Aucun projet pour le moment. Créez-en un avec « Nouveau ».
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {projects.map((p) => (
        <li
          key={p.id}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{p.title}</p>
              {p.featured && <Star className="h-4 w-4 shrink-0 fill-brand text-brand" />}
            </div>
            <p className="truncate text-xs text-muted-foreground">/projets/{p.slug}</p>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              p.status === "published"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {p.status === "published" ? "Publié" : "Brouillon"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => patch(p.id, { featured: !p.featured })}
              aria-label="Mettre en avant"
              className="rounded-md p-2 hover:bg-muted"
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  p.featured ? "fill-brand text-brand" : "text-muted-foreground",
                )}
              />
            </button>
            <button
              type="button"
              onClick={() =>
                patch(p.id, { status: p.status === "published" ? "draft" : "published" })
              }
              aria-label={p.status === "published" ? "Dépublier" : "Publier"}
              className="rounded-md p-2 hover:bg-muted"
            >
              {p.status === "published" ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <Link
              href={`/admin/projets/${p.id}`}
              aria-label="Modifier"
              className="rounded-md p-2 hover:bg-muted"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Link>
            <button
              type="button"
              onClick={() => remove(p.id)}
              aria-label="Supprimer"
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
