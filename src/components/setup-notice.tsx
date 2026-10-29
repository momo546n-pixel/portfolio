import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { buttonClasses } from "@/components/ui/button";
import { Database, FileCode2, KeyRound, Sprout, BookOpen } from "lucide-react";

const STEPS = [
  {
    icon: Database,
    title: "1. Créer le projet Supabase",
    text: "Sur supabase.com, puis récupérer l'URL et les clés (Settings → API).",
  },
  {
    icon: FileCode2,
    title: "2. Exécuter les migrations",
    text: "Dans le SQL Editor, lancer dans l'ordre 0001_init, 0002_rls, 0003_storage.",
  },
  {
    icon: KeyRound,
    title: "3. Renseigner .env.local",
    text: "Copier .env.example en .env.local et y coller tes clés Supabase.",
  },
  {
    icon: Sprout,
    title: "4. Remplir la base",
    text: "Lancer « npm run seed » : profil, compétences, projets et CV sont ajoutés.",
  },
];

export function SetupNotice() {
  return (
    <section className="py-16">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2 text-accent">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                ⚙️
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide">
                Configuration requise
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              Ton portfolio est prêt, il attend ses données
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tout le contenu (profil, compétences, projets…) vient de Supabase. Pour le
              voir s&apos;afficher et s&apos;animer, il reste 4 petites étapes. Ce panneau
              disparaîtra automatiquement une fois la base remplie.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.title} delay={i * 0.08}>
                    <div className="flex h-full gap-3 rounded-lg border border-border p-4">
                      <Icon className="h-5 w-5 shrink-0 text-accent" />
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "sm")}
              >
                <Database className="h-4 w-4" /> Ouvrir Supabase
              </a>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" /> Guide pas-à-pas dans le fichier{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">README.md</code>
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
