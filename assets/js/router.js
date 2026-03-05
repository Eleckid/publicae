/**
 * router.js — Navigation, detection page active, mobile menu toggle.
 *
 * Expose : window.PublicaeRouter
 *
 * Responsabilites :
 * 1. Detecter la page courante via le nom de fichier dans l'URL
 * 2. Gerer le toggle sidebar mobile (hamburger)
 * 3. Gerer la fermeture sidebar via overlay click
 * 4. Mettre a jour le compteur online periodiquement
 */

window.PublicaeRouter = {

  /* ============================================================
     PAGE DETECTION
  ============================================================ */

  /**
   * Retourne l'identifiant de la page active base sur l'URL.
   * @returns {'feed'|'dashboard'|'profile'|'earnings'|'staking'|'settings'}
   */
  getActivePage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';

    const map = {
      'index.html':     'feed',
      'dashboard.html': 'dashboard',
      'profile.html':   'profile',
      'earnings.html':  'earnings',
      'staking.html':   'staking',
      'settings.html':  'settings',
    };

    return map[file] || 'feed';
  },

  /* ============================================================
     MOBILE SIDEBAR TOGGLE
  ============================================================ */

  /**
   * Initialise les controles mobile : hamburger, overlay, close.
   */
  initMobileMenu() {
    const sidebar  = document.getElementById('sidebar-mobile');
    const overlay  = document.getElementById('sidebar-overlay');
    const openBtn  = document.getElementById('sidebar-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (!sidebar) return;

    function openSidebar() {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      if (overlay) {
        overlay.classList.remove('hidden');
        // Force reflow pour animation
        overlay.offsetHeight;
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
      }
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeSidebar() {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('-translate-x-full');
      if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
      }
      document.body.style.overflow = '';
      if (openBtn) openBtn.focus();
    }

    if (openBtn)  openBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay)  overlay.addEventListener('click', closeSidebar);

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full')) {
        closeSidebar();
      }
    });

    // Fermer si redimensionnement au-dela du breakpoint mobile (1024px)
    const mql = window.matchMedia('(min-width: 1024px)');
    mql.addEventListener('change', (e) => {
      if (e.matches) {
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  },

  /* ============================================================
     ONLINE COUNT POLLING
  ============================================================ */

  startOnlineCountPolling() {
    const el = document.getElementById('online-count');
    if (!el) return;

    async function update() {
      try {
        const count = await window.PublicaeAPI.getOnlineCount();
        el.textContent = count.toLocaleString('en-US');
      } catch (_) {
        // Silencieux
      }
    }

    update();
    setInterval(update, 30000);
  },

  /* ============================================================
     INIT ROUTER
  ============================================================ */

  init() {
    this.initMobileMenu();
    this.startOnlineCountPolling();
  }
};
