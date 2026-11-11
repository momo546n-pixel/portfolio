"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { inputCls } from "@/components/admin/form";
import { Trash2, ArrowUp, ArrowDown, Plus, Briefcase } from "lucide-react";

export function ExperiencesManager({ initial }: { initial: Experience[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Experience[]>(initial);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;
    setBusy(true);
    setError(null);
    const { data, error: dbError } = await supabase
      .from("experiences")
      .insert({
        role: role.trim(),
        company: company.trim(),
        display_order: items.length,
      })
      .select()
      .single();
    if (dbError || !data) {
      setError("Ajout impossible. Vérifiez votre connexion.");
      setBusy(false);
      return;
    }
    setItems((p) => [...p, data as Experience]);
    setRole("");
    setCompany("");
    setBusy(false);
  }

  async function persist(id: string, patch: Partial<Experience>) {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    await supabase.from("experiences").update(patch).eq("id", id);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette expérience ?")) return;
    setItems((p) => p.filter((x) => x.id !== id));
    await supabase.from("experiences").delete().eq("id", id);
  }

  async function move(id: string, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((x) => x.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await Promise.all([
      persist(id, { display_order: swap.display_order }),
      persist(swap.id, { display_order: sorted[idx].display_order }),
    ]);
  }

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6">
      <form
        onSubmit={add}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">Poste</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ex. Stagiaire, Développeur web…"
            className={inputCls}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">Entreprise</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Ex. Sonatel, FreeLance…"
            className={inputCls}
          />
        </div>
        <Button type="submit" disabled={busy}>
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </form>

      {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}

      {!sorted.length && (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucune expérience pour le moment.
        </p>
      )}

      <ul className="space-y-3">
        {sorted.map((x, i) => (
          <li
            key={x.id}
            className="rounded-md border border-border bg-card p-3"
          >
            <div className="flex items-start gap-2">
              <Briefcase className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Poste
                  </label>
                  <input
                    value={x.role}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((y) => (y.id === x.id ? { ...y, role: e.target.value } : y)),
                      )
                    }
                    onBlur={(e) => persist(x.id, { role: e.target.value.trim() })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Entreprise
                  </label>
                  <input
                    value={x.company}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((y) => (y.id === x.id ? { ...y, company: e.target.value } : y)),
                      )
                    }
                    onBlur={(e) => persist(x.id, { company: e.target.value.trim() })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Lieu
                  </label>
                  <input
                    value={x.location ?? ""}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((y) =>
                          y.id === x.id ? { ...y, location: e.target.value } : y,
                        ),
                      )
                    }
                    onBlur={(e) =>
                      persist(x.id, {
                        location: e.target.value.trim() || null,
                      })
                    }
                    placeholder="Ex. Dakar, Sénégal"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Période
                  </label>
                  <input
                    value={x.period ?? ""}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((y) =>
                          y.id === x.id ? { ...y, period: e.target.value } : y,
                        ),
                      )
                    }
                    onBlur={(e) =>
                      persist(x.id, { period: e.target.value.trim() || null })
                    }
                    placeholder="Ex. 2026 · 2 mois"
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={x.description ?? ""}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((y) =>
                          y.id === x.id ? { ...y, description: e.target.value } : y,
                        ),
                      )
                    }
                    onBlur={(e) =>
                      persist(x.id, {
                        description: e.target.value.trim() || null,
                      })
                    }
                    rows={3}
                    placeholder="Missions, responsabilités, résultats…"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(x.id, -1)}
                  disabled={i === 0}
                  aria-label="Monter"
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(x.id, 1)}
                  disabled={i === sorted.length - 1}
                  aria-label="Descendre"
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(x.id)}
                  aria-label="Supprimer"
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        Les modifications sont enregistrées automatiquement (à la sortie du champ).
      </p>
    </div>
  );
}
