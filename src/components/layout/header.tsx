"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", id: "accueil", label: "Accueil" },
  { href: "/#a-propos", id: "a-propos", label: "À propos" },
  { href: "/#portfolio", id: "portfolio", label: "Portfolio" },
  { href: "/#contact", id: "contact", label: "Contact" },
];

export function Header({
  name = "Mouhamed R. Niang",
  initials = "MN",
}: {
  name?: string;
  initials?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("accueil");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section active au défilement (uniquement sur la page unique).
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  // En haut de page, le header est posé sur un bandeau sombre -> texte clair.
  const light = !scrolled;
  const isActive = (id: string) => pathname === "/" && activeId === id;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "group flex items-center gap-2 font-semibold transition-colors",
            light ? "text-white" : "text-foreground",
          )}
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-sm font-bold text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            {initials}
          </span>
          <span className="hidden whitespace-nowrap lg:inline">{name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.id);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95",
                  light
                    ? active
                      ? "font-semibold text-white"
                      : "text-white/70 hover:text-white"
                    : active
                      ? "font-semibold text-accent"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle
            className={
              light ? "border-white/25 text-white hover:bg-white/10" : undefined
            }
          />
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden",
              light ? "border-white/25 text-white" : "border-border text-foreground",
            )}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => {
              const active = isActive(item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-3 text-sm",
                    active
                      ? "font-semibold text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
