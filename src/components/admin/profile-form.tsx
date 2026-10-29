"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { inputCls, labelCls } from "@/components/admin/form";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [title, setTitle] = useState(profile?.title ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [githubUrl, setGithubUrl] = useState(profile?.github_url ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatar, setAvatar] = useState(profile?.avatar_url ?? "");
  const [cv, setCv] = useState(profile?.cv_url ?? "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(bucket: string, file: File): Promise<string> {
    const ext =
      (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type || undefined });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      setAvatar(await uploadFile("avatars", f));
    } catch {
      setError("Échec de l'upload de la photo.");
    }
    setUploading(false);
  }

  async function onCv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      setCv(await uploadFile("cv", f));
    } catch {
      setError("Échec de l'upload du CV.");
    }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const payload = {
      full_name: fullName.trim(),
      title: title.trim(),
      location: location || null,
      email: email || null,
      phone: phone || null,
      github_url: githubUrl || null,
      bio: bio || null,
      avatar_url: avatar || null,
      cv_url: cv || null,
    };

    const res = profile?.id
      ? await supabase.from("profile").update(payload).eq("id", profile.id)
      : await supabase.from("profile").insert(payload);

    if (res.error) {
      setError("Enregistrement impossible.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-brand text-white">
          {avatar ? (
            <Image src={avatar} alt="Photo" fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-lg font-bold">
              {(fullName || "MN")
                .split(/\s+/)
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <label className={labelCls}>Photo de profil</label>
          <input type="file" accept="image/*" onChange={onAvatar} className="text-sm" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Nom complet</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Localisation</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Téléphone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Lien GitHub</label>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>À propos (une idée par ligne pour créer des paragraphes)</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>CV (PDF)</label>
        <div className="flex items-center gap-4">
          {cv && (
            <a
              href={cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <FileText className="h-4 w-4" /> CV actuel
            </a>
          )}
          <input type="file" accept="application/pdf" onChange={onCv} className="text-sm" />
        </div>
      </div>

      {uploading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Envoi du fichier…
        </p>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
      {saved && (
        <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
          <CheckCircle2 className="h-4 w-4" /> Profil enregistré.
        </p>
      )}

      <Button type="submit" disabled={saving || uploading}>
        {saving ? "Enregistrement…" : "Enregistrer le profil"}
      </Button>
    </form>
  );
}
