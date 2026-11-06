"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Basculer entre le thème clair et sombre"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border transition-all duration-200 hover:-rotate-12 hover:bg-muted active:scale-90",
        className ?? "border-border text-foreground",
      )}
    >
      {/* Avant le montage, on évite un décalage d'hydratation */}
      {mounted ? (
        <span key={isDark ? "sun" : "moon"} className="inline-flex">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </span>
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
