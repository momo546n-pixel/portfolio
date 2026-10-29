"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ProjectCard } from "@/components/project-card";
import { TechIcon, techStyle } from "@/components/tech-icon";
import { SKILL_CATEGORIES } from "@/lib/types";
import type { Skill, Project, Education } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  FolderGit2,
  GraduationCap,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "skills", label: "Compétences", icon: Wrench },
  { key: "projects", label: "Projets", icon: FolderGit2 },
  { key: "education", label: "Formations & certifs", icon: GraduationCap },
] as const;

const slide: Variants = {
  enter: (d: number) => ({ x: d >= 0 ? 90 : -90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d >= 0 ? -90 : 90, opacity: 0 }),
};

function Item({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PortfolioTabs({
  skills,
  projects,
  education,
}: {
  skills: Skill[];
  projects: Project[];
  education: Education[];
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);

  const go = (nextIndex: number) => {
    setDir(nextIndex > index ? 1 : -1);
    setIndex(nextIndex);
  };
  const prev = () => go((index - 1 + TABS.length) % TABS.length);
  const next = () => go((index + 1) % TABS.length);

  const formations = education.filter((e) => e.type === "formation");
  const certifications = education.filter((e) => e.type === "certification");
  const sortedProjects = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.display_order - b.display_order,
  );

  return (
    <div className="mt-10">
      <Container>
        {/* Contrôles : flèches gauche/droite + onglets */}
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Entité précédente"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {TABS.map((t, i) => {
              const Icon = t.icon;
              const active = i === index;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => go(i)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors sm:px-4",
                    active
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className={cn(active ? "inline" : "hidden sm:inline")}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Entité suivante"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Panneau coulissant */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={index}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* --- Compétences --- */}
              {index === 0 &&
                SKILL_CATEGORIES.map((cat) => {
                  const items = skills.filter((s) => s.category === cat.value);
                  if (!items.length) return null;
                  return (
                    <div key={cat.value} className="mb-8">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
                        {cat.label}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {items.map((s, i) => {
                          const { color } = techStyle(s.name);
                          return (
                            <Item
                              key={s.id}
                              index={i}
                              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-accent/50"
                            >
                              <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${color}1a` }}
                              >
                                <TechIcon name={s.name} className="h-5 w-5" />
                              </span>
                              <span className="text-sm font-medium leading-tight">
                                {s.name}
                              </span>
                            </Item>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              {/* --- Projets --- */}
              {index === 1 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedProjects.map((p, i) => (
                    <Item key={p.id} index={i}>
                      <ProjectCard project={p} />
                    </Item>
                  ))}
                </div>
              )}

              {/* --- Formations & certifications --- */}
              {index === 2 && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 inline-flex items-center gap-2 font-semibold">
                      <GraduationCap className="h-5 w-5 text-accent" /> Formation
                    </h3>
                    <ul className="space-y-4">
                      {formations.map((e, i) => (
                        <Item
                          key={e.id}
                          index={i}
                          className="rounded-xl border border-border bg-card p-4"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-medium">{e.title}</p>
                            {e.year && (
                              <span className="shrink-0 text-sm text-muted-foreground">
                                {e.year}
                              </span>
                            )}
                          </div>
                          {e.institution && (
                            <p className="text-sm text-muted-foreground">{e.institution}</p>
                          )}
                          {e.mention && (
                            <p className="mt-1 text-sm text-accent">{e.mention}</p>
                          )}
                        </Item>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 inline-flex items-center gap-2 font-semibold">
                      <Award className="h-5 w-5 text-accent" /> Certifications
                    </h3>
                    <ul className="space-y-4">
                      {certifications.map((e, i) => (
                        <Item
                          key={e.id}
                          index={i}
                          className="rounded-xl border border-border bg-card p-4"
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-medium">{e.title}</p>
                            {e.year && (
                              <span className="shrink-0 text-sm text-muted-foreground">
                                {e.year}
                              </span>
                            )}
                          </div>
                          {e.institution && (
                            <p className="text-sm text-muted-foreground">{e.institution}</p>
                          )}
                        </Item>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
