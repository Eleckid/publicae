/**
 * staking.js — Logique de la page Staking.
 *
 * Fonctionnalites :
 * - Overview (Total Staked, APY, Available)
 * - Pools disponibles avec bouton Stake
 * - Stakes actifs avec progress bar
 * - Modal de staking interactif
 */

(function() {
  'use strict';

  const API = window.PublicaeAPI;
  const UI  = window.PublicaeComponents;
  const U   = window.PublicaeUtils;
  const S   = window.PublicaeStore;

  UI.init('staking', 'Staking');
  loadStaking();

  async function loadStaking() {
    // Skeletons
    document.getElementById('staking-overview').innerHTML =
      Array(3).fill(UI.renderStatSkeleton()).join('');
    document.getElementById('pools-grid').innerHTML =
      Array(3).fill(UI.renderCardSkeleton('h-48')).join('');

    try {
      const [pools, stakes] = await Promise.all([
        API.getStakingPools(),
        API.getUserStakes()
      ]);

      renderOverview(stakes);
      renderPools(pools);
      renderActiveStakes(stakes, pools);

    } catch (err) {
      UI.showToast('Failed to load staking data', 'error');
    }
  }

  /* ============================================================
     OVERVIEW
  ============================================================ */

  function renderOverview(stakes) {
    const overview = document.getElementById('staking-overview');
    const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
    const totalEarned = stakes.reduce((sum, s) => sum + s.earned, 0);
    const available = S.balance.total - totalStaked;

    overview.innerHTML = [
      UI.renderStatCard('Total Staked', U.formatCompact(totalStaked) + ' $STATE', 'Across all pools'),
      UI.renderStatCard('Staking Rewards', U.formatCompact(totalEarned) + ' $STATE', 'Earned so far'),
      UI.renderStatCard('Available', U.formatCompact(Math.max(0, available)) + ' $STATE', 'Ready to stake')
    ].join('');
  }

  /* ============================================================
     POOLS
  ============================================================ */

  function renderPools(pools) {
    const grid = document.getElementById('pools-grid');

    grid.innerHTML = pools.map(pool => `
      <div class="bg-card border border-border rounded-xl p-5 flex flex-col hover-lift">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-mono text-base font-bold text-white">${U.sanitize(pool.name)}</h3>
          <span class="font-mono text-lg font-bold text-accent">${pool.apy}%</span>
        </div>
        <div class="text-xs text-gray mb-1 font-mono">APY</div>
        <p class="text-sm text-gray mt-2 flex-1">${U.sanitize(pool.description)}</p>
        <div class="mt-4 pt-3 border-t border-border">
          <div class="flex items-center justify-between text-xs text-gray mb-3">
            <span>Lock: ${pool.lockDays === 0 ? 'None' : pool.lockDays + ' days'}</span>
            <span>Min: ${U.formatCompact(pool.minStake)}</span>
          </div>
          <button
            class="w-full bg-accent text-bg font-semibold text-sm py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
            onclick="window._openStakeModal('${pool.id}', '${U.sanitize(pool.name)}', ${pool.minStake}, ${pool.apy})"
          >Stake $STATE</button>
        </div>
      </div>`
    ).join('');
  }

  /* ============================================================
     ACTIVE STAKES
  ============================================================ */

  function renderActiveStakes(stakes, pools) {
    const container = document.getElementById('active-stakes');

    if (stakes.length === 0) {
      container.innerHTML = UI.renderEmptyState('No active stakes', 'Start staking to earn rewards.');
      return;
    }

    container.innerHTML = stakes.map(stake => {
      const pool = pools.find(p => p.id === stake.poolId);
      const poolName = pool ? pool.name : stake.poolId;
      const start = new Date(stake.startDate).getTime();
      const end = new Date(stake.endDate).getTime();
      const now = Date.now();
      const progress = end > start ? Math.min(100, (now - start) / (end - start) * 100) : 100;
      const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));

      return `
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <div>
              <span class="font-mono text-sm font-bold text-white">${U.sanitize(poolName)}</span>
              <span class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 text-accent">${stake.status}</span>
            </div>
            <div class="text-right">
              <div class="font-mono text-sm font-bold text-accent">${U.formatCompact(stake.amount)} $STATE</div>
              <div class="text-[10px] text-gray">+${U.formatCompact(stake.earned)} earned</div>
            </div>
          </div>

          <!-- Progress -->
          <div class="progress-bar mb-2">
            <div class="progress-bar__fill" style="width: ${progress.toFixed(1)}%"></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray font-mono">
            <span>${U.formatDate(stake.startDate)}</span>
            <span>${daysLeft > 0 ? daysLeft + ' days left' : 'Completed'}</span>
            <span>${U.formatDate(stake.endDate)}</span>
          </div>
        </div>`;
    }).join('');
  }

  /* ============================================================
     STAKE MODAL
  ============================================================ */

  window._openStakeModal = function(poolId, poolName, minStake, apy) {
    UI.showModal(
      `Stake in ${poolName}`,
      `
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-gray mb-1">Amount ($STATE)</label>
            <input id="stake-amount-input" type="number" min="${minStake}" step="1000000000"
                   class="w-full bg-card-alt border border-border rounded-lg px-4 py-2.5 text-white text-sm font-mono outline-none focus:border-accent transition-colors"
                   placeholder="Min: ${U.formatCompact(minStake)}" />
          </div>
          <div class="flex justify-between text-xs text-gray">
            <span>APY: <span class="text-accent">${apy}%</span></span>
            <span>Available: ${U.formatCompact(S.balance.total)}</span>
          </div>
        </div>
      `,
      [
        { label: 'Cancel', type: 'secondary' },
        {
          label: 'Confirm Stake',
          type: 'primary',
          onClick: async () => {
            const input = document.getElementById('stake-amount-input');
            const amount = Number(input?.value || 0);
            if (amount < minStake) {
              UI.showToast(`Minimum stake: ${U.formatCompact(minStake)} $STATE`, 'error');
              return;
            }
            try {
              const result = await API.stakeTokens(poolId, amount);
              if (result.success) {
                UI.showToast(`Staked ${U.formatCompact(amount)} $STATE!`, 'success');
                loadStaking();
              } else {
                UI.showToast(result.error || 'Staking failed', 'error');
              }
            } catch (err) {
              UI.showToast('Staking error', 'error');
            }
          }
        }
      ]
    );
  };

})();
