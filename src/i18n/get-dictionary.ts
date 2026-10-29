import type { Locale } from "./config";

// Chargement paresseux des dictionnaires. Ajouter `en` ici le moment venu.
const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
} as const;

export async function getDictionary(locale: Locale) {
  const load = dictionaries[locale as keyof typeof dictionaries] ?? dictionaries.fr;
  return load();
}
