// Structure i18n posée pour une version anglaise ultérieure.
// Aujourd'hui seul le français est activé. Pour ajouter l'anglais :
//   1. créer src/i18n/dictionaries/en.json (même structure que fr.json)
//   2. l'enregistrer dans get-dictionary.ts
//   3. (optionnel) introduire un segment de route [locale] dans src/app
//   4. ajouter une colonne `locale` aux contenus dynamiques si besoin

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
