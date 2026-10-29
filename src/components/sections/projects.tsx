import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/lib/types";

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  // Projets mis en avant d'abord, puis ordre d'affichage
  const sorted = [...projects].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || a.display_order - b.display_order,
  );

  return (
    <section id="projets" className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Projets"
          title="Mes réalisations"
          description="Une sélection de projets que j'ai conçus et développés."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
