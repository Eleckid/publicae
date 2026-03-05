/**
 * utils.js — Helpers utilitaires (zero dependance).
 *
 * Fonctions de securite (sanitize), formatage (nombres, dates),
 * et creation d'elements DOM de maniere securisee.
 *
 * IMPORTANT : Aucun innerHTML avec des donnees utilisateur.
 * Toutes les donnees textuelles passent par sanitize() ou textContent.
 */

window.PublicaeUtils = {

  /* ============================================================
     SECURITE
  ============================================================ */

  /**
   * Echappe une chaine pour empecher l'injection XSS.
   * Utilise textContent (pas innerHTML) comme vecteur d'echappement.
   * @param {string} str - Chaine a sanitizer
   * @returns {string} Chaine echappee (HTML entities)
   */
  sanitize(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /* ============================================================
     FORMATAGE NOMBRES
  ============================================================ */

  /**
   * Formate un nombre avec separateurs de milliers.
   * 409707719481 => "409,707,719,481"
   */
  formatNumber(num) {
    if (num == null || isNaN(num)) return '0';
    return Number(num).toLocaleString('en-US');
  },

  /**
   * Formate un nombre en version compacte lisible.
   * 409707719481 => "409.7B"
   */
  formatCompact(num) {
    if (num == null || isNaN(num)) return '0';
    const n = Math.abs(Number(num));
    const sign = num < 0 ? '-' : '';
    if (n >= 1e12) return sign + (n / 1e12).toFixed(1) + 'T';
    if (n >= 1e9) return sign + (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return sign + (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return sign + (n / 1e3).toFixed(1) + 'K';
    return sign + n.toString();
  },

  /**
   * Formate en USD avec precision adaptee.
   * Evite la notation scientifique (resout le bug $3.956E-10).
   */
  formatUSD(num) {
    if (num == null || isNaN(num)) return '$0.00';
    if (Math.abs(num) < 0.01) return '< $0.01';
    return '$' + Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Formate un pourcentage.
   * 63.3 => "63.3%"
   */
  formatPercent(num, decimals = 1) {
    if (num == null || isNaN(num)) return '0%';
    return Number(num).toFixed(decimals) + '%';
  },

  /* ============================================================
     FORMATAGE DATES
  ============================================================ */

  /**
   * Convertit une date ISO en temps relatif.
   * "2026-03-05T09:30:00Z" => "2h ago"
   */
  timeAgo(isoString) {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return mins + 'm ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    if (days < 30) return days + 'd ago';
    const months = Math.floor(days / 30);
    return months + 'mo ago';
  },

  /**
   * Formate une date ISO en format lisible.
   * "2026-03-05" => "Mar 5, 2026"
   */
  formatDate(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  },

  /* ============================================================
     DOM HELPERS
  ============================================================ */

  /**
   * Cree un element DOM de maniere securisee (pas de innerHTML).
   * Usage : createElement('div', { className: 'card', textContent: 'Hello' }, [childNode])
   */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'className') el.className = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key === 'htmlContent') el.innerHTML = val; // UNIQUEMENT pour HTML statique controle
      else if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      }
      else if (key.startsWith('data-') || key.startsWith('aria-') || key === 'role' || key === 'tabindex' || key === 'id' || key === 'for' || key === 'type' || key === 'href' || key === 'src' || key === 'alt') {
        el.setAttribute(key, val);
      }
      else el[key] = val;
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child instanceof Node) el.appendChild(child);
    });
    return el;
  },

  /* ============================================================
     UTILITAIRES DIVERS
  ============================================================ */

  /**
   * Debounce : limite la frequence d'appels d'une fonction.
   * Utile pour resize, scroll, input.
   */
  debounce(fn, delay = 250) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Genere une couleur a partir d'un username (pour les avatars).
   * Deterministe : meme username => meme couleur.
   */
  usernameColor(username) {
    const colors = [
      '#ff6b6b', '#ffa06b', '#ffd93d', '#6bcb77',
      '#4d96ff', '#9b59b6', '#e84393', '#00cec9',
      '#fd79a8', '#a29bfe', '#55efc4', '#fdcb6e'
    ];
    let hash = 0;
    for (let i = 0; i < (username || '').length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  /**
   * Extrait l'initiale d'un nom d'affichage.
   * "Crypto Explorer" => "C"
   */
  getInitial(name) {
    return (name || '?').charAt(0).toUpperCase();
  },

  /**
   * Tronque une adresse wallet pour affichage.
   * "0x7a3F1E9b2C4D6f8A0B5e3c1D9F7a2E4b6C8d0A" => "0x7a3F...8d0A"
   */
  truncateAddress(addr) {
    if (!addr || addr.length < 10) return addr || '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  }
};
