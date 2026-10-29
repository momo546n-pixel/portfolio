import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { GraduationCap, Award } from "lucide-react";
import type { Education } from "@/lib/types";

export function EducationSection({ education }: { education: Education[] }) {
  if (!education.length) return null;

  const formations = education.filter((e) => e.type === "formation");
  const certifications = education.filter((e) => e.type === "certification");

  return (
    <section id="formation" className="py-20">
      <Container>
        <SectionHeading eyebrow="Formation" title="Formation & certifications" />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {formations.length > 0 && (
            <div>
              <h3 className="mb-4 inline-flex items-center gap-2 font-semibold">
                <GraduationCap className="h-5 w-5 text-accent" /> Formation
              </h3>
              <ul className="space-y-4">
                {formations.map((e, i) => (
                  <Reveal key={e.id} delay={i * 0.05}>
                    <li className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-medium">{e.title}</p>
                        {e.year && (
                          <span className="shrink-0 text-sm text-muted-foreground">
                            {e.year}
                          </span>
                        )}
                      </div>
                      {e.institution && (
                        <p className="text-sm text-muted-foreground">{e.institution}</p>
                      )}
                      {e.mention && <p className="mt-1 text-sm text-accent">{e.mention}</p>}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <h3 className="mb-4 inline-flex items-center gap-2 font-semibold">
                <Award className="h-5 w-5 text-accent" /> Certifications
              </h3>
              <ul className="space-y-4">
                {certifications.map((e, i) => (
                  <Reveal key={e.id} delay={i * 0.05}>
                    <li className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-medium">{e.title}</p>
                        {e.year && (
                          <span className="shrink-0 text-sm text-muted-foreground">
                            {e.year}
                          </span>
                        )}
                      </div>
                      {e.institution && (
                        <p className="text-sm text-muted-foreground">{e.institution}</p>
                      )}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
