# Audit UI/UX — Publicae (nwo.capital) & AR World Explorer

**Date** : 2026-03-05
**Auditeur** : Steph (assisté par Claude)
**Plateforme** : https://nwo.capital/webapp/index.php
**AR World** : https://pblcnft-claim.onrender.com/arworld.php

---

## 1. Plateforme Publicae — Résumé des problèmes

### P0 — Critiques (bloquants)

| # | Problème | Impact | Solution proposée |
|---|----------|--------|-------------------|
| 1 | **Solde $STATE incohérent entre pages** | L'utilisateur voit des valeurs différentes sur Feed, Dashboard et Earnings | Source unique de vérité (`store.js`) lue par toutes les pages |
| 2 | **Valeurs négatives dans les airdrops** | Montants négatifs affichés (-500M $STATE) | Minimum 0, tooltip explicatif |
| 3 | **4+ systèmes de navigation différents** | Chaque page a son propre header/nav, aucune cohérence | Sidebar + TopBar unifiés, composants partagés |
| 14 | **NFT claiming cassé** (AR World) | Voir section 3 ci-dessous — 2 bugs critiques identifiés | Corrections backend nécessaires |

### P1 — Majeurs

| # | Problème | Impact |
|---|----------|--------|
| 4 | Pas de loading states (skeletons) | L'interface semble gelée pendant le chargement |
| 5 | Responsive cassé sur mobile (<390px) | Layout déborde, éléments superposés |
| 6 | Aucun feedback utilisateur (toasts) | Actions sans confirmation visuelle |
| 7 | Navigation clavier inexistante | Pas de focus ring, pas de skip-nav, tabs non navigables |
| 8 | Contrastes insuffisants (22 éléments) | Textes gris/30 sur fond noir = ratio <1.5:1 |
| 9 | Typographie incohérente | Mix de polices et tailles sans système |

### P2 — Mineurs

| # | Problème | Impact |
|---|----------|--------|
| 10 | Pas de dark/light mode toggle | Mineur, le dark est l'identité |
| 11 | Images non lazy-loaded | Performance sur mobile |
| 12 | Pas de gestion d'état vide | Aucun message quand il n'y a pas de posts |
| 13 | Duplication de code inter-pages | Maintenance difficile |
| 15 | Sidebar sans collapse | Gaspillage d'espace sur petit desktop |
| 16 | Pas de search fonctionnel | Barre de recherche absente ou non fonctionnelle |

---

## 2. Corrections appliquées dans le mockup

Le fichier `feed-composer-3.html` démontre toutes les corrections suivantes :

### Navigation unifiée
- **Sidebar collapsible** (240px ↔ 64px) avec icônes, labels, wallet status, online count
- **TopBar** : breadcrumb dynamique, search bar desktop, avatar menu avec dropdown
- **Mobile drawer** : hamburger → panneau glissant avec navigation complète
- **Bottom nav mobile** : 5 onglets (Feed, Dash, Earn, Stake, Me)

### Cohérence des données
- Source unique `store.js` avec `balance.total = 409.7B $STATE`
- Même valeur affichée dans : sidebar, topbar mobile, drawer, dropdown avatar

### Contrastes corrigés (22 éléments)
- Engagement bar : `text-gray/30` → `text-gray/60` (ratio 1.1:1 → 3.2:1)
- Timestamps : `text-gray/25 text-[9px]` → `text-gray/60 text-[10px]`
- @usernames : `text-gray/30 text-[9px]` → `text-gray/60 text-[10px]`
- Tabs inactifs : `text-gray/40` → `text-gray/60`
- Bottom nav : `text-gray/50 text-[9px]` → `text-gray/70 text-[10px]`
- Modal close, comments heading, borders, char count, etc.

### Notifications
- Badge rouge sur l'avatar avec compteur (remplace la cloche isolée)
- Dropdown avatar avec mini-profil + 8 notifications mock :
  - Like, Follow, Tip $STATE, Comment, System alert, Mention, Milestone
  - Indicateurs non-lu (dots verts), "Mark all read"
  - Quick actions : My Profile, Settings, Disconnect Wallet

### Layout amélioré
- **Mode masonry** (grille) : 3 colonnes desktop, 2 tablette, 1 mobile
- **Mode single-column** (Twitter/X) : feed 600px + panel droit sticky avec :
  - Who to Follow (3 suggestions)
  - Trending (5 hashtags)
  - Your Week (stats hebdo)
- Tabs sticky au scroll (`sticky top-14 z-20 bg-bg/80 backdrop-blur-lg`)
- Section Trending masquée (à réactiver quand les données seront réelles)

### Composer (FAB)
- Floating Action Button vert avec glow animation
- Modal glass pour composer un post (avatar, textarea, media buttons, char count)
- Fermeture : Escape, clic backdrop, bouton close

### Accessibilité
- Skip-nav link
- ARIA : `aria-label`, `aria-expanded`, `aria-haspopup`, `aria-current`
- Focus ring vert visible
- Navigation clavier : Tab, Enter, Escape (modals/dropdown)

---

## 3. AR World Explorer — Audit NFT Claim

