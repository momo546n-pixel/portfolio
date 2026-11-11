import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonClasses } from "@/components/ui/button";
import { FolderKanban, Wrench, Briefcase, Mail, Plus, Pencil } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [projects, published, skills, experiences, messages, unread] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("experiences").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false),
    ]);

  const stats = [
    {
      label: "Projets",
      value: projects.count ?? 0,
      sub: `${published.count ?? 0} publié(s)`,
      href: "/admin/projets",
      icon: FolderKanban,
    },
    {
      label: "Compétences",
      value: skills.count ?? 0,
      sub: "catégories gérables",
      href: "/admin/competences",
      icon: Wrench,
    },
    {
      label: "Expériences",
      value: experiences.count ?? 0,
      sub: "parcours professionnel",
      href: "/admin/experiences",
      icon: Briefcase,
    },
    {
      label: "Messages",
      value: messages.count ?? 0,
      sub: `${unread.count ?? 0} non lu(s)`,
      href: "/admin/messages",
      icon: Mail,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Gérez le contenu de votre portfolio sans toucher au code.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <p className="mt-2 text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projets/nouveau" className={buttonClasses("primary", "sm")}>
            <Plus className="h-4 w-4" /> Nouveau projet
          </Link>
          <Link href="/admin/competences" className={buttonClasses("outline", "sm")}>
            <Wrench className="h-4 w-4" /> Gérer les compétences
          </Link>
          <Link href="/admin/experiences" className={buttonClasses("outline", "sm")}>
            <Briefcase className="h-4 w-4" /> Gérer les expériences
          </Link>
          <Link href="/admin/profil" className={buttonClasses("outline", "sm")}>
            <Pencil className="h-4 w-4" /> Modifier le profil
          </Link>
        </div>
      </div>
    </div>
  );
}
