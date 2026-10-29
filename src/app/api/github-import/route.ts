import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const GH = "https://api.github.com";

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-import",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function parseRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
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

function extractImages(markdown: string): string[] {
  const urls: string[] = [];
  const md = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const html = /<img[^>]+src=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = md.exec(markdown))) urls.push(m[1]);
  while ((m = html.exec(markdown))) urls.push(m[1]);
  return urls;
}

function isBadge(u: string): boolean {
  return /shields\.io|badge|forthebadge|badgen|travis|circleci|codecov|licen[cs]e|\/button/i.test(u);
}

function readmeToText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`>|]/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = body.url ? parseRepo(body.url) : null;
  if (!parsed) {
    return NextResponse.json({ error: "URL de dépôt GitHub invalide." }, { status: 400 });
  }
  const { owner, repo } = parsed;

  const repoRes = await fetch(`${GH}/repos/${owner}/${repo}`, { headers: ghHeaders() });
  if (repoRes.status === 404) {
    return NextResponse.json({ error: "Dépôt introuvable (ou privé)." }, { status: 404 });
  }
  if (!repoRes.ok) {
    return NextResponse.json(
      {
        error: `Erreur GitHub (${repoRes.status}). Réessayez plus tard, ou ajoutez un GITHUB_TOKEN dans .env.local.`,
      },
      { status: 502 },
    );
  }
  const repoData = await repoRes.json();
  const branch: string = repoData.default_branch ?? "main";

  let languages: string[] = [];
  const langRes = await fetch(`${GH}/repos/${owner}/${repo}/languages`, { headers: ghHeaders() });
  if (langRes.ok) languages = Object.keys(await langRes.json());

  let readme = "";
  const readmeRes = await fetch(`${GH}/repos/${owner}/${repo}/readme`, { headers: ghHeaders() });
  if (readmeRes.ok) {
    const j = await readmeRes.json();
    if (j.content) readme = Buffer.from(j.content, "base64").toString("utf-8");
  }

  const imgUrls = extractImages(readme)
    .map((s) => resolveImageUrl(s, owner, repo, branch))
    .filter((u) => !isBadge(u))
    .filter((u, i, arr) => arr.indexOf(u) === i)
    .slice(0, 6);

  const stored: string[] = [];
  for (const imgUrl of imgUrls) {
    try {
      const r = await fetch(imgUrl);
      if (!r.ok) continue;
      const ct = r.headers.get("content-type") ?? "image/png";
      if (!ct.startsWith("image/")) continue;
      const ab = await r.arrayBuffer();
      const ext = (imgUrl.split(".").pop() ?? "png").split(/[?#]/)[0].slice(0, 5) || "png";
      const path = `imports/${repo}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("projects")
        .upload(path, new Uint8Array(ab), { contentType: ct, upsert: false });
      if (error) continue;
      stored.push(supabase.storage.from("projects").getPublicUrl(path).data.publicUrl);
    } catch {
      // On ignore une image qui échoue et on continue.
    }
  }

  const text = readmeToText(readme);
  const description = text ? text.slice(0, 1500) : (repoData.description ?? "");
  const tech = Array.from(
    new Set([...languages, ...((repoData.topics as string[]) ?? [])]),
  );

  return NextResponse.json({
    title: repoData.name ?? repo,
    summary: repoData.description ?? "",
    description,
    tech,
    github_url: repoData.html_url ?? `https://github.com/${owner}/${repo}`,
    demo_url: repoData.homepage || "",
    cover_image_url: stored[0] ?? "",
    images: stored.slice(1),
  });
}
