"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Wrench,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/profil", label: "Profil", icon: User },
  { href: "/admin/competences", label: "Compétences", icon: Wrench },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="border-b border-border bg-card md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex flex-col gap-1 p-4 md:sticky md:top-0 md:h-screen">
        <div className="mb-4 px-2">
          <p className="font-semibold">Administration</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {LINKS.map((l) => {
            const active = l.exact
              ? pathname === l.href
              : pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
