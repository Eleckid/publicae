/**
 * components.js — Composants UI partages injectes sur toutes les pages.
 *
 * RESOUT : P0 #3 (4+ layouts incompatibles) => 1 sidebar + 1 topbar unifies
 * RESOUT : P1 #5 (3 menus differents) => 1 navigation unique
 * RESOUT : P1 #6 (indicateur "online" intermittent) => present partout
 * RESOUT : P1 #7 (wallet state incoherent) => affiche dans sidebar, partage
 *
 * Securite : pas de innerHTML avec donnees utilisateur.
 * Les donnees mock (store) sont considerees fiables car controlees.
 */

window.PublicaeComponents = {

  /* ============================================================
     SIDEBAR — Navigation principale unifiee
  ============================================================ */

  /**
   * Genere et injecte la sidebar dans #sidebar-root.
   * @param {string} activePage - Identifiant de la page active (ex: 'feed', 'dashboard')
   */
  renderSidebar(activePage) {
    const store = window.PublicaeStore;
    const utils = window.PublicaeUtils;

    const navLinks = [
      { id: 'feed', label: 'Public Square', href: 'index.html', icon: '&#9776;' },
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '&#9673;' },
      { id: 'profile', label: 'Profile', href: 'profile.html', icon: '&#9786;' },
      { id: 'earnings', label: 'My Earnings', href: 'earnings.html', icon: '&#9733;' },
      { id: 'staking', label: 'Staking', href: 'staking.html', icon: '&#9830;' },
      { id: 'settings', label: 'Settings', href: 'settings.html', icon: '&#9881;' }
    ];

    const externalLinks = [
      { label: 'Exchange', href: '#', icon: '&#8644;' },
      { label: 'Airdrops', href: '#', icon: '&#9733;' },
      { label: 'Launchpad', href: '#', icon: '&#9650;' },
      { label: 'AR World', href: '#', icon: '&#9678;' }
    ];

    const linksHtml = navLinks.map(link => {
      const isActive = link.id === activePage;
      return `
        <a href="${link.href}"
           class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-gray hover:text-white hover:bg-card-alt'}"
           ${isActive ? 'aria-current="page"' : ''}>
          <span class="text-base w-5 text-center">${link.icon}</span>
          <span>${link.label}</span>
        </a>`;
    }).join('');

    const extLinksHtml = externalLinks.map(link => `
      <a href="${link.href}"
         class="flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-gray/60 hover:text-gray transition-colors"
         title="Coming soon">
        <span class="w-5 text-center">${link.icon}</span>
        <span>${link.label}</span>
      </a>`
    ).join('');

    const sidebarHtml = `
      <div class="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-60 bg-card border-r border-border z-40">
        <!-- Logo -->
        <div class="flex items-center gap-2 px-5 py-4 border-b border-border">
          <img src="assets/img/logo.svg" alt="Publicae" class="h-6" />
        </div>

        <!-- Wallet status -->
        <div class="px-4 py-3 border-b border-border">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full ${store.user.wallet.connected ? 'bg-accent animate-glow' : 'bg-error'}"></span>
            <span class="text-xs font-mono text-gray">${store.user.wallet.connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div class="font-mono text-accent text-sm font-bold">${utils.formatCompact(store.balance.total)} $STATE</div>
          <div class="font-mono text-xs text-gray mt-0.5">${utils.truncateAddress(store.user.wallet.address)}</div>
        </div>

        <!-- Nav links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navigation principale">
          ${linksHtml}

          <div class="mt-6 mb-2 px-4">
            <div class="text-[10px] text-gray/40 uppercase tracking-widest font-mono">External</div>
          </div>
          ${extLinksHtml}
        </nav>

        <!-- Online count -->
        <div class="px-4 py-3 border-t border-border">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent"></span>
            <span class="text-xs text-gray"><span class="text-white font-medium">${utils.formatNumber(store.onlineCount)}</span> online</span>
          </div>
        </div>
      </div>

      <!-- Mobile sidebar overlay -->
      <div id="sidebar-overlay" class="lg:hidden fixed inset-0 bg-black/60 z-40 hidden" aria-hidden="true"></div>
      <div id="sidebar-mobile" class="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-50 transform -translate-x-full transition-transform duration-300">
        <!-- Mobile logo + close -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-border">
          <img src="assets/img/logo.svg" alt="Publicae" class="h-6" />
          <button id="sidebar-close-btn" class="text-gray hover:text-white p-1" aria-label="Close menu">
            <span class="text-xl">&times;</span>
          </button>
        </div>

        <!-- Mobile wallet -->
        <div class="px-4 py-3 border-b border-border">
          <div class="font-mono text-accent text-sm font-bold">${utils.formatCompact(store.balance.total)} $STATE</div>
          <div class="font-mono text-xs text-gray">${utils.truncateAddress(store.user.wallet.address)}</div>
        </div>

        <!-- Mobile nav -->
        <nav class="px-3 py-4 space-y-1" aria-label="Navigation principale">
          ${linksHtml}
        </nav>

        <!-- Mobile online -->
        <div class="px-4 py-3 border-t border-border mt-auto">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-accent"></span>
            <span class="text-xs text-gray"><span class="text-white font-medium">${utils.formatNumber(store.onlineCount)}</span> online</span>
          </div>
        </div>
      </div>`;

    document.getElementById('sidebar-root').innerHTML = sidebarHtml;
  },

  /* ============================================================
     TOP BAR — Barre superieure sticky
  ============================================================ */

  /**
   * Genere et injecte la top bar dans #topbar-root.
   * @param {string} pageTitle - Titre de la page courante
   */
  renderTopBar(pageTitle) {
    const store = window.PublicaeStore;
    const utils = window.PublicaeUtils;
    const color = utils.usernameColor(store.user.username);
    const initial = utils.getInitial(store.user.displayName);

    const topBarHtml = `
      <header class="fixed top-0 left-0 right-0 lg:left-60 h-14 bg-bg/80 backdrop-blur-lg border-b border-border z-30 flex items-center justify-between px-4 lg:px-6">
        <!-- Left: hamburger (mobile) + title -->
        <div class="flex items-center gap-3">
          <button id="sidebar-toggle-btn" class="lg:hidden text-gray hover:text-white p-1" aria-label="Open navigation menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="font-mono text-base lg:text-lg font-bold text-white">${utils.sanitize(pageTitle)}</h1>
        </div>

        <!-- Right: $STATE (mobile), notifications, avatar -->
        <div class="flex items-center gap-3">
          <!-- $STATE compact (mobile only) -->
          <div class="lg:hidden font-mono text-xs text-accent font-bold">${utils.formatCompact(store.balance.total)}</div>

          <!-- Notifications bell -->
          <button class="relative text-gray hover:text-white p-1.5 rounded-lg hover:bg-card-alt transition-colors" aria-label="Notifications">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute top-0.5 right-0.5 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          <!-- Avatar -->
          <button class="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Profile menu">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-bg" style="background-color: ${color}">
              ${initial}
            </div>
          </button>
        </div>
      </header>`;

    document.getElementById('topbar-root').innerHTML = topBarHtml;
  },

  /* ============================================================
     POST CARD — Carte de post pour le feed
  ============================================================ */

  /**
   * Genere le HTML d'une carte de post.
   * @param {Object} post - Objet post du store
   * @returns {string} HTML de la carte
   */
  renderPostCard(post) {
    const utils = window.PublicaeUtils;
    const color = utils.usernameColor(post.author.username);
    const initial = utils.getInitial(post.author.displayName);

    const mediaHtml = post.media ? `
      <div class="mt-3 rounded-lg overflow-hidden">
        <img src="${utils.sanitize(post.media.url)}"
             alt="${utils.sanitize(post.media.alt || '')}"
             class="w-full h-auto max-h-80 object-cover"
             loading="lazy" />
      </div>` : '';

    const monetizedBadge = post.isMonetized ? `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/20 mt-2">
        &#9733; +${utils.formatCompact(post.stateEarned)} $STATE
      </span>` : '';

    return `
      <article class="bg-card border border-border rounded-xl p-4 hover-lift animate-fade-in" data-post-id="${utils.sanitize(post.id)}">
        <!-- Header: avatar + username + time -->
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-bg" style="background-color: ${color}">
            ${initial}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-sm text-white">${utils.sanitize(post.author.displayName)}</span>
              <span class="text-xs text-gray">@${utils.sanitize(post.author.username)}</span>
              <span class="text-xs text-gray">&middot;</span>
              <span class="text-xs text-gray">${utils.timeAgo(post.timestamp)}</span>
            </div>
            <p class="text-sm text-gray-light mt-1 leading-relaxed">${utils.sanitize(post.content)}</p>
            ${mediaHtml}
            ${monetizedBadge}
          </div>
        </div>

        <!-- Engagement actions -->
        <div class="flex items-center gap-6 mt-4 pt-3 border-t border-border">
          <button class="flex items-center gap-1.5 text-gray hover:text-red-400 transition-colors text-sm group" data-action="like" data-post-id="${post.id}" aria-label="Like">
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span>${utils.formatCompact(post.engagement.likes)}</span>
          </button>
          <button class="flex items-center gap-1.5 text-gray hover:text-blue-400 transition-colors text-sm group" aria-label="Comment">
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>${utils.formatCompact(post.engagement.comments)}</span>
          </button>
          <button class="flex items-center gap-1.5 text-gray hover:text-accent transition-colors text-sm group" aria-label="Share">
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            <span>${utils.formatCompact(post.engagement.shares)}</span>
          </button>
          <span class="flex items-center gap-1.5 text-gray text-sm ml-auto" aria-label="Views">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <span>${utils.formatCompact(post.engagement.views)}</span>
          </span>
        </div>
      </article>`;
  },

  /* ============================================================
     STAT CARD — Carte KPI pour dashboard/earnings
  ============================================================ */

  /**
   * Genere le HTML d'une carte de statistique.
   * @param {string} label - Label de la stat
   * @param {string} value - Valeur formatee
   * @param {string} subtext - Sous-texte optionnel (trend, etc.)
   * @param {string} accentColor - Couleur d'accent ('accent', 'warning', etc.)
   */
  renderStatCard(label, value, subtext = '', accentColor = 'accent') {
    return `
      <div class="bg-card border border-border rounded-xl p-5 hover-lift">
        <div class="text-xs font-mono text-gray uppercase tracking-wider mb-2">${window.PublicaeUtils.sanitize(label)}</div>
        <div class="font-mono text-2xl font-bold text-${accentColor}">${window.PublicaeUtils.sanitize(value)}</div>
        ${subtext ? `<div class="text-xs text-gray mt-1">${window.PublicaeUtils.sanitize(subtext)}</div>` : ''}
      </div>`;
  },

  /* ============================================================
     SKELETON LOADERS
  ============================================================ */

  /** Genere un skeleton pour une carte de post. */
  renderPostSkeleton() {
    return `
      <div class="bg-card border border-border rounded-xl p-4 animate-skeleton">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-card-alt"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-card-alt rounded w-1/3"></div>
            <div class="h-3 bg-card-alt rounded w-full"></div>
            <div class="h-3 bg-card-alt rounded w-2/3"></div>
          </div>
        </div>
        <div class="flex gap-6 mt-4 pt-3 border-t border-border">
          <div class="h-3 bg-card-alt rounded w-12"></div>
          <div class="h-3 bg-card-alt rounded w-12"></div>
          <div class="h-3 bg-card-alt rounded w-12"></div>
        </div>
      </div>`;
  },

  /** Genere un skeleton pour une carte de stat. */
  renderStatSkeleton() {
    return `
      <div class="bg-card border border-border rounded-xl p-5 animate-skeleton">
        <div class="h-3 bg-card-alt rounded w-1/2 mb-3"></div>
        <div class="h-6 bg-card-alt rounded w-3/4"></div>
      </div>`;
  },

  /** Genere un skeleton generique (card). */
  renderCardSkeleton(height = 'h-40') {
    return `
      <div class="bg-card border border-border rounded-xl p-5 ${height} animate-skeleton animate-shimmer">
        <div class="h-3 bg-card-alt rounded w-1/3 mb-4"></div>
        <div class="h-3 bg-card-alt rounded w-full mb-2"></div>
        <div class="h-3 bg-card-alt rounded w-2/3"></div>
      </div>`;
  },

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  /**
   * Genere un etat vide avec illustration.
   * @param {string} message - Message a afficher
   * @param {string} subtext - Sous-texte optionnel
   */
  renderEmptyState(message, subtext = '') {
    return `
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <img src="assets/img/empty-state.svg" alt="" class="w-32 h-auto mb-6 opacity-50" />
        <p class="text-gray font-medium">${window.PublicaeUtils.sanitize(message)}</p>
        ${subtext ? `<p class="text-gray/60 text-sm mt-2">${window.PublicaeUtils.sanitize(subtext)}</p>` : ''}
      </div>`;
  },

  /* ============================================================
     TOAST NOTIFICATIONS
  ============================================================ */

  /**
   * Affiche une notification toast.
   * @param {string} message - Message du toast
   * @param {'success'|'error'|'info'} type - Type de toast
   * @param {number} duration - Duree en ms avant auto-dismiss (defaut 4000)
   */
  showToast(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-root');
    if (!container) return;

    const colors = {
      success: 'border-accent bg-accent/10 text-accent',
      error: 'border-error bg-error/10 text-error',
      info: 'border-info bg-info/10 text-info'
    };

    const icons = {
      success: '&#10004;',
      error: '&#10006;',
      info: '&#9432;'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[type] || colors.info} text-sm font-medium toast-enter max-w-sm`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${window.PublicaeUtils.sanitize(message)}</span>`;

    container.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /* ============================================================
     MODAL
  ============================================================ */

  /**
   * Affiche une modale.
   * @param {string} title - Titre de la modale
   * @param {string} bodyHtml - Contenu HTML (HTML statique controle, pas de donnees user)
   * @param {Array} actions - Boutons [{label, type, onClick}]
   */
  showModal(title, bodyHtml, actions = []) {
    const modal = document.getElementById('modal-root');
    if (!modal) return;

    const actionsHtml = actions.map(a => {
      const btnClass = a.type === 'primary'
        ? 'bg-accent text-bg font-semibold hover:bg-accent/90'
        : 'bg-card-alt text-white hover:bg-gray-dark';
      return `<button class="${btnClass} px-4 py-2 rounded-lg text-sm transition-colors" data-modal-action="${a.label}">${window.PublicaeUtils.sanitize(a.label)}</button>`;
    }).join('');

    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="modal-backdrop">
        <div class="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="flex items-center justify-between mb-4">
            <h2 id="modal-title" class="font-mono text-lg font-bold text-white">${window.PublicaeUtils.sanitize(title)}</h2>
            <button id="modal-close-btn" class="text-gray hover:text-white text-xl p-1" aria-label="Close">&times;</button>
          </div>
          <div class="text-sm text-gray-light leading-relaxed mb-6">${bodyHtml}</div>
          ${actionsHtml ? `<div class="flex justify-end gap-3">${actionsHtml}</div>` : ''}
        </div>
      </div>`;

    modal.classList.remove('hidden');

    // Close handlers
    const closeModal = () => {
      modal.classList.add('hidden');
      modal.innerHTML = '';
    };

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modal-backdrop') closeModal();
    });

    // Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Action button handlers
    actions.forEach(a => {
      const btn = modal.querySelector(`[data-modal-action="${a.label}"]`);
      if (btn && a.onClick) btn.addEventListener('click', () => {
        a.onClick();
        closeModal();
      });
    });
  },

  /* ============================================================
     TAB BAR — Onglets horizontaux
  ============================================================ */

  /**
   * Genere un tab bar avec support clavier.
   * @param {Array} tabs - [{id, label}]
   * @param {string} activeTab - ID de l'onglet actif
   * @param {Function} onChange - Callback(tabId)
   * @returns {string} HTML du tab bar
   */
  renderTabBar(tabs, activeTab, onChange) {
    const id = 'tabbar-' + Date.now();
    const html = `
      <div class="flex gap-1 bg-card rounded-lg p-1 overflow-x-auto" role="tablist" id="${id}">
        ${tabs.map(tab => `
          <button role="tab"
                  aria-selected="${tab.id === activeTab}"
                  data-tab-id="${tab.id}"
                  class="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all
                         ${tab.id === activeTab
                           ? 'bg-accent/10 text-accent border border-accent/20'
                           : 'text-gray hover:text-white'}"
          >${window.PublicaeUtils.sanitize(tab.label)}</button>
        `).join('')}
      </div>`;

    // Differe l'attachement des listeners apres injection dans le DOM
    requestAnimationFrame(() => {
      const tabBar = document.getElementById(id);
      if (!tabBar) return;

      tabBar.querySelectorAll('[role="tab"]').forEach(btn => {
        btn.addEventListener('click', () => onChange(btn.dataset.tabId));

        // Navigation clavier (fleches gauche/droite)
        btn.addEventListener('keydown', (e) => {
          const allTabs = [...tabBar.querySelectorAll('[role="tab"]')];
          const idx = allTabs.indexOf(btn);
          if (e.key === 'ArrowRight' && idx < allTabs.length - 1) {
            allTabs[idx + 1].focus();
            e.preventDefault();
          } else if (e.key === 'ArrowLeft' && idx > 0) {
            allTabs[idx - 1].focus();
            e.preventDefault();
          }
        });
      });
    });

    return html;
  },

  /* ============================================================
     INIT — Initialise le shell commun (sidebar + topbar + events)
  ============================================================ */

  /**
   * Initialise les composants partages sur la page.
   * A appeler dans chaque fichier page (feed.js, dashboard.js, etc.).
   * @param {string} activePage - ID de la page ('feed', 'dashboard', etc.)
   * @param {string} pageTitle - Titre affiche dans la topbar
   */
  init(activePage, pageTitle) {
    this.renderSidebar(activePage);
    this.renderTopBar(pageTitle);
    window.PublicaeRouter.init();
  }
};
