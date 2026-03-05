/**
 * feed.js — Logique de la page Feed (Public Square).
 *
 * Fonctionnalites :
 * - Tabs : All / Trending / Monetized
 * - Post composer avec compteur de caracteres
 * - Chargement async avec skeletons
 * - Like interactif avec toast feedback
 * - Load more (pagination)
 */

(function() {
  'use strict';

  const API = window.PublicaeAPI;
  const UI  = window.PublicaeComponents;
  const U   = window.PublicaeUtils;
  const S   = window.PublicaeStore;

  let currentTab = 'all';
  let currentPage = 1;
  const perPage = 5;

  /* ============================================================
     INIT
  ============================================================ */

  UI.init('feed', 'Public Square');
  initComposer();
  initTabs();
  loadFeed();

  /* ============================================================
     POST COMPOSER
  ============================================================ */

  function initComposer() {
    const avatar = document.getElementById('composer-avatar');
    const input  = document.getElementById('compose-input');
    const submit = document.getElementById('compose-submit');
    const count  = document.getElementById('char-count');

    // Avatar
    const color = U.usernameColor(S.user.username);
    const initial = U.getInitial(S.user.displayName);
    avatar.style.backgroundColor = color;
    avatar.textContent = initial;

    // Char count + submit state
    input.addEventListener('input', () => {
      const len = input.value.trim().length;
      count.textContent = `${input.value.length}/500`;
      submit.disabled = len === 0;
      count.classList.toggle('text-error', input.value.length > 450);
    });

    // Submit
    submit.addEventListener('click', async () => {
      const content = input.value.trim();
      if (!content) return;

      submit.disabled = true;
      submit.textContent = 'Posting...';

      try {
        const result = await API.createPost(content);
        if (result.success) {
          input.value = '';
          count.textContent = '0/500';
          UI.showToast('Post published!', 'success');
          // Recharger le feed pour voir le nouveau post
          currentPage = 1;
          await loadFeed();
        }
      } catch (err) {
        UI.showToast('Failed to publish post', 'error');
      } finally {
        submit.textContent = 'Post';
        submit.disabled = false;
      }
    });
  }

  /* ============================================================
     TABS
  ============================================================ */

  function initTabs() {
    const tabs = [
      { id: 'all', label: 'All' },
      { id: 'trending', label: 'Trending' },
      { id: 'monetized', label: 'Monetized' }
    ];

    const tabsContainer = document.getElementById('feed-tabs');
    tabsContainer.innerHTML = UI.renderTabBar(tabs, currentTab, (tabId) => {
      currentTab = tabId;
      currentPage = 1;
      initTabs(); // Re-render tabs
      loadFeed();
    });
  }

  /* ============================================================
     LOAD FEED
  ============================================================ */

  async function loadFeed() {
    const container = document.getElementById('feed-content');
    const loadMore  = document.getElementById('feed-load-more');

    // Afficher skeletons
    if (currentPage === 1) {
      container.innerHTML = Array(3).fill(UI.renderPostSkeleton()).join('');
    }

    try {
      const data = await API.getFeed(currentTab, currentPage, perPage);

      if (currentPage === 1) {
        container.innerHTML = '';
      }

      if (data.posts.length === 0 && currentPage === 1) {
        container.innerHTML = UI.renderEmptyState(
          'No posts yet',
          'Be the first to share something!'
        );
        loadMore.classList.add('hidden');
        return;
      }

      data.posts.forEach(post => {
        const html = UI.renderPostCard(post);
        container.insertAdjacentHTML('beforeend', html);
      });

      // Attacher les handlers de like
      attachLikeHandlers(container);

      // Load more
      if (data.hasMore) {
        loadMore.classList.remove('hidden');
        loadMore.querySelector('button').onclick = () => {
          currentPage++;
          loadFeed();
        };
      } else {
        loadMore.classList.add('hidden');
      }

    } catch (err) {
      container.innerHTML = UI.renderEmptyState(
        'Failed to load feed',
        'Please try again later.'
      );
    }
  }

  /* ============================================================
     LIKE HANDLER
  ============================================================ */

  function attachLikeHandlers(container) {
    container.querySelectorAll('[data-action="like"]').forEach(btn => {
      // Eviter doublons
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';

      btn.addEventListener('click', async () => {
        const postId = btn.dataset.postId;
        try {
          const result = await API.likePost(postId);
          if (result.success) {
            btn.querySelector('span').textContent = U.formatCompact(result.newCount);
            btn.classList.add('text-red-400');
            btn.classList.remove('text-gray');
          }
        } catch (err) {
          UI.showToast('Failed to like post', 'error');
        }
      });
    });
  }

})();
