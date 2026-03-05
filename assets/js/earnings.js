/**
 * earnings.js — Logique de la page My Earnings.
 *
 * VALIDE P0 #1 : Le total $STATE est lu depuis store.balance.total (source unique).
 * VALIDE P0 #2 : Les airdrops = 0 (pas de valeur negative).
 *
 * Fonctionnalites :
 * - Banner total earned (source unique)
 * - Breakdown par categorie (progress bars)
 * - Tiers d'earnings (View-to-Earn)
 * - Next payout info
 */

(function() {
  'use strict';

  const API = window.PublicaeAPI;
  const UI  = window.PublicaeComponents;
  const U   = window.PublicaeUtils;

  UI.init('earnings', 'My Earnings');
  loadEarnings();

  async function loadEarnings() {
    // Skeletons
    document.getElementById('total-banner').innerHTML = UI.renderCardSkeleton('h-24');
    document.getElementById('breakdown-grid').innerHTML =
      Array(6).fill(UI.renderStatSkeleton()).join('');

    try {
      const [balance, earnings] = await Promise.all([
        API.getBalance(),
        API.getEarnings()
      ]);

      renderTotalBanner(balance);
      renderBreakdown(balance);
      renderTiers(earnings.tiers);
      renderPayout(earnings.nextPayout);

    } catch (err) {
      UI.showToast('Failed to load earnings data', 'error');
    }
  }

  /* ============================================================
     TOTAL BANNER — Source unique (P0 #1)
  ============================================================ */

  function renderTotalBanner(balance) {
    const banner = document.getElementById('total-banner');
    banner.innerHTML = `
      <div class="text-xs font-mono text-gray uppercase tracking-wider mb-2">Total $STATE Earned</div>
      <div class="font-mono text-3xl lg:text-4xl font-bold text-accent mb-1">${U.formatNumber(balance.total)}</div>
      <div class="text-sm text-gray">
        On-chain: ${U.formatCompact(balance.onChain)} &middot;
        Staked: ${U.formatCompact(balance.stakedAmount)} &middot;
        Value: ${U.formatUSD(balance.usdValue)}
      </div>`;
  }

  /* ============================================================
     BREAKDOWN — Categories d'earnings
  ============================================================ */

  function renderBreakdown(balance) {
    const grid = document.getElementById('breakdown-grid');
    const b = balance.breakdown;
    const total = balance.total;

    const categories = [
      { label: 'Engagement', value: b.engagement, color: 'accent' },
      { label: 'Gaming', value: b.gaming, color: 'accent' },
      { label: 'Tips Received', value: b.tips, color: 'info' },
      { label: 'Airdrops', value: b.airdrops, color: 'warning' },
      { label: 'Top Creator', value: b.topCreator, color: 'accent' },
      { label: 'Staking Rewards', value: b.staking, color: 'accent' }
    ];

    grid.innerHTML = categories.map(cat => {
      const pct = total > 0 ? (cat.value / total * 100).toFixed(1) : '0.0';
      return `
        <div class="bg-card border border-border rounded-xl p-4">
          <div class="text-xs font-mono text-gray uppercase tracking-wider mb-1">${U.sanitize(cat.label)}</div>
          <div class="font-mono text-lg font-bold text-${cat.color}">${U.formatCompact(cat.value)}</div>
          <div class="progress-bar mt-2">
            <div class="progress-bar__fill" style="width: ${pct}%; background: var(--color-${cat.color})"></div>
          </div>
          <div class="text-[10px] text-gray mt-1 font-mono">${pct}% of total</div>
        </div>`;
    }).join('');
  }

  /* ============================================================
     EARNING TIERS
  ============================================================ */

  function renderTiers(tiers) {
    const list = document.getElementById('tiers-list');

    list.innerHTML = tiers.map(tier => `
      <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <div class="text-sm font-semibold text-white">${U.sanitize(tier.name)}</div>
          <div class="text-xs text-gray mt-1 font-mono">${U.sanitize(tier.rate)}</div>
        </div>
        <div class="text-right">
          <div class="font-mono text-lg font-bold text-accent">${tier.percentage}%</div>
          <div class="text-[10px] text-gray">of earnings</div>
        </div>
      </div>`
    ).join('');
  }

  /* ============================================================
     NEXT PAYOUT
  ============================================================ */

  function renderPayout(payout) {
    const card = document.getElementById('payout-card');
    card.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div class="text-xs font-mono text-gray uppercase tracking-wider mb-1">Next Payout</div>
          <div class="font-mono text-2xl font-bold text-accent">${U.formatCompact(payout.amount)} $STATE</div>
          <div class="text-xs text-gray mt-1">${U.formatDate(payout.date)} &middot; ${U.sanitize(payout.method)}</div>
        </div>
        <button class="bg-accent text-bg font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors" onclick="window.PublicaeComponents.showToast('Payout scheduled!', 'success')">
          Claim Now
        </button>
      </div>`;
  }

})();
