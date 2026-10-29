import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { SKILL_CATEGORIES } from "@/lib/types";
import type { Skill } from "@/lib/types";

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  return (
    <section id="competences" className="bg-muted/40 py-20">
      <Container>
        <SectionHeading eyebrow="Compétences" title="Ce que je maîtrise" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const items = skills.filter((s) => s.category === cat.value);
            if (!items.length) return null;
            return (
              <Reveal key={cat.value} delay={idx * 0.08}>
                <div className="h-full rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold">{cat.label}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {items.map((s) => (
                      <Badge key={s.id}>{s.name}</Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
