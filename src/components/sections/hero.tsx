import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { GithubIcon } from "@/components/icons/github";
import { Hero3D } from "@/components/hero-3d";
import {
  Mail,
  ArrowRight,
  Download,
  FolderGit2,
  Briefcase,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { Profile, Skill } from "@/lib/types";

export function Hero({
  profile,
  skills,
  projectCount,
  experienceCount,
}: {
  profile: Profile | null;
  skills: Skill[];
  projectCount: number;
  experienceCount: number;
}) {
  const name = profile?.full_name ?? "Portfolio";
  const title = profile?.title ?? "Développeur";
  const tagline = profile?.bio?.split("\n").filter(Boolean)[0] ?? "";
  const techTags = skills
    .filter((s) => s.category === "development")
    .slice(0, 5)
    .map((s) => s.name);

  return (
    <section
      id="accueil"
      className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden bg-[#09090f] pt-16 text-white"
    >
      {/* Fond animé : halos colorés + grille */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-24 -top-28 h-[30rem] w-[30rem] rounded-full bg-violet-600/40 blur-[120px]" />
        <div className="animate-blob absolute right-0 top-1/4 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/30 blur-[120px] [animation-delay:4s]" />
        <div className="animate-blob absolute -bottom-24 left-1/3 h-[26rem] w-[26rem] rounded-full bg-cyan-400/25 blur-[120px] [animation-delay:8s]" />
        <div className="bg-grid-dark absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090f]" />
      </div>

      <Container className="relative grid items-center gap-8 py-16 md:grid-cols-2 md:gap-6 md:py-24">
        {/* ---- Texte ---- */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Disponible pour de nouvelles opportunités
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.25em] text-white/50">
              Bonjour, je suis
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {name}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              {title}
            </p>
          </Reveal>

          {tagline && (
            <Reveal delay={0.2}>
              <p className="mx-auto mt-5 max-w-xl text-white/60 md:mx-0">{tagline}</p>
            </Reveal>
          )}

          {techTags.length > 0 && (
            <Reveal delay={0.25}>
              <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                {techTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/portfolio"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 text-sm font-semibold text-white shadow-lg shadow-fuchsia-600/25 transition-opacity hover:opacity-90"
              >
                Voir mon portfolio <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Me contacter
              </Link>
              {profile?.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  <Download className="h-4 w-4" /> Mon CV
                </a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-6 flex items-center justify-center gap-4 md:justify-start">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="E-mail"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {/* ---- Objet 3D + cartes flottantes ---- */}
        <div className="relative order-1 md:order-2">
          <div className="h-64 sm:h-80 md:h-[32rem]">
            <Hero3D />
          </div>

          <div className="hidden md:block">
            <div className="animate-floaty absolute left-0 top-12 rounded-xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="h-5 w-5 text-fuchsia-400" />
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {projectCount} projet{projectCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-white/50">conçus &amp; livrés</p>
                </div>
              </div>
            </div>

            <div
              className="animate-floaty absolute right-0 top-1/3 rounded-xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-md"
              style={{ animationDelay: "1.3s" }}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {experienceCount} expérience{experienceCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-white/50">en entreprise</p>
                </div>
              </div>
            </div>

            <div
              className="animate-floaty absolute bottom-12 left-8 rounded-xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-md"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <div>
                  <p className="text-sm font-semibold leading-tight">Full-Stack</p>
                  <p className="text-xs text-white/50">Web &amp; mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <a
        href="#explore"
        aria-label="Défiler vers le bas"
        className="animate-bob absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/50 md:block"
      >
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
}
