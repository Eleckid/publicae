# Publicae — Mockup UI/UX

Refonte UI/UX de la plateforme [Publicae / NWO Capital](https://nwo.capital) sous forme de mockup statique fonctionnel.

## Stack

- **HTML5** — 6 pages (Feed, Dashboard, Earnings, Profile, Staking, Settings)
- **Tailwind CSS v4** — via CDN (`@tailwindcss/browser@4`)
- **JavaScript vanilla** — zero framework, zero build step
- **Donnees mock** — `store.js` (source unique), `mock-api.js` (latence simulee)

## Problemes resolus

| # | Severite | Probleme | Solution |
|---|----------|----------|----------|
| 1 | P0 | Balance $STATE incoherente entre pages | `store.balance.total` = source unique, lue partout |
| 2 | P0 | Valeurs negatives airdrops | `airdrops: 0` dans le store |
| 3 | P0 | 4+ systemes de navigation incompatibles | 1 sidebar + 1 topbar via `components.js` |
| 5 | P1 | 3 menus differents | Navigation sidebar unifiee |
| 6 | P1 | Indicateur "online" intermittent | Compteur present dans la sidebar sur toutes pages |
| 7 | P1 | Etat wallet inconsistant | Wallet info dans sidebar, source unique |

## Deploiement Netlify

### Option A — Drag & Drop
1. Zipper tout le dossier `publicae/`
2. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
3. Deposer le zip

### Option B — Git
1. Push le repo sur GitHub
2. Connecter le repo a Netlify
3. Publish directory : `.` (racine)

Le fichier `netlify.toml` configure automatiquement les headers CSP et le redirect racine.

## Architecture

```
publicae/
├── index.html              ← Feed (Public Square)
├── dashboard.html          ← Dashboard widgets
├── earnings.html           ← Mes Gains + breakdown
├── profile.html            ← Profil utilisateur
├── staking.html            ← Staking $STATE
├── settings.html           ← Parametres
├── netlify.toml            ← Config Netlify (CSP + redirects)
├── assets/
│   ├── css/global.css      ← Fonts, animations, utilitaires
│   ├── js/
│   │   ├── utils.js        ← Helpers (sanitize, format, DOM)
│   │   ├── store.js        ← Source unique de verite (mock data)
│   │   ├── mock-api.js     ← API simulee avec latence
│   │   ├── components.js   ← Sidebar, TopBar, PostCard, etc.
│   │   ├── router.js       ← Navigation + mobile menu
│   │   ├── feed.js         ← Logique Feed
│   │   ├── dashboard.js    ← Logique Dashboard
│   │   ├── earnings.js     ← Logique Earnings
│   │   ├── profile.js      ← Logique Profile
│   │   ├── staking.js      ← Logique Staking
│   │   └── settings.js     ← Logique Settings
│   └── img/
│       ├── logo.svg
│       ├── avatar-default.svg
│       └── empty-state.svg
├── audit-en.html           ← Rapport d'audit (EN)
└── audit-fr.html           ← Rapport d'audit (FR)
```

## Design System

| Token | Hex | Usage |
|-------|---------|-------|
| `bg` | #000000 | Fond global |
| `card` | #111111 | Cards |
| `card-alt` | #1a1a1a | Cards secondaires, inputs |
| `accent` | #00ff00 | CTA, $STATE, liens actifs |
| `white` | #ffffff | Texte principal |
| `gray` | #888888 | Texte secondaire |
| `error` | #ff4444 | Erreurs |
| `warning` | #ff8800 | Alertes |

**Polices** : Inter (corps) + JetBrains Mono (titres, valeurs, adresses)

## Securite

- Zero `innerHTML` avec donnees utilisateur — tout passe par `sanitize()`
- CSP configuree dans `netlify.toml`
- Pas de dependances externes risquees
- Donnees 100% fictives (aucune donnee personnelle)
