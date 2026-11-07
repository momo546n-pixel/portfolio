import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { buttonClasses } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { LINKEDIN_URL } from "@/lib/site";
import type { Profile } from "@/lib/types";

export function About({ profile }: { profile: Profile | null }) {
  if (!profile) return null;

  const paragraphs = (profile.bio ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="a-propos" className="py-20">
      <Container>
        <SectionHeading eyebrow="À propos" title="Qui suis-je ?" />
        <div className="mt-8 grid gap-10 md:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>Profil à compléter depuis l&apos;espace d&apos;administration.</p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Coordonnées
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {profile.location && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-accent" />
                    {profile.location}
                  </li>
                )}
                {profile.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-accent" />
                    <a className="truncate hover:text-foreground" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  </li>
                )}
                {profile.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-accent" />
                    <a
                      className="hover:text-foreground"
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    >
                      {profile.phone}
                    </a>
                  </li>
                )}
                {profile.github_url && (
                  <li className="flex items-center gap-2">
                    <GithubIcon className="h-4 w-4 shrink-0 text-accent" />
                    <a
                      className="truncate hover:text-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={profile.github_url}
                    >
                      GitHub
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <LinkedinIcon className="h-4 w-4 shrink-0 text-accent" />
                  <a
                    className="truncate hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={LINKEDIN_URL}
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("primary", "sm", "mt-5 w-full")}
                >
                  <Download className="h-4 w-4" /> Télécharger mon CV
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
