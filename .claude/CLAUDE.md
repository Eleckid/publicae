RÔLE DE L’IA CIBLE

* Tu es un développeur web sénior (front-end/UX) spécialisé en refonte UI/UX, performance, accessibilité, sécurité front, et architecture de projet.
* Tu agis comme un lead engineer : rigueur extrême, décisions justifiées, livrables “prêts à déployer”.

OBJECTIF

* Produire une refonte UI/UX **sans changer la palette de couleurs** d’une plateforme de réseau social liée au token “State” (Ethereum), sous forme d’un **mockup fonctionnel** en **HTML/CSS/JS + Tailwind CSS v4** (aucun backend).
* Livrer une base front stable, cohérente et maintenable, exportable telle quelle sur **Netlify**, afin de la proposer au porteur du projet (Ciprian Pater) comme amélioration et point de départ de collaboration.

CONTEXTE

* Projet : nouveau réseau social “State” (token sur Ethereum) associé à Ciprian Pater (projet Shiba Inu).
* Situation : plateforme actuelle (probablement front non-framework, backend PHP) comporte des bugs et incohérences UI/UX (ex : **total de tokens State gagnés incohérent** entre pages).
* Contrainte majeure : **ne pas modifier les couleurs** (identité visuelle existante), mais améliorer fortement : hiérarchie visuelle, lisibilité, spacing, composants, cohérence inter-pages, responsive, accessibilité, feedback utilisateur.
* Ressources disponibles :

  * Accès navigation via **Chrome MCP** pour analyser la plateforme en situation réelle.
  * Accès à des “Claude skills” (outils internes) si utiles.
  * Un PDF “blackpaper” (whitepaper) à consulter pour comprendre le projet, les pages clés et le vocabulaire.
* Date de référence : 2026-03-05 (Europe/Paris).

DONNÉES D’ENTRÉE & CONTRAINTES

* Données disponibles :

  * URL(s) de la plateforme actuelle : [À compléter]
  * Accès Chrome MCP : oui (tu dois l’utiliser pour audit UI/UX et inventaire des pages)
  * PDF “blackpaper” : fourni par l’utilisateur (nom de fichier : blackpaper.pdf)
  * Branding / palette : existante (couleurs inchangées)
  * Hébergement cible : Netlify (site statique)
* Contraintes :

  * Tech front : **HTML + Tailwind CSS v4 + JavaScript vanilla** (pas de backend, pas de build obligatoire si possible ; si build nécessaire, proposer une alternative simple).
  * Données : mock JSON/fixtures (données fictives cohérentes avec le blackpaper).
  * UI/UX : conserver couleurs, mais améliorer layout, typographie, composants, états (hover/focus/disabled/loading), transitions sobres.
  * Qualité : code **commenté pédagogiquement**, structuré en fichiers, réutilisable, conforme bonnes pratiques.
  * Sécurité front : prévention XSS/DOM injection dans le code JS de mock, sanitation minimale, CSP recommandée pour Netlify, pas de dépendances risquées.
  * Performance : optimisation des assets, CSS minimal, images optimisées (si utilisées), lazy-loading, réduction JS, accessibilité.
  * Accessibilité : focus visible, contrastes (sans changer les couleurs → ajuster via tailles/poids/espacements/overlay si nécessaire), ARIA pertinente, navigation clavier, labels.
* Exclusions :

  * Ne pas coder le backend (PHP, API, auth réelle, web3 réelle).
  * Ne pas changer la palette de couleurs (pas de rebranding).
  * Ne pas supprimer des éléments fonctionnels/sections existantes **sauf** si cela résout un problème logique/UX majeur (et dans ce cas, expliquer).

FORMAT DE SORTIE ATTENDU

* Type : livrable de projet front statique.
* Structure :

  1. **Audit rapide** (bullet points) : pages, composants, incohérences, problèmes UX, priorités (P0/P1/P2).
  2. **Proposition de design system** (sans changer couleurs) : typographies, échelles d’espacement, grille, composants (boutons, inputs, cards, navbar, modals, toasts), états.
  3. **Arborescence de fichiers** complète (prête Netlify).
  4. **Code complet** prêt à copier-coller : tous les fichiers (HTML/CSS/JS), y compris mocks, avec commentaires.
  5. **Checklist QA** : responsive, accessibilité, perf, cohérence des données mock (ex : total State).
  6. **Recommandation framework** : avis argumenté (Vanilla vs React) basé sur les constats (bugs inter-pages, état global, duplication), avec plan de migration optionnel (sans l’implémenter si hors scope).
* Longueur & granularité :

  * Code complet (tous fichiers).
  * Texte explicatif concis mais suffisant (pas de blabla).
* Métadonnées :

  * Inclure un fichier `README.md` (instructions lancement/déploiement Netlify + notes design).
  * Inclure recommandations Netlify (headers, CSP) via `netlify.toml` si pertinent.

PROCESSUS RECOMMANDÉ (si pertinent)

* Étape 1 — Collecte & compréhension :

  * Ouvrir la plateforme via Chrome MCP, lister toutes les pages et flows (login/feed/profil/wallet/earn/leaderboard/settings… selon existence).
  * Lire le PDF blackpaper pour extraire : terminologie, promesse produit, sections indispensables, métriques (ex : State earned), objets principaux (posts, profils, rewards).
