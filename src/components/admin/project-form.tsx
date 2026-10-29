"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { ProjectWithImages, ProjectStatus, ProjectImage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { inputCls, labelCls } from "@/components/admin/form";
import { X, Plus, Loader2, Trash2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";

type GalleryItem = {
  id?: string;
  image_url: string;
  caption: string;
  display_order: number;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function ProjectForm({ project }: { project?: ProjectWithImages | null }) {
  const router = useRouter();
  const supabase = createClient();
  const editing = !!project;

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState<boolean>(editing);
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tech, setTech] = useState<string[]>(project?.tech ?? []);
  const [techInput, setTechInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demo_url ?? "");
  const [cover, setCover] = useState(project?.cover_image_url ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "draft");
  const [featured, setFeatured] = useState<boolean>(project?.featured ?? false);
  const [order, setOrder] = useState<number>(project?.display_order ?? 0);
  const [gallery, setGallery] = useState<GalleryItem[]>(
    (project?.project_images ?? []).map((i) => ({
      id: i.id,
      image_url: i.image_url,
      caption: i.caption ?? "",
      display_order: i.display_order,
    })),
  );

  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = () => slug || slugify(title);

  function onTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function addTech() {
    const t = techInput.trim();
    if (t && !tech.includes(t)) setTech([...tech, t]);
    setTechInput("");
  }

  async function uploadFile(bucket: string, file: File, folder = ""): Promise<string> {
    const ext =
      (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "bin";
    const path = `${folder ? folder + "/" : ""}${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type || undefined });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      setCover(await uploadFile("projects", f, "covers"));
    } catch {
      setError("Échec de l'upload de l'image de couverture.");
    }
    setUploading(false);
  }

  async function onGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const f of files) {
        const url = await uploadFile("projects", f, "gallery");
        const item: GalleryItem = { image_url: url, caption: "", display_order: gallery.length };
        if (editing && project) {
          const { data } = await supabase
            .from("project_images")
            .insert({
              project_id: project.id,
              image_url: url,
              caption: null,
              display_order: item.display_order,
            })
            .select()
            .single();
          if (data) item.id = (data as ProjectImage).id;
        }
        setGallery((g) => [...g, item]);
      }
    } catch {
      setError("Échec de l'upload d'une image de la galerie.");
    }
    setUploading(false);
    e.target.value = "";
  }

  async function removeGallery(idx: number) {
    const item = gallery[idx];
    setGallery((g) => g.filter((_, i) => i !== idx));
    if (item.id) await supabase.from("project_images").delete().eq("id", item.id);
  }

  async function captionBlur(idx: number) {
    const item = gallery[idx];
    if (item.id)
      await supabase
        .from("project_images")
        .update({ caption: item.caption || null })
        .eq("id", item.id);
  }

  async function runImport() {
    if (!importUrl.trim()) return;
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/github-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Import impossible.");
        setImporting(false);
        return;
      }
      if (data.title && !title) onTitle(data.title);
      if (data.summary && !summary) setSummary(data.summary);
      if (data.description && !description) setDescription(data.description);
      if (Array.isArray(data.tech) && data.tech.length)
        setTech((prev) => Array.from(new Set([...prev, ...(data.tech as string[])])));
      if (data.github_url && !githubUrl) setGithubUrl(data.github_url);
      if (data.demo_url && !demoUrl) setDemoUrl(data.demo_url);
      if (data.cover_image_url && !cover) setCover(data.cover_image_url);
      if (Array.isArray(data.images) && data.images.length)
        setGallery((g) => [
          ...g,
          ...(data.images as string[]).map((u, i) => ({
            image_url: u,
            caption: "",
            display_order: g.length + i,
          })),
        ]);
    } catch {
      setError("Import impossible.");
    }
    setImporting(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const finalSlug = effectiveSlug();
    if (!title.trim() || !finalSlug) {
      setError("Le titre est obligatoire.");
      setSaving(false);
      return;
    }
    const payload = {
      title: title.trim(),
      slug: finalSlug,
      summary: summary || null,
      description: description || null,
      tech,
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      cover_image_url: cover || null,
      status,
      featured,
      display_order: Number(order) || 0,
    };

    if (editing && project) {
      const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
      if (error) {
        setError(
          error.message.includes("duplicate")
            ? "Ce slug est déjà utilisé par un autre projet."
            : "Enregistrement impossible.",
        );
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      if (error || !data) {
        setError(
          error?.message.includes("duplicate")
            ? "Ce slug est déjà utilisé par un autre projet."
            : "Création impossible.",
        );
        setSaving(false);
        return;
      }
      const newId = (data as { id: string }).id;
      if (gallery.length) {
        await supabase.from("project_images").insert(
          gallery.map((g, i) => ({
            project_id: newId,
            image_url: g.image_url,
            caption: g.caption || null,
            display_order: i,
          })),
        );
      }
    }
    router.push("/admin/projets");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Import GitHub */}
      <div className="rounded-lg border border-border bg-card p-4">
        <label className={labelCls}>
          <GithubIcon className="mr-1 inline h-4 w-4" /> Pré-remplir depuis un dépôt GitHub
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://github.com/utilisateur/depot"
            className={inputCls}
          />
          <Button type="button" variant="outline" onClick={runImport} disabled={importing}>
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Importer"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Récupère le nom, la description, les langages, les liens et les captures du README
          (copiées dans votre stockage). Les champs déjà remplis ne sont pas écrasés.
        </p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Titre *</label>
          <input value={title} onChange={(e) => onTitle(e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Slug (URL)</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder={slugify(title) || "mon-projet"}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Accroche (courte)</label>
        <input value={summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Description détaillée (markdown accepté)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Technologies</label>
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Ex. Next.js, puis Entrée"
            className={inputCls}
          />
          <Button type="button" variant="outline" onClick={addTech}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tech.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tech.map((t) => (
              <span key={t} className="inline-flex items-center gap-1">
                <Badge>
                  {t}
                  <button
                    type="button"
                    onClick={() => setTech(tech.filter((x) => x !== t))}
                    className="ml-1 text-muted-foreground hover:text-red-600"
                    aria-label={`Retirer ${t}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Lien GitHub</label>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Lien démo</label>
          <input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Couverture */}
      <div>
        <label className={labelCls}>Image de couverture</label>
        <div className="flex items-center gap-4">
          {cover && (
            <div className="relative h-20 w-32 overflow-hidden rounded-md border border-border">
              <Image src={cover} alt="Couverture" fill sizes="128px" className="object-cover" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={onCoverChange} className="text-sm" />
          {cover && (
            <button
              type="button"
              onClick={() => setCover("")}
              className="text-sm text-muted-foreground hover:text-red-600"
            >
              Retirer
            </button>
          )}
        </div>
      </div>

      {/* Galerie */}
      <div>
        <label className={labelCls}>Galerie de captures</label>
        <input type="file" accept="image/*" multiple onChange={onGalleryAdd} className="text-sm" />
        {gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((g, idx) => (
              <div key={g.id ?? g.image_url} className="rounded-md border border-border p-2">
                <div className="relative mb-2 aspect-video overflow-hidden rounded bg-muted">
                  <Image src={g.image_url} alt="" fill sizes="200px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGallery(idx)}
                    aria-label="Supprimer l'image"
                    className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  value={g.caption}
                  onChange={(e) =>
                    setGallery((gl) =>
                      gl.map((x, i) => (i === idx ? { ...x, caption: e.target.value } : x)),
                    )
                  }
                  onBlur={() => captionBlur(idx)}
                  placeholder="Légende"
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {uploading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Envoi de l'image…
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className={inputCls}
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Ordre d&apos;affichage</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4"
            />
            Mettre en avant
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Créer le projet"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projets")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
