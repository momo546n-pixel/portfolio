import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { ProjectGallery } from "@/components/project-gallery";
import { getProjectBySlug, getAllPublishedSlugs } from "@/lib/data";
import { GithubIcon } from "@/components/icons/github";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: `${project.title} — Projet`,
    description: project.summary ?? undefined,
    openGraph: {
      title: project.title,
      description: project.summary ?? undefined,
      images: project.cover_image_url ? [project.cover_image_url] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <PageHero title={project.title} subtitle={project.summary ?? undefined} />
      <Container className="py-12">
        <Link
          href="/#portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au portfolio
        </Link>

        <div className="mt-6 flex flex-col gap-4">
          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("outline", "sm")}
              >
                <GithubIcon className="h-4 w-4" /> Code source
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "sm")}
              >
                <ExternalLink className="h-4 w-4" /> Voir la démo
              </a>
            )}
          </div>
        </div>

        {project.cover_image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {project.description && (
          <div className="markdown mt-10 max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.description}
            </ReactMarkdown>
          </div>
        )}

        {project.project_images.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">Galerie</h2>
            <ProjectGallery images={project.project_images} />
          </div>
        )}
      </Container>
    </>
  );
}
