import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projets/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl hover:shadow-black/5"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
            {project.title}
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white">
            À la une
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          <ArrowUpRight className="bounce-hover h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
        </div>
        {project.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.summary}
          </p>
        )}
        {project.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {project.tech.length > 4 && <Badge>+{project.tech.length - 4}</Badge>}
          </div>
        )}
      </div>
    </Link>
  );
}
