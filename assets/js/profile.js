/**
 * profile.js — Logique de la page Profile.
 *
 * Fonctionnalites :
 * - Header profil (avatar, bio, wallet)
 * - Stats (posts, followers, following, views, likes, shares)
 * - Posts de l'utilisateur
 */

(function() {
  'use strict';

  const API = window.PublicaeAPI;
  const UI  = window.PublicaeComponents;
  const U   = window.PublicaeUtils;

  UI.init('profile', 'Profile');
  loadProfile();

  async function loadProfile() {
    // Skeletons
    document.getElementById('profile-header').innerHTML = UI.renderCardSkeleton('h-36');
    document.getElementById('profile-stats').innerHTML =
      Array(6).fill(UI.renderStatSkeleton()).join('');
    document.getElementById('user-posts').innerHTML =
      Array(2).fill(UI.renderPostSkeleton()).join('');

    try {
      const [user, posts] = await Promise.all([
        API.getUserProfile(),
        API.getUserPosts()
      ]);

      renderProfileHeader(user);
      renderProfileStats(user.stats);
      renderUserPosts(posts);

    } catch (err) {
      UI.showToast('Failed to load profile', 'error');
    }
  }

  /* ============================================================
     PROFILE HEADER
  ============================================================ */

  function renderProfileHeader(user) {
    const header = document.getElementById('profile-header');
    const color = U.usernameColor(user.username);
    const initial = U.getInitial(user.displayName);

    header.innerHTML = `
      <div class="flex items-start gap-5">
        <!-- Avatar -->
        <div class="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold text-bg" style="background-color: ${color}">
          ${initial}
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 flex-wrap">
            <h2 class="text-xl font-bold text-white">${U.sanitize(user.displayName)}</h2>
            <span class="text-sm text-gray">@${U.sanitize(user.username)}</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${user.isOnline ? 'bg-accent/10 text-accent' : 'bg-gray/10 text-gray'}">
              <span class="w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-accent' : 'bg-gray'}"></span>
              ${user.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p class="text-sm text-gray mt-2 leading-relaxed">${U.sanitize(user.bio)}</p>

          <div class="flex items-center gap-4 mt-3 flex-wrap">
            <span class="text-xs text-gray font-mono">
              <span class="text-accent">${user.wallet.connected ? '&#9679;' : '&#9675;'}</span>
              ${U.truncateAddress(user.wallet.address)}
            </span>
            <span class="text-xs text-gray">Joined ${U.formatDate(user.joinedDate)}</span>
          </div>
        </div>
      </div>`;
  }

  /* ============================================================
     PROFILE STATS
  ============================================================ */

  function renderProfileStats(stats) {
    const grid = document.getElementById('profile-stats');
    const items = [
      { label: 'Posts', value: U.formatCompact(stats.posts) },
      { label: 'Followers', value: U.formatCompact(stats.followers) },
      { label: 'Following', value: U.formatCompact(stats.following) },
      { label: 'Views', value: U.formatCompact(stats.totalViews) },
      { label: 'Likes', value: U.formatCompact(stats.totalLikes) },
      { label: 'Shares', value: U.formatCompact(stats.totalShares) }
    ];

    grid.innerHTML = items.map(item => `
      <div class="bg-card border border-border rounded-xl p-3 text-center hover-lift">
        <div class="font-mono text-lg font-bold text-accent">${item.value}</div>
        <div class="text-[10px] font-mono text-gray uppercase tracking-wider mt-1">${item.label}</div>
      </div>`
    ).join('');
  }

  /* ============================================================
     USER POSTS
  ============================================================ */

  function renderUserPosts(posts) {
    const container = document.getElementById('user-posts');
    if (posts.length === 0) {
      container.innerHTML = UI.renderEmptyState('No posts yet', 'Start sharing your thoughts!');
      return;
    }
    container.innerHTML = posts.map(p => UI.renderPostCard(p)).join('');
  }

})();
