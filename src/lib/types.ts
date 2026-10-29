// Types du domaine, alignés sur le schéma Supabase (supabase/migrations).
// Pour régénérer automatiquement depuis la base :
//   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts

export type SkillCategory = "development" | "data_design" | "systems_networks";
export type ProjectStatus = "draft" | "published";
export type EducationType = "formation" | "certification";

export const SKILL_CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "development", label: "Développement" },
  { value: "data_design", label: "Données & conception" },
  { value: "systems_networks", label: "Systèmes & réseaux" },
];

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  development: "Développement",
  data_design: "Données & conception",
  systems_networks: "Systèmes & réseaux",
};

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  bio: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  tech: string[];
  github_url: string | null;
  demo_url: string | null;
  cover_image_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string | null;
  period: string | null;
  description: string | null;
  display_order: number;
}

export interface Education {
  id: string;
  title: string;
  institution: string | null;
  year: string | null;
  type: EducationType;
  mention: string | null;
  display_order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export type ProjectWithImages = Project & { project_images: ProjectImage[] };
