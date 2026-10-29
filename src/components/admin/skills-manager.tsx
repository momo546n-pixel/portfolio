"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  SKILL_CATEGORIES,
  type Skill,
  type SkillCategory,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { inputCls } from "@/components/admin/form";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";

export function SkillsManager({ initial }: { initial: Skill[] }) {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>(initial);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>("development");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    const order = skills.filter((s) => s.category === category).length;
    const { data, error } = await supabase
      .from("skills")
      .insert({ name: name.trim(), category, display_order: order })
      .select()
      .single();
    if (error || !data) {
      setError("Ajout impossible. Vérifiez votre connexion.");
      setBusy(false);
      return;
    }
    setSkills((p) => [...p, data as Skill]);
    setName("");
    setBusy(false);
  }

  async function persist(id: string, patch: Partial<Skill>) {
    setSkills((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    await supabase.from("skills").update(patch).eq("id", id);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette compétence ?")) return;
    setSkills((p) => p.filter((s) => s.id !== id));
    await supabase.from("skills").delete().eq("id", id);
  }

  async function move(id: string, dir: -1 | 1) {
    const current = skills.find((x) => x.id === id);
    if (!current) return;
    const sameCat = skills
      .filter((x) => x.category === current.category)
      .sort((a, b) => a.display_order - b.display_order);
    const idx = sameCat.findIndex((x) => x.id === id);
    const swap = sameCat[idx + dir];
    if (!swap) return;
    await Promise.all([
      persist(id, { display_order: swap.display_order }),
      persist(swap.id, { display_order: current.display_order }),
    ]);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={add}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">Nouvelle compétence</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. React, Django, Linux…"
            className={inputCls}
          />
        </div>
        <div className="sm:w-56">
          <label className="mb-1.5 block text-sm font-medium">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className={inputCls}
          >
            {SKILL_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={busy}>
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </form>

      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}

      {SKILL_CATEGORIES.map((cat) => {
        const items = skills
          .filter((s) => s.category === cat.value)
          .sort((a, b) => a.display_order - b.display_order);
        if (!items.length) return null;
        return (
          <div key={cat.value}>
            <h2 className="mb-3 font-semibold">{cat.label}</h2>
            <ul className="space-y-2">
              {items.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 rounded-md border border-border bg-card p-2"
                >
                  <input
                    value={s.name}
                    onChange={(e) =>
                      setSkills((p) =>
                        p.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)),
                      )
                    }
                    onBlur={(e) => persist(s.id, { name: e.target.value.trim() })}
                    className={inputCls}
                  />
                  <select
                    value={s.category}
                    onChange={(e) =>
                      persist(s.id, { category: e.target.value as SkillCategory })
                    }
                    className="rounded-md border border-input bg-background px-2 py-2 text-sm"
                    aria-label="Catégorie"
                  >
                    {SKILL_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => move(s.id, -1)}
                    disabled={i === 0}
                    aria-label="Monter"
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(s.id, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Descendre"
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    aria-label="Supprimer"
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