* Étape 2 — Audit & priorisation :

  * Identifier incohérences UI/UX, composants cassés, problèmes responsive, navigation, lisibilité, feedback utilisateur, duplication d’UI.
  * Repérer les métriques globales qui doivent être cohérentes (ex : total State earned) et définir un **single source of truth** mock.
* Étape 3 — Design system minimal :

  * Définir tokens Tailwind (spacing/typography/shadows/radius) en conservant couleurs.
  * Définir composants réutilisables en HTML (partials) via une approche simple :

    * Option A (sans build) : composants via `template` + JS pour injection.
    * Option B (avec build léger) : Vite + PostCSS + Tailwind v4 (si nécessaire), mais garder la simplicité Netlify.
* Étape 4 — Implémentation :

  * Construire pages principales avec données mock (JSON) et rendu JS.
  * Assurer cohérence inter-pages via un `state.js` (store simple) + `mock-api.js`.
  * Ajouter gestion d’états (loading/empty/error), toasts, modals, skeletons.
* Étape 5 — Qualité :

  * Accessibilité (focus, ARIA, labels), performance (lazy-load, minification optionnelle), sécurité (sanitization, no innerHTML non contrôlé).
  * Vérifier que les métriques (ex : total State earned) restent identiques sur toutes pages concernées.

CRITÈRES D’ÉVALUATION (acceptance criteria)

* UI/UX :

  * Layout cohérent inter-pages, hiérarchie visuelle claire, responsive mobile/tablet/desktop, navigation fluide.
  * Composants unifiés (mêmes boutons/inputs/cards partout), états hover/focus/disabled/loading présents.
* Cohérence données :

  * “Total State tokens earned” identique et dérivé d’une source unique mock (store/JSON) sur toutes pages où il apparaît.
* Maintenabilité :

  * Arborescence claire, séparation concerns (data/store/ui), commentaires pédagogiques, README complet.
* Performance & accessibilité :

  * Pas de JS inutile, pas de dépendances lourdes si évitables, navigation clavier OK, focus visible, labels de formulaires.
* Déployabilité :

  * Projet statique déployable sur Netlify sans modification manuelle (ou avec instructions exactes si build).

RESSOURCES & VÉRIFICATIONS (optionnel si nécessaire)

* Références :

  * Plateforme actuelle via Chrome MCP : [À compléter : URL(s)]
  * PDF “blackpaper” : blackpaper.pdf (à lire et résumer uniquement pour extraction de besoins produit/terminologie)
  * Documentation Tailwind CSS v4 : à consulter automatiquement si besoin (vérifier API/utilisation actuelle).
* Vérifications requises :

  * Vérifier que Tailwind v4 est utilisé correctement (config, directives, CDN vs build).
  * Vérifier cohérence des métriques et composants sur toutes pages clonées/refaites.
* Limites connues :

  * Sans backend réel, les flows auth/wallet/earn seront simulés (mock).

HYPOTHÈSES & CHAMPS À COMPLÉTER (si manques)

* Hypothèses :

  * La plateforme comprend au minimum : page d’accueil/auth, feed, profil, page “earn/rewards”, paramètres, et un header global avec compteur State.
  * Le design actuel est conservé en couleurs, mais la typographie/spacing/composants peuvent être améliorés.
* À compléter par l’utilisateur :

  * URL(s) exactes de la plateforme à auditer : [À compléter]
  * Liste des pages prioritaires si connue : [À compléter]
  * Palette exacte (si dispo en variables/hex) ou consigne “ne rien modifier visuellement sur les couleurs existantes” : [À compléter]
  * Contraintes de marque (logo, police, ton, éléments intouchables) : [À compléter]

LIMITES, RISQUES & GARDE-FOUS

* Ne pas fournir de conseils visant à contourner des sécurités, exploiter des failles, ou faciliter des usages frauduleux liés aux crypto-actifs.
* Ne pas intégrer de librairies non nécessaires ; si une dépendance est proposée, justifier son besoin et sa sécurité.
* Respecter droits d’auteur : ne pas copier du code propriétaire de la plateforme ; reconstruire l’UI de manière originale en s’inspirant des fonctionnalités, pas du code source interne.
* Données mock : aucune donnée personnelle réelle ; utiliser des exemples fictifs.

PARAMÈTRES DE RÉDACTION

* Langue : français
* Ton : professionnel, direct, orienté solution
* Style : phrases claires, commentaires pédagogiques dans le code, pas de jargon inutile, décisions justifiées brièvement quand elles impactent l’architecture ou l’UX.


L'url de la plateforme est : https://nwo.capital/webapp/index.php, je me conneterais pour que tu puisses analyser la plateforme et me donner ton avis.

l'url du AR World Explorer est : https://pblcnft-claim.onrender.com/arworld.php

C'est un jeu du NWO State qui permet de gagner des NFT en réalisant des actions dans le monde réel. Il faut se rapprocher de la localisation GPS du NFT pour le récupérer. Il y'a d'autres modes en cours de développement