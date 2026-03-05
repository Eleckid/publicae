/**
 * mock-api.js — Simule des appels API avec delais realistes.
 *
 * Toutes les fonctions retournent des Promises.
 * Les donnees viennent EXCLUSIVEMENT de PublicaeStore (source unique).
 * Les delais (200-800ms) simulent la latence reseau pour demontrer
 * les etats de chargement (skeletons).
 */

window.PublicaeAPI = {

  /**
   * Delai aleatoire simulant la latence reseau.
   * @param {number} min - Delai minimum en ms (defaut 200)
   * @param {number} max - Delai maximum en ms (defaut 800)
   */
  _delay(min = 200, max = 800) {
    return new Promise(resolve =>
      setTimeout(resolve, min + Math.random() * (max - min))
    );
  },

  /* ============================================================
     BALANCE & EARNINGS
  ============================================================ */

  /** Recupere le solde $STATE et son breakdown. */
  async getBalance() {
    await this._delay();
    const b = window.PublicaeStore.balance;
    return {
      total: b.total,
      breakdown: { ...b.breakdown },
      onChain: b.onChain,
      usdValue: b.total * b.usdRate,
      stakedAmount: b.stakedAmount,
      stakingAPY: b.stakingAPY
    };
  },

  /** Recupere les details des gains (daily, tiers, payout). */
  async getEarnings() {
    await this._delay();
    return JSON.parse(JSON.stringify(window.PublicaeStore.earnings));
  },

  /* ============================================================
     FEED & POSTS
  ============================================================ */

  /**
   * Recupere les posts du feed.
   * @param {string} tab - 'all' | 'trending' | 'monetized' | 'following'
   * @param {number} page - Numero de page (1-based)
   * @param {number} perPage - Nombre de posts par page
   */
  async getFeed(tab = 'all', page = 1, perPage = 5) {
    await this._delay();
    let posts = [...window.PublicaeStore.posts];

    if (tab === 'monetized') {
      posts = posts.filter(p => p.isMonetized);
    } else if (tab === 'trending') {
      posts.sort((a, b) => b.engagement.likes - a.engagement.likes);
    }

    const start = (page - 1) * perPage;
    return {
      posts: posts.slice(start, start + perPage),
      hasMore: start + perPage < posts.length,
      total: posts.length
    };
  },

  /**
   * Like/unlike un post.
   * @param {string} postId
   * @returns {Object} { success, newCount }
   */
  async likePost(postId) {
    await this._delay(100, 300);
    const post = window.PublicaeStore.posts.find(p => p.id === postId);
    if (!post) return { success: false, error: 'Post not found' };
    post.engagement.likes++;
    return { success: true, newCount: post.engagement.likes };
  },

  /**
   * Cree un nouveau post (mock).
   * @param {string} content - Contenu du post
   * @returns {Object} { success, post }
   */
  async createPost(content) {
    await this._delay(300, 600);
    const newPost = {
      id: 'post_' + Date.now(),
      author: {
        username: window.PublicaeStore.user.username,
        displayName: window.PublicaeStore.user.displayName,
        avatar: window.PublicaeStore.user.avatar
      },
      content: content,
      media: null,
      timestamp: new Date().toISOString(),
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      isMonetized: false,
      stateEarned: 0
    };
    window.PublicaeStore.posts.unshift(newPost);
    return { success: true, post: newPost };
  },

  /* ============================================================
     PROFIL UTILISATEUR
  ============================================================ */

  /** Recupere le profil de l'utilisateur courant. */
  async getUserProfile() {
    await this._delay();
    return JSON.parse(JSON.stringify(window.PublicaeStore.user));
  },

  /** Recupere les posts de l'utilisateur courant. */
  async getUserPosts() {
    await this._delay();
    // Mock : renvoie les 3 premiers posts comme "nos" posts
    return window.PublicaeStore.posts.slice(0, 3).map(p => ({
      ...p,
      author: {
        username: window.PublicaeStore.user.username,
        displayName: window.PublicaeStore.user.displayName,
        avatar: window.PublicaeStore.user.avatar
      }
    }));
  },

  /* ============================================================
     STAKING
  ============================================================ */

  /** Recupere les pools de staking disponibles. */
  async getStakingPools() {
    await this._delay();
    return JSON.parse(JSON.stringify(window.PublicaeStore.staking.pools));
  },

  /** Recupere les stakes actifs de l'utilisateur. */
  async getUserStakes() {
    await this._delay();
    return JSON.parse(JSON.stringify(window.PublicaeStore.staking.userStakes));
  },

  /**
   * Stake des $STATE dans un pool (mock).
   * @param {string} poolId - ID du pool
   * @param {number} amount - Montant a staker
   */
  async stakeTokens(poolId, amount) {
    await this._delay(400, 800);
    const pool = window.PublicaeStore.staking.pools.find(p => p.id === poolId);
    if (!pool) return { success: false, error: 'Pool not found' };
    if (amount < pool.minStake) return { success: false, error: 'Below minimum stake' };

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + pool.lockDays);

    window.PublicaeStore.staking.userStakes.push({
      poolId: poolId,
      amount: amount,
      startDate: now.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      earned: 0,
      status: 'active'
    });

    return { success: true };
  },

  /* ============================================================
     PARAMETRES
  ============================================================ */

  /** Recupere les parametres utilisateur. */
  async getSettings() {
    await this._delay();
    return JSON.parse(JSON.stringify(window.PublicaeStore.settings));
  },

  /** Met a jour un parametre. */
  async updateSetting(category, key, value) {
    await this._delay(100, 300);
    if (window.PublicaeStore.settings[category]) {
      window.PublicaeStore.settings[category][key] = value;
    }
    return { success: true };
  },

  /* ============================================================
     DASHBOARD
  ============================================================ */

  /** Recupere les annonces de la plateforme. */
  async getAnnouncements() {
    await this._delay();
    return JSON.parse(JSON.stringify(window.PublicaeStore.announcements));
  },

  /** Recupere le nombre d'utilisateurs en ligne. */
  async getOnlineCount() {
    await this._delay(100, 200);
    // Simule une legere variation
    const base = window.PublicaeStore.onlineCount;
    return base + Math.floor(Math.random() * 20) - 10;
  },

  /* ============================================================
     ERREURS (pour tester les etats d'erreur)
  ============================================================ */

  /** Simule une erreur reseau. */
  async simulateError() {
    await this._delay();
    throw new Error('Network error: could not reach server');
  }
};
