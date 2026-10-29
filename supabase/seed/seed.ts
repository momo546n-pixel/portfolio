/**
 * Script de seed — remplit la base Supabase avec les informations de
 * Mouhamed Rassoul Niang et ses 4 projets GitHub (descriptions + captures).
 *
 * Utilisation :
 *   1. Renseigner .env.local (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 *   2. Avoir exécuté les migrations SQL (supabase/migrations/*) sur la base
 *   3. npm run seed
 *
 * Le script est ré-exécutable : il efface puis réinsère le contenu
 * (profil, compétences, expériences, formation, projets). Les messages du
 * formulaire de contact ne sont jamais touchés.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { WebSocket as NodeWebSocket } from "ws";

// Node < 22 n'a pas de WebSocket global (requis par supabase-js).
{
  const g = globalThis as { WebSocket?: unknown };
  if (typeof g.WebSocket === "undefined") g.WebSocket = NodeWebSocket;
}

// --- Chargement de .env.local (sans dépendance externe) --------------------
function loadEnv() {
  try {
    const path = fileURLToPath(new URL("../../.env.local", import.meta.url));
    const txt = readFileSync(path, "utf-8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        let v = m[2].trim();
        if (
          (v.startsWith('"') && v.endsWith('"')) ||
          (v.startsWith("'") && v.endsWith("'"))
        ) {
          v = v.slice(1, -1);
        }
        process.env[m[1]] = v;
      }
    }
  } catch {
    // .env.local absent : on se repose sur les variables déjà présentes.
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "\n❌ Variables manquantes. Renseignez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local.\n",
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// --- Helpers GitHub ---------------------------------------------------------
const GH = "https://api.github.com";
function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-seed",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}
function toRaw(url: string, owner: string, repo: string): string {
  return url
    .replace(`github.com/${owner}/${repo}/blob/`, `raw.githubusercontent.com/${owner}/${repo}/`)
    .replace(`github.com/${owner}/${repo}/raw/`, `raw.githubusercontent.com/${owner}/${repo}/`);
}
function resolveImageUrl(src: string, owner: string, repo: string, branch: string): string {
  const s = src.trim().replace(/^\.\//, "");
  if (/^https?:\/\//i.test(s)) return toRaw(s, owner, repo);
  if (s.startsWith("/")) return toRaw(`https://github.com${s}`, owner, repo);
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${s}`;
}
function extractImages(md: string): string[] {
  const urls: string[] = [];
  const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const htmlRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = mdRe.exec(md))) urls.push(m[1]);
  while ((m = htmlRe.exec(md))) urls.push(m[1]);
  return urls;
}
function isBadge(u: string): boolean {
  return /shields\.io|badge|forthebadge|badgen|travis|circleci|codecov|licen[cs]e|\/button/i.test(u);
}

async function fetchRepoImages(
  owner: string,
  repo: string,
): Promise<{ branch: string; images: string[] }> {
  let branch = "main";
  const meta = await fetch(`${GH}/repos/${owner}/${repo}`, { headers: ghHeaders() });
  if (meta.ok) branch = (await meta.json()).default_branch ?? "main";

  let readme = "";
  const r = await fetch(`${GH}/repos/${owner}/${repo}/readme`, { headers: ghHeaders() });
  if (r.ok) {
    const j = await r.json();
    if (j.content) readme = Buffer.from(j.content, "base64").toString("utf-8");
  }
  const images = extractImages(readme)
    .map((s) => resolveImageUrl(s, owner, repo, branch))
    .filter((u) => !isBadge(u))
    .filter((u, i, arr) => arr.indexOf(u) === i)
    .slice(0, 8);
  return { branch, images };
}

async function uploadImage(
  client: SupabaseClient,
  imgUrl: string,
  folder: string,
): Promise<string | null> {
  try {
    const r = await fetch(imgUrl);
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") ?? "image/png";
    if (!ct.startsWith("image/")) return null;
    const ab = await r.arrayBuffer();
    const ext = (imgUrl.split(".").pop() ?? "png").split(/[?#]/)[0].slice(0, 5) || "png";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await client.storage
      .from("projects")
      .upload(path, new Uint8Array(ab), { contentType: ct, upsert: true });
    if (error) return null;
    return client.storage.from("projects").getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}

// --- Données ----------------------------------------------------------------
const PROFILE = {
  full_name: "Mouhamed Rassoul Niang",
  title: "Développeur Full-Stack",
  location: "Rufisque, Dakar, Sénégal",
  email: "momo546n@gmail.com",
  phone: "+221 78 405 13 45",
  github_url: "https://github.com/momo546n-pixel",
  bio: [
    "Jeune développeur full-stack sérieux, autonome et motivé, diplômé d'une Licence en Télécommunications et Informatique (mention Assez Bien) à l'ESMT.",
    "Expérience concrète en entreprise avec la conception de GerTrack, une plateforme web de gestion des stocks, des achats et des opérations, ainsi qu'en administration système et réseau.",
    "Langues : Français (courant), Wolof (langue maternelle), Anglais (intermédiaire), Espagnol (notions).",
  ].join("\n"),
};

const SKILLS: { category: string; name: string }[] = [
  { category: "development", name: "Python / Django" },
  { category: "development", name: "Java (POO, Java EE, SOA)" },
  { category: "development", name: "JavaScript" },
  { category: "development", name: "HTML / CSS" },
  { category: "development", name: "PHP" },
  { category: "development", name: "Langage C" },
  { category: "development", name: "WordPress" },
  { category: "development", name: "Développement mobile & web mobile" },
  { category: "data_design", name: "Bases de données (réparties)" },
  { category: "data_design", name: "MERISE / UML" },
  { category: "data_design", name: "Méthodes Agiles" },
  { category: "data_design", name: "Git / GitHub" },
  { category: "systems_networks", name: "Réseaux (routage, commutation, WAN)" },
  { category: "systems_networks", name: "Administration Linux / Unix" },
  { category: "systems_networks", name: "Virtualisation & cloud computing" },
  { category: "systems_networks", name: "Kali Linux / VirtualBox" },
  { category: "systems_networks", name: "Sécurité des applications web" },
];

const EXPERIENCES = [
  {
    role: "Développeur stagiaire",
    company: "Gertech Energies et Services SAS",
    location: "Sénégal",
    period: "2026 · 2 mois (stage de fin de licence)",
    description:
      "Conception et développement de GerTrack (gestion des stocks, des achats et des opérations) : analyse des besoins métier, modélisation des données et développement full-stack (back-end, base de données, interface).",
    display_order: 0,
  },
  {
    role: "Stagiaire",
    company: "Ministère des Finances et du Budget — Service Informatique",
    location: "Sénégal",
    period: "2025 · 2 mois",
    description:
      "Administration système et réseau, gestion de domaines en environnement virtualisé (VirtualBox, Kali Linux) et initiation à la sécurité informatique.",
    display_order: 1,
  },
];

const EDUCATION = [
  {
    title: "Licence en Télécommunications et Informatique",
    institution: "ESMT — option Développement d'Applications Réparties",
    year: "2026",
    type: "formation",
    mention: "Mention Assez Bien",
    display_order: 0,
  },
  {
    title: "Baccalauréat S2",
    institution: "Complexe Scolaire El Hadji I. Niass",
    year: "2023",
    type: "formation",
    mention: null,
    display_order: 1,
  },
  {
    title: "Formation en anglais",
    institution: "Dakar English Language Center (DELC)",
    year: "2021",
    type: "formation",
    mention: null,
    display_order: 2,
  },
  {
    title: "CCNA : Switching, Routing and Wireless Essentials",
    institution: "Cisco Academy",
    year: "2025",
    type: "certification",
    mention: null,
    display_order: 0,
  },
  {
    title: "CCNAv7 : Introduction aux réseaux",
    institution: "Cisco Academy",
    year: "2024",
    type: "certification",
    mention: null,
    display_order: 1,
  },
];

const PROJECTS = [
  {
    owner: "momo546n-pixel",
    repo: "Gertrack",
    slug: "gertrack",
    title: "GerTrack",
    summary:
      "Plateforme web de gestion des achats, des stocks et des opérations, conçue en entreprise chez Gertech Energies.",
    description: `GerTrack est une plateforme web de gestion des achats, des stocks et des opérations, conçue et développée lors de mon stage de fin de licence chez Gertech Energies et Services.

## Objectif
Centraliser et fiabiliser le cycle achats → logistique → stock → exécution financière, avec un suivi budgétaire par projet et des contrôles métier stricts.

## Fonctionnalités clés
- Demandes d'achat avec circuit de validation (DOP/DG) et gestion de l'urgence
- Workflow logistique configurable avec suivi des délais
- Budgets par projet et budget annuel, blocage automatique en cas de dépassement
- Exécution financière séparée de la réception entrepôt, protégée contre les doubles saisies
- Stock multi-entrepôts et notifications en temps réel (Django Channels)
- Génération de PDF (bons de commande, rapports) et journal d'audit
- Permissions par rôle appliquées côté serveur et côté client`,
    tech: [
      "Python",
      "Django",
      "Django REST Framework",
      "Django Channels",
      "PostgreSQL",
      "React",
      "JWT",
    ],
    github_url: "https://github.com/momo546n-pixel/Gertrack",
    demo_url: "",
    featured: true,
    display_order: 0,
  },
  {
    owner: "momo546n-pixel",
    repo: "Elisa-glam-Co",
    slug: "elisa-glam-co",
    title: "Elisa'glam&Co",
    summary:
      "Boutique e-commerce mobile-first pour une marque de maroquinerie, administrable en français via Payload CMS.",
    description: `Boutique e-commerce mobile-first pour une marque de maroquinerie premium sénégalaise, entièrement administrable en français.

## Fonctionnalités clés
- Vitrine : accueil, pages collections et fiches produits
- Administration via Payload CMS (produits, contenus, réglages)
- Paiement via PayDunya (Wave, Orange Money) derrière une couche d'abstraction
- Codes promo, script de données de démonstration et tests end-to-end (Playwright)
- Documentation en français : guide admin, maintenance et sauvegardes`,
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Payload CMS",
      "PostgreSQL",
      "PayDunya",
      "Playwright",
    ],
    github_url: "https://github.com/momo546n-pixel/Elisa-glam-Co",
    demo_url: "",
    featured: true,
    display_order: 1,
  },
  {
    owner: "momo546n-pixel",
    repo: "partieveridique",
    slug: "parti-veridique",
    title: "Parti Véridique",
    summary:
      "Site vitrine d'un parti politique et d'une campagne municipale, avec back-office de gestion de contenu.",
    description: `Site vitrine d'un parti politique et de la campagne municipale d'un candidat, avec un back-office de gestion de contenu.

## Fonctionnalités clés
- Pages publiques : accueil, priorités du programme, présentation du parti, actualités, galerie, contact et adhésion
- Back-office protégé (/admin) pour gérer les actualités, les contributions, les messages et les sympathisants
- Données et authentification gérées avec Supabase`,
    tech: ["Next.js", "React", "Tailwind CSS", "Supabase", "TypeScript"],
    github_url: "https://github.com/momo546n-pixel/partieveridique",
    demo_url: "",
    featured: false,
    display_order: 2,
  },
  {
    owner: "momo546n-pixel",
    repo: "AfriConnect",
    slug: "africonnect",
    title: "AfriConnect",
    summary:
      "Réseau social professionnel panafricain : profils, publications, connexions et messagerie en temps réel.",
    description: `Application web full-stack inspirée de LinkedIn, pensée pour connecter les professionnels en Afrique et faciliter l'accès aux opportunités locales.

## Fonctionnalités clés
- Inscription et connexion sécurisées (JWT, bcrypt)
- Profils (photo, bio, compétences, expériences) et fil de publications (likes, commentaires)
- Connexions entre membres et messagerie privée en temps réel (Socket.io)
- Tableau de bord, suggestions de profils et interface d'administration`,
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io", "JWT"],
    github_url: "https://github.com/momo546n-pixel/AfriConnect",
    demo_url: "",
    featured: false,
    display_order: 3,
  },
];

// --- Seed -------------------------------------------------------------------
const ALL = "00000000-0000-0000-0000-000000000000";

async function wipe() {
  console.log("🧹 Nettoyage du contenu existant…");
  await admin.from("projects").delete().neq("id", ALL); // cascade -> project_images
  await admin.from("skills").delete().neq("id", ALL);
  await admin.from("experiences").delete().neq("id", ALL);
  await admin.from("education").delete().neq("id", ALL);
  await admin.from("profile").delete().neq("id", ALL);
}

async function seedProfile() {
  console.log("👤 Profil…");
  let cvUrl: string | null = null;
  try {
    const cvPath = fileURLToPath(new URL("./assets/cv.pdf", import.meta.url));
    const buf = readFileSync(cvPath);
    const { error } = await admin.storage
      .from("cv")
      .upload("CV_Mouhamed_Rassoul_Niang.pdf", buf, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (!error) {
      cvUrl = admin.storage.from("cv").getPublicUrl("CV_Mouhamed_Rassoul_Niang.pdf").data
        .publicUrl;
      console.log("   ✓ CV téléversé");
    }
  } catch {
    console.log("   ⚠ CV non trouvé (supabase/seed/assets/cv.pdf), ignoré.");
  }
  const { error } = await admin.from("profile").insert({ ...PROFILE, cv_url: cvUrl });
  if (error) throw error;
}

async function seedSkills() {
  console.log("🛠  Compétences…");
  const rows = SKILLS.map((s, i) => ({ ...s, display_order: i }));
  const { error } = await admin.from("skills").insert(rows);
  if (error) throw error;
}

async function seedExperiences() {
  console.log("💼 Expériences…");
  const { error } = await admin.from("experiences").insert(EXPERIENCES);
  if (error) throw error;
}

async function seedEducation() {
  console.log("🎓 Formation & certifications…");
  const { error } = await admin.from("education").insert(EDUCATION);
  if (error) throw error;
}

async function seedProjects() {
  console.log("📦 Projets (descriptions + captures GitHub)…");
  for (const p of PROJECTS) {
    console.log(`   → ${p.title}`);
    const { images } = await fetchRepoImages(p.owner, p.repo);
    const stored: string[] = [];
    for (const img of images) {
      const url = await uploadImage(admin, img, `seed/${p.repo}`);
      if (url) stored.push(url);
    }
    console.log(`     ${stored.length} capture(s) copiée(s)`);

    const { data, error } = await admin
      .from("projects")
      .insert({
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        description: p.description,
        tech: p.tech,
        github_url: p.github_url,
        demo_url: p.demo_url || null,
        cover_image_url: stored[0] ?? null,
        status: "published",
        featured: p.featured,
        display_order: p.display_order,
      })
      .select()
      .single();
    if (error || !data) throw error ?? new Error("Insertion projet échouée");

    const gallery = stored.slice(1);
    if (gallery.length) {
      const rows = gallery.map((image_url, i) => ({
        project_id: (data as { id: string }).id,
        image_url,
        caption: null,
        display_order: i,
      }));
      const { error: gErr } = await admin.from("project_images").insert(rows);
      if (gErr) throw gErr;
    }
  }
}

async function main() {
  console.log("\n🌱 Seed du portfolio — démarrage\n");
  await wipe();
  await seedProfile();
  await seedSkills();
  await seedExperiences();
  await seedEducation();
  await seedProjects();
  console.log("\n✅ Seed terminé avec succès.\n");
}

main().catch((e) => {
  console.error("\n❌ Erreur pendant le seed :", e?.message ?? e, "\n");
  process.exit(1);
});
