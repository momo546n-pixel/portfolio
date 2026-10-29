import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Profile,
  Skill,
  Project,
  ProjectWithImages,
  Experience,
  Education,
  Comment,
} from "@/lib/types";

// Toutes les lectures publiques passent par le client anonyme (cacheable).
// Chaque fonction est protégée : en cas d'erreur réseau/config, elle renvoie
// une valeur de repli afin de ne jamais casser le rendu ni le build.

/** Profil (ligne unique). */
export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    return (data as Profile | null) ?? null;
  } catch {
    return null;
  }
}

/** Toutes les compétences, triées par catégorie puis ordre d'affichage. */
export async function getSkills(): Promise<Skill[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true });
    return (data as Skill[]) ?? [];
  } catch {
    return [];
  }
}

/** Projets publiés. */
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}

/** Un projet publié par son slug, avec sa galerie triée. */
export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithImages | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) return null;
    const project = data as ProjectWithImages;
    project.project_images?.sort((a, b) => a.display_order - b.display_order);
    return project;
  } catch {
    return null;
  }
}

/** Slugs de tous les projets publiés (generateStaticParams, sitemap). */
export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("projects")
      .select("slug")
      .eq("status", "published");
    return ((data as { slug: string }[]) ?? []).map((r) => r.slug);
  } catch {
    return [];
  }
}

/** Expériences professionnelles. */
export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true });
    return (data as Experience[]) ?? [];
  } catch {
    return [];
  }
}

/** Formation et certifications. */
export async function getEducation(): Promise<Education[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("education")
      .select("*")
      .order("type", { ascending: true })
      .order("display_order", { ascending: true });
    return (data as Education[]) ?? [];
  } catch {
    return [];
  }
}

/** Commentaires du mur public (les plus récents d'abord). */
export async function getComments(): Promise<Comment[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return (data as Comment[]) ?? [];
  } catch {
    return [];
  }
}