### Contexte
Application de jeu AR permettant de gagner des NFT en se déplaçant physiquement vers des points GPS. URL : https://pblcnft-claim.onrender.com/arworld.php

### Bug #1 — NFTs réclamés toujours affichés comme disponibles (P0)

**Constat** : La carte affiche 21 732 points NFT. Tous les markers sont verts (= disponibles). Aucun marker bleu (= réclamé) visible, même pour les NFT effectivement réclamés par l'utilisateur.

**Cause probable** : L'API `/api/get-nft-drops.php` retourne `isClaimed: false` pour TOUS les drops. Le backend ne met pas à jour le flag `isClaimed` après un claim réussi, ou ne filtre pas par wallet.

**Code côté client** (fonctionnel) :
```javascript
const marker = L.circleMarker([dropLat, dropLng], {
    fillColor: isClaimed ? '#00aaff' : '#00ff00',  // Bleu si claim, Vert si dispo
});
```

**Impact** : Les utilisateurs ne peuvent pas distinguer les NFT déjà réclamés de ceux disponibles → tentatives de claim répétées, frustration.

**Fix requis** : Backend — mettre à jour `isClaimed = true` dans la base de données lors d'un claim, ET filtrer par wallet dans l'API.

### Bug #2 — Connexion wallet ne montre pas les NFTs réclamés (P0)

**Constat** : Le bouton "My NFTs" affiche "Please install MetaMask" au lieu d'ouvrir la connexion wallet. Même si MetaMask est installé, l'API sous-jacente est cassée.

**Cause** : L'endpoint `/api/get-user-nfts.php` retourne une erreur serveur :
```json
{"success": false, "error": "Server error"}
```
Code HTTP 200 mais contenu = erreur. Probable bug PHP (requête SQL, connexion DB, ou paramètre manquant).

**Impact** : Impossible de consulter sa collection de NFT réclamés via l'inventaire.

**Fix requis** : Backend — debugger `/api/get-user-nfts.php`, vérifier la requête SQL wallet → NFTs.

### Bug #3 — Solde $STATE non affiché (P1)

**Constat** : La page gameplay affiche "Install MetaMask" à la place du solde $STATE.

**Cause** : `fetchSTATEBalance()` échoue silencieusement quand MetaMask n'est pas détecté ou quand `window.ethereum` n'est pas disponible.

**Fix** : Afficher un fallback ("Connect wallet to view balance") au lieu de "Install MetaMask".

### Bug #4 — Champ de formulaire sans attribut ID (P2)

**Constat** : Console warning — le champ de recherche sur la page gameplay n'a pas d'attribut `id` ou `name`.

**Fix** : Ajouter `id="search-location"` et `name="search"` au champ input.

### Endpoints API testés

| Endpoint | Status | Réponse | Problème |
|----------|--------|---------|----------|
| `/api/get-nft-drops.php` | OK | 21 732 drops, `isClaimed: false` partout | Flag non mis à jour |
| `/api/get-user-nfts.php` | ERREUR | `{"success":false,"error":"Server error"}` | Bug PHP backend |
| Tuiles CartoDB | OK | Chargement normal | — |
| Nominatim (search) | OK | Géocodage fonctionnel | — |

### Points positifs
- Interface carte propre avec Leaflet
- Design dark cohérent avec la plateforme principale
- Gestion de la précision GPS (drift toléré)
- Système de tiers (Bronze/Silver/Gold/Diamond)
- Restrictions mobile pour l'AR (intentionnel et documenté)
- Headers sécurité correctement configurés (CORS, XSS protection, SameSite cookies)

---

## 4. Recommandations prioritaires

### Pour Ciprian — Actions immédiates

1. **[Backend] Fixer `/api/get-user-nfts.php`** — L'endpoint retourne une erreur serveur, empêchant l'affichage de l'inventaire NFT
2. **[Backend] Mettre à jour `isClaimed` dans get-nft-drops** — Les NFT réclamés doivent apparaître en bleu sur la carte
3. **[Frontend] Adopter le design system unifié** — Le mockup `feed-composer-3.html` démontre la direction : sidebar unique, topbar cohérente, composants partagés
4. **[Architecture] Migrer vers un framework** — La duplication de code entre pages rend la maintenance quasi-impossible. Recommandation : React ou Vue.js avec un state management (Redux/Pinia)

### Pour le mockup — Prochaines étapes

Si Ciprian valide la direction :
1. Décliner les 5 autres pages (Dashboard, Earnings, Profile, Staking, Settings) à partir du même design system
2. Extraire les composants partagés dans des fichiers séparés (`components.js`, `store.js`)
3. Ajouter les pages manquantes (Leaderboard, Wallet details)
4. Intégrer les données réelles via API une fois le backend stabilisé

---

## 5. Fichiers livrés

| Fichier | Description |
|---------|-------------|
| `feed-composer-3.html` | **Page Feed finale** — Mockup complet avec toutes les corrections |
| `AUDIT.md` | Ce document — audit complet plateforme + AR World |
| `README.md` | Documentation du projet et instructions déploiement |
| `blackpaper.pdf` | Whitepaper du projet (référence) |

---

*Audit réalisé le 2026-03-05. Toutes les observations sont basées sur l'état de la plateforme à cette date.*
