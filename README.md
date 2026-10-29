# Portfolio — Mouhamed Rassoul Niang

Portfolio de développeur full-stack, **professionnel, modifiable et évolutif**, avec un espace **Admin protégé** pour gérer compétences, projets, profil et messages **sans toucher au code**.

- **Stack** : Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (PostgreSQL + Auth + Storage) · déploiement Vercel.
- **Contenu 100 % en base de données** : rien n'est codé en dur dans les pages.
- **Mode clair / sombre**, responsive mobile-first, animations légères, SEO complet.

---

## 1. Ce dont tu as besoin

- [Node.js 20+](https://nodejs.org) (déjà installé si `node -v` affiche `v20` ou plus)
- Un compte **Supabase** (tu l'as déjà) → https://supabase.com
- Un compte **Vercel** (tu l'as déjà) → https://vercel.com
- Le dépôt GitHub du portfolio : **https://github.com/momo546n-pixel/portfolio** (déjà créé)

---

## 2. Installer le projet en local

Dans un terminal, place-toi dans le dossier du projet, puis :

```bash
npm install
```

---

## 3. Créer et configurer le projet Supabase

### 3.1 Créer le projet
1. Va sur https://supabase.com → **New project**.
2. Choisis un nom, un mot de passe de base de données (garde-le), une région proche (ex. *West EU*).
3. Attends la fin de la création (1–2 minutes).

### 3.2 Récupérer les clés
Dans ton projet Supabase : **Settings → API**. Note :
- **Project URL** (ex. `https://abcd1234.supabase.co`)
- **anon public** (clé publique)
- **service_role** (clé secrète — ne la partage jamais)

### 3.3 Exécuter les migrations (création des tables + sécurité + stockage)
Dans Supabase : **SQL Editor → New query**. Copie-colle puis exécute (bouton **Run**) le contenu de ces fichiers, **dans cet ordre** :

1. `supabase/migrations/0001_init.sql`  → les tables
2. `supabase/migrations/0002_rls.sql`   → la sécurité (lecture publique, écriture admin)
3. `supabase/migrations/0003_storage.sql` → les espaces de stockage d'images (`avatars`, `cv`, `projects`)

> Le stockage des images est donc configuré **automatiquement** par la migration 3 : rien d'autre à faire côté Storage.

### 3.4 Créer ton compte admin (le seul)
1. **Authentication → Users → Add user → Create new user**.
2. Mets ton e-mail et un mot de passe solide. Coche « Auto Confirm User » si proposé.
3. **Désactive les inscriptions publiques** : **Authentication → Sign In / Providers** (ou *Settings*) → désactive **Allow new users to sign up** (*Enable Signups* sur OFF). Ainsi, toi seul peux te connecter.

---

## 4. Renseigner les variables d'environnement

À la racine du projet, copie le modèle :

```bash
cp .env.example .env.local
```

Puis ouvre `.env.local` et remplis avec tes valeurs de l'étape 3.2 :

```
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_cle_anon
SUPABASE_SERVICE_ROLE_KEY=ta_cle_service_role
GITHUB_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `.env.local` n'est **jamais** envoyé sur GitHub (il est ignoré). Aucune clé secrète n'est dans le code.

---

## 5. Remplir la base avec tes informations (seed)

Cette commande insère ton profil, tes compétences, tes expériences, ta formation, tes **4 projets** (descriptions + captures d'écran récupérées depuis GitHub) et **téléverse ton CV** :

```bash
npm run seed
```

Tu peux la relancer à tout moment : elle remet le contenu à zéro puis le réinsère (les messages du formulaire ne sont jamais touchés).

---

## 6. Lancer le site en local

```bash
npm run dev
```

- Site public : http://localhost:3000
- Espace admin : http://localhost:3000/admin  (connexion avec ton compte de l'étape 3.4)

---

## 7. Utiliser l'espace Admin

- **Tableau de bord** : vue d'ensemble (projets, compétences, messages).
- **Profil** : texte « À propos », coordonnées, **photo** (remplace les initiales « MN »), **CV PDF**.
- **Compétences** : ajouter / modifier / supprimer, choisir la catégorie, réordonner (flèches).
- **Projets** : créer / modifier / supprimer, image de couverture + galerie (upload), technologies, liens, **statut publié / brouillon**, **mis en avant**, ordre d'affichage.
- **Import GitHub** : dans *Projets → Nouveau*, colle l'URL d'un dépôt → l'app récupère nom, description, langages, liens et captures du README (copiées dans ton stockage Supabase) et pré-remplit le projet. Corrige-le, puis publie.
- **Messages** : consulte les messages du formulaire de contact, marque-les lus / non lus, supprime-les.

---

## 8. Envoyer le code sur GitHub

Le dépôt `momo546n-pixel/portfolio` existe déjà. Depuis le dossier du projet :

```bash
git add .
git commit -m "Portfolio full-stack initial"
git push -u origin main
```

> Au premier `push`, GitHub peut demander de t'authentifier : connecte-toi avec ton compte **momo546n-pixel** (fenêtre du navigateur, ou un *Personal Access Token*). Si besoin, règle ton identité git :
> ```bash
> git config user.name "Mouhamed Rassoul Niang"
> git config user.email "momo546n@gmail.com"
> ```

---

## 9. Déployer sur Vercel

1. Va sur https://vercel.com → **Add New… → Project**.
2. **Import** le dépôt `momo546n-pixel/portfolio`. Vercel détecte Next.js automatiquement.
3. Dans **Environment Variables**, ajoute les mêmes variables qu'en local :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → **l'adresse finale du site** (ex. `https://portfolio-xxx.vercel.app` ou ton domaine)
4. Clique **Deploy**.
5. (Recommandé) Dans Supabase : **Authentication → URL Configuration**, mets ton adresse Vercel dans **Site URL**.
6. À chaque `git push` sur `main`, **Vercel redéploie automatiquement**.

> Le `seed` se lance depuis ton ordinateur (étape 5), pas sur Vercel : il écrit directement dans ta base Supabase, qui est la même en local et en production.

---

## 10. Personnaliser

- **Couleurs & thème** : `src/app/globals.css` (variables `--primary`, `--accent`, `--background`… pour les modes clair et sombre). La couleur de marque anthracite est `#3a3f47`.
- **Police** : Inter (modifiable dans `src/app/layout.tsx`).
- **Sections du menu** : `src/components/layout/header.tsx`.

---

## 11. Structure du projet

```
portfolio/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                 Accueil (toutes les sections)
│  │  ├─ projets/[slug]/          Page détail d'un projet
│  │  ├─ admin/                   Espace admin (login + panneau protégé)
│  │  ├─ api/github-import/       Import d'un dépôt GitHub
│  │  ├─ sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg   (SEO)
│  │  └─ actions/contact.ts       Envoi du formulaire de contact
│  ├─ components/                 sections/ · ui/ · admin/ · layout/
│  ├─ lib/                        supabase/ (clients) · data.ts · types.ts
│  └─ i18n/                       structure prête pour l'anglais
├─ supabase/
│  ├─ migrations/                 0001_init · 0002_rls · 0003_storage
│  └─ seed/                       seed.ts + assets/cv.pdf
├─ middleware.ts                  protège /admin
└─ .env.example
```

---

## 12. Évolutivité

- **Expériences & formation** : les tables `experiences` et `education` existent déjà et s'affichent sur le site. Une interface d'admin dédiée pourra être ajoutée sans refonte (le modèle est en place).
- **Version anglaise (i18n)** : structure posée dans `src/i18n/`. Pour l'activer : ajouter `en.json`, l'enregistrer dans `get-dictionary.ts`, puis (optionnel) introduire un segment de route `[locale]`.
- **Types de base de données** : régénérables via `npx supabase gen types typescript`.

---

## Scripts utiles

| Commande | Rôle |
|---|---|
| `npm run dev` | Lancer en local |
| `npm run build` | Compiler pour la production |
| `npm run start` | Démarrer la version compilée |
| `npm run seed` | Remplir la base avec tes données |
| `npm run type-check` | Vérifier les types TypeScript |
| `npm run lint` | Vérifier le code |
