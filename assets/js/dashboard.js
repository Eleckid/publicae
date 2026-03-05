/**
 * dashboard.js — Logique de la page Dashboard.
 *
 * Fonctionnalites :
 * - 4 KPI stats (Total Earned, On-Chain, Staked, USD Value)
 * - Earnings chart (barres 7 jours)
 * - Annonces plateforme
 * - Trending posts
 */

(function() {
  'use strict';

  const API = window.PublicaeAPI;
  const UI  = window.PublicaeComponents;
  const U   = window.PublicaeUtils;

  UI.init('dashboard', 'Dashboard');
  loadDashboard();

  async function loadDashboard() {
    // Afficher skeletons
    document.getElementById('stats-grid').innerHTML =
      Array(4).fill(UI.renderStatSkeleton()).join('');
    document.getElementById('trending-posts').innerHTML =
      Array(2).fill(UI.renderPostSkeleton()).join('');

    try {
      // Charger tout en parallele
      const [balance, earnings, announcements, feed] = await Promise.all([
        API.getBalance(),
        API.getEarnings(),
        API.getAnnouncements(),
        API.getFeed('trending', 1, 3)
      ]);

      renderStats(balance);
      renderEarningsChart(earnings.daily);
      renderAnnouncements(announcements);
      renderTrendingPosts(feed.posts);

    } catch (err) {
      UI.showToast('Failed to load dashboard', 'error');
    }
  }

  /* ============================================================
     KPI STATS
  ============================================================ */

  function renderStats(balance) {
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = [
      UI.renderStatCard('Total Earned', U.formatCompact(balance.total) + ' $STATE', 'All-time earnings'),
      UI.renderStatCard('On-Chain Balance', U.formatCompact(balance.onChain) + ' $STATE', 'Wallet balance'),
      UI.renderStatCard('Staked', U.formatCompact(balance.stakedAmount) + ' $STATE', balance.stakingAPY + '% APY'),
      UI.renderStatCard('USD Value', U.formatUSD(balance.usdValue), 'Rate: $' + (balance.total > 0 ? (balance.usdValue / balance.total).toExponential(2) : '0') + '/token')
    ].join('');
  }

  /* ============================================================
     EARNINGS CHART (CSS bar chart)
  ============================================================ */

  function renderEarningsChart(daily) {
    const chart = document.getElementById('earnings-chart');
    const maxAmount = Math.max(...daily.map(d => d.amount));

    chart.innerHTML = daily.map(d => {
      const pct = maxAmount > 0 ? (d.amount / maxAmount * 100) : 0;
      const label = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
      return `<div class="bar-chart__bar" style="height: ${pct}%" data-label="${label}" title="${U.formatCompact(d.amount)} $STATE"></div>`;
    }).join('');
  }

  /* ============================================================
     ANNOUNCEMENTS
  ============================================================ */

  function renderAnnouncements(announcements) {
    const list = document.getElementById('announcements-list');

    if (announcements.length === 0) {
      list.innerHTML = '<p class="text-sm text-gray">No announcements</p>';
      return;
    }

    list.innerHTML = announcements.map(a => {
      const iconColor = a.type === 'feature' ? 'text-accent' : 'text-info';
      return `
        <div class="flex items-start gap-3 p-3 rounded-lg bg-card-alt/50">
          <span class="${iconColor} text-lg mt-0.5">${a.type === 'feature' ? '&#9733;' : '&#9432;'}</span>
          <div>
            <div class="text-sm font-semibold text-white">${U.sanitize(a.title)}</div>
            <div class="text-xs text-gray mt-1">${U.sanitize(a.content)}</div>
            <div class="text-[10px] text-gray/60 mt-1 font-mono">${U.formatDate(a.date)}</div>
          </div>
        </div>`;
    }).join('');
  }

  /* ============================================================
     TRENDING POSTS
  ============================================================ */

  function renderTrendingPosts(posts) {
    const container = document.getElementById('trending-posts');
    if (posts.length === 0) {
      container.innerHTML = UI.renderEmptyState('No trending posts');
      return;
    }
    container.innerHTML = posts.map(p => UI.renderPostCard(p)).join('');
  }

})();
