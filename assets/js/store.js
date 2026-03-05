/**
 * store.js — Source unique de verite pour toutes les donnees mock.
 *
 * ARCHITECTURE :
 * - Toutes les pages lisent depuis window.PublicaeStore
 * - Aucune page ne definit ses propres valeurs de $STATE
 * - Les mutations passent par store.update() qui emet un event 'store:change'
 *
 * RESOUT : P0 #1 (balance $STATE inconsistante entre pages)
 * RESOUT : P0 #2 (valeurs negatives airdrops => on utilise 0 ici)
 */

window.PublicaeStore = {

  /* ============================================================
     UTILISATEUR COURANT (mock)
  ============================================================ */
  user: {
    id: 'usr_001',
    username: 'CryptoExplorer_42',
    displayName: 'Crypto Explorer',
    avatar: null, // null = utiliser initiale + couleur
    bio: 'Building the decentralized future. Early $STATE adopter. View-to-Earn believer.',
    joinedDate: '2025-06-15',
    isOnline: true,
    stats: {
      posts: 142,
      followers: 1247,
      following: 89,
      totalViews: 45800,
      totalLikes: 3200,
      totalShares: 890
    },
    wallet: {
      address: '0x7a3F1E9b2C4D6f8A0B5e3c1D9F7a2E4b6C8d0A',
      connected: true,
      network: 'Ethereum Mainnet'
    }
  },

  /* ============================================================
     BALANCE $STATE — SOURCE UNIQUE (resout P0 #1)

     Explication :
     - total = somme de tous les earnings (engagement + gaming + tips)
     - Les airdrops sont a 0 (resout P0 #2 : plus de valeurs negatives)
     - onChain = balance reelle du wallet (different du total earned, c'est normal)
  ============================================================ */
  balance: {
    total: 409707719481,
    breakdown: {
      engagement: 190816106996,
      gaming: 202891612485,
      tips: 16000000000,
      airdrops: 0,
      topCreator: 0,
      staking: 0
    },
    onChain: 875183153310.64,
    usdRate: 0.000000000396,
    stakedAmount: 50000000000,
    stakingAPY: 12.5
  },

  /* ============================================================
     COMPTEUR EN LIGNE (resout P1 #6 : present partout)
  ============================================================ */
  onlineCount: 1247,

  /* ============================================================
     POSTS MOCK (Feed)
  ============================================================ */
  posts: [
    {
      id: 'post_001',
      author: { username: 'NWO_Pioneer', displayName: 'NWO Pioneer', avatar: null },
      content: 'Just staked 50B $STATE tokens! The APY is incredible right now. Who else is in? The View-to-Earn model is changing how we think about social media value.',
      media: null,
      timestamp: '2026-03-05T09:30:00Z',
      engagement: { likes: 142, comments: 23, shares: 8, views: 890 },
      isMonetized: true,
      stateEarned: 2500000
    },
    {
      id: 'post_002',
      author: { username: 'BlockchainBella', displayName: 'Blockchain Bella', avatar: null },
      content: 'The Publicae platform is evolving fast. Love seeing the community grow every day!',
      media: { type: 'image', url: 'https://picsum.photos/seed/publicae1/600/400', alt: 'Community event photo' },
      timestamp: '2026-03-05T08:15:00Z',
      engagement: { likes: 89, comments: 12, shares: 3, views: 450 },
      isMonetized: false,
      stateEarned: 800000
    },
    {
      id: 'post_003',
      author: { username: 'DeFi_Guru', displayName: 'DeFi Guru', avatar: null },
      content: 'Earnings breakdown for this week: 65% from engagement, 25% from gaming, 10% from tips. The View-to-Earn ecosystem is truly rewarding quality content creators.',
      media: null,
      timestamp: '2026-03-05T07:00:00Z',
      engagement: { likes: 234, comments: 45, shares: 19, views: 1200 },
      isMonetized: true,
      stateEarned: 5000000
    },
    {
      id: 'post_004',
      author: { username: 'CryptoArtist', displayName: 'Crypto Artist', avatar: null },
      content: 'New NFT drop coming soon on the AR World Explorer! Keep your GPS ready.',
      media: { type: 'image', url: 'https://picsum.photos/seed/publicae2/600/400', alt: 'NFT artwork preview' },
      timestamp: '2026-03-04T22:30:00Z',
      engagement: { likes: 67, comments: 8, shares: 15, views: 340 },
      isMonetized: true,
      stateEarned: 1500000
    },
    {
      id: 'post_004b',
      author: { username: 'NWO_Official', displayName: 'NWO Official', avatar: null },
      content: 'Watch the full keynote from the NWO Summit 2026. Ciprian Pater unveils the roadmap for $STATE cross-chain expansion and the new View-to-Earn 2.0 engine.',
      media: { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://picsum.photos/seed/nwovideo/600/340', alt: 'NWO Summit 2026 Keynote' },
      timestamp: '2026-03-04T20:00:00Z',
      engagement: { likes: 1892, comments: 234, shares: 567, views: 24500 },
      isMonetized: true,
      stateEarned: 45000000
    },
    {
      id: 'post_005',
      author: { username: 'StateHolder', displayName: 'State Holder', avatar: null },
      content: 'Pro tip: combine staking with daily engagement for maximum $STATE accumulation. My 30-day lock is earning 12.5% APY while I earn more from posting.',
      media: null,
      timestamp: '2026-03-04T18:00:00Z',
      engagement: { likes: 312, comments: 56, shares: 28, views: 1800 },
      isMonetized: true,
      stateEarned: 8000000
    },
    {
      id: 'post_006',
      author: { username: 'Web3Maven', displayName: 'Web3 Maven', avatar: null },
      content: 'Attended the Publicae community meetup in Oslo yesterday. Amazing energy! The PBLC token utility for advertisers is going to be huge.',
      media: { type: 'image', url: 'https://picsum.photos/seed/publicae3/600/400', alt: 'Oslo meetup photo' },
      timestamp: '2026-03-04T14:20:00Z',
      engagement: { likes: 178, comments: 34, shares: 12, views: 920 },
      isMonetized: false,
      stateEarned: 3200000
    },
    {
      id: 'post_007',
      author: { username: 'TokenTracker', displayName: 'Token Tracker', avatar: null },
      content: '$STATE is now deployed on 10+ chains! Cross-chain interoperability is the future. Which chain are you using?',
      media: null,
      timestamp: '2026-03-04T10:45:00Z',
      engagement: { likes: 95, comments: 41, shares: 7, views: 560 },
      isMonetized: false,
      stateEarned: 1200000
    },
    {
      id: 'post_008',
      author: { username: 'EarnAndLearn', displayName: 'Earn & Learn', avatar: null },
      content: 'Weekly challenge completed! Earned 500M $STATE from the gamification module. The arcade games are actually fun AND rewarding.',
      media: null,
      timestamp: '2026-03-03T20:00:00Z',
      engagement: { likes: 201, comments: 28, shares: 16, views: 1100 },
      isMonetized: true,
      stateEarned: 6500000
    },
    {
      id: 'post_009',
      author: { username: 'DecentralDave', displayName: 'Decentral Dave', avatar: null },
      content: 'Just discovered the microloans feature. You can lend $STATE to other users and earn interest. DeFi social banking is here.',
      media: null,
      timestamp: '2026-03-03T15:30:00Z',
      engagement: { likes: 56, comments: 9, shares: 4, views: 280 },
      isMonetized: false,
      stateEarned: 900000
    },
    {
      id: 'post_010',
      author: { username: 'AlphaSeeker', displayName: 'Alpha Seeker', avatar: null },
      content: 'Launchpad update: new token launches this month. Check your eligibility based on $STATE holdings. Minimum 10B $STATE for Tier 1 access.',
      media: null,
      timestamp: '2026-03-03T11:00:00Z',
      engagement: { likes: 445, comments: 89, shares: 52, views: 3400 },
      isMonetized: true,
      stateEarned: 12000000
    }
  ],

  /* ============================================================
     EARNINGS DETAILS
  ============================================================ */
  earnings: {
    daily: [
      { date: '2026-03-05', amount: 1250000000 },
      { date: '2026-03-04', amount: 980000000 },
      { date: '2026-03-03', amount: 1100000000 },
      { date: '2026-03-02', amount: 850000000 },
      { date: '2026-03-01', amount: 1450000000 },
      { date: '2026-02-28', amount: 920000000 },
      { date: '2026-02-27', amount: 1200000000 }
    ],
    tiers: [
      { name: 'Views', rate: '100K $STATE per 1K views', percentage: 10 },
      { name: 'Likes', rate: '200K $STATE per 100 likes', percentage: 20 },
      { name: 'Comments', rate: '300K $STATE per 50 comments', percentage: 30 },
      { name: 'Shares', rate: '400K $STATE per 25 shares', percentage: 40 }
    ],
    nextPayout: {
      amount: 5000000000,
      date: '2026-03-10',
      method: 'On-chain transfer'
    }
  },

  /* ============================================================
     STAKING POOLS
  ============================================================ */
  staking: {
    pools: [
      { id: 'flexible', name: 'Flexible', apy: 8.5, lockDays: 0, minStake: 1000000000, description: 'Withdraw anytime. No lock period.' },
      { id: '30day', name: '30-Day Lock', apy: 12.5, lockDays: 30, minStake: 10000000000, description: 'Higher rewards with 30-day commitment.' },
      { id: '90day', name: '90-Day Lock', apy: 18.0, lockDays: 90, minStake: 50000000000, description: 'Maximum APY for long-term holders.' }
    ],
    userStakes: [
      {
        poolId: '30day',
        amount: 50000000000,
        startDate: '2026-02-15',
        endDate: '2026-03-17',
        earned: 1712328767,
        status: 'active'
      }
    ]
  },

  /* ============================================================
     PARAMETRES UTILISATEUR
  ============================================================ */
  settings: {
    notifications: { email: true, push: false, inApp: true },
    privacy: { profilePublic: true, showEarnings: false, showWallet: true },
    language: 'en',
    theme: 'dark'
  },

  /* ============================================================
     ANNONCES PLATEFORME
  ============================================================ */
  announcements: [
    {
      id: 'ann_001',
      title: 'Staking APY Boost',
      content: 'All staking pools receive a +2% APY bonus this month!',
      date: '2026-03-01',
      type: 'info'
    },
    {
      id: 'ann_002',
      title: 'AR World Explorer Update',
      content: 'New NFT drops added to 15 cities worldwide. Check the map!',
      date: '2026-02-28',
      type: 'feature'
    }
  ],

  /* ============================================================
     STORE METHODS — Systeme reactif simple
  ============================================================ */
  _listeners: [],

  /**
   * S'abonner aux changements du store.
   * @param {Function} fn - Callback(path, newValue)
   * @returns {Function} Fonction de desabonnement
   */
  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  },

  /**
   * Met a jour une valeur dans le store et notifie les abonnes.
   * @param {string} path - Chemin en notation pointee ("balance.total")
   * @param {*} value - Nouvelle valeur
   */
  update(path, value) {
    const keys = path.split('.');
    let obj = this;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) return;
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this._listeners.forEach(fn => fn(path, value));
  },

  /**
   * Lit une valeur du store par chemin.
   * @param {string} path - Chemin en notation pointee
   * @returns {*} Valeur trouvee ou undefined
   */
  get(path) {
    const keys = path.split('.');
    let obj = this;
    for (const key of keys) {
      if (obj == null) return undefined;
      obj = obj[key];
    }
    return obj;
  }
};
