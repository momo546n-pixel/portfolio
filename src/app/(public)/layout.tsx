import { getProfile } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteBackground } from "@/components/site-background";

function initialsOf(name?: string | null) {
  if (!name) return "MN";
  const parts = name.trim().split(/\s+/);
  const letters = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
  return letters.toUpperCase() || "MN";
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const name = profile?.full_name ?? "Portfolio";

  return (
    <>
      <SiteBackground />
      <Header name={name} initials={initialsOf(profile?.full_name)} />
      <main className="flex-1">{children}</main>
      <Footer name={name} email={profile?.email} githubUrl={profile?.github_url} />
    </>
  );
}
