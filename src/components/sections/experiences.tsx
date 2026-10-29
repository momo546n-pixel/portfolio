import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import type { Experience } from "@/lib/types";

export function Experiences({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) return null;

  return (
    <section id="experiences" className="bg-muted/40 py-20">
      <Container>
        <SectionHeading eyebrow="Parcours" title="Expériences" />
        <div className="mt-8 space-y-6 border-l border-border pl-6">
          {experiences.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <div className="relative">
                <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 border-background bg-brand" />
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="font-semibold">{e.role}</h3>
                    {e.period && (
                      <span className="text-sm text-muted-foreground">{e.period}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-accent">
                    {e.company}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                  {e.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
