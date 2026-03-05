/**
 * settings.js — Logique de la page Settings.
 *
 * Fonctionnalites :
 * - Toggle switches pour notifications et privacy
 * - Info wallet (read-only)
 * - Danger zone (export data, delete account) avec modals
 */

(function() {
  'use strict';

  const API = window.PublicaeAPI;
  const UI  = window.PublicaeComponents;
  const U   = window.PublicaeUtils;
  const S   = window.PublicaeStore;

  UI.init('settings', 'Settings');
  loadSettings();

  async function loadSettings() {
    try {
      const settings = await API.getSettings();
      renderNotifications(settings.notifications);
      renderPrivacy(settings.privacy);
      renderWallet();
      initDangerZone();
    } catch (err) {
      UI.showToast('Failed to load settings', 'error');
    }
  }

  /* ============================================================
     TOGGLE SWITCH HELPER
  ============================================================ */

  function createToggleRow(label, description, checked, onChange) {
    return `
      <div class="flex items-center justify-between px-5 py-4">
        <div>
          <div class="text-sm font-medium text-white">${U.sanitize(label)}</div>
          <div class="text-xs text-gray mt-0.5">${U.sanitize(description)}</div>
        </div>
        <button class="toggle-switch" role="switch" aria-checked="${checked}" aria-label="${U.sanitize(label)}" data-setting="${label}">
        </button>
      </div>`;
  }

  function attachToggleHandlers(container, category) {
    container.querySelectorAll('.toggle-switch').forEach(btn => {
      btn.addEventListener('click', async () => {
        const current = btn.getAttribute('aria-checked') === 'true';
        const newVal = !current;
        btn.setAttribute('aria-checked', String(newVal));

        // Map label -> setting key
        const keyMap = {
          'Email Notifications': 'email',
          'Push Notifications': 'push',
          'In-App Notifications': 'inApp',
          'Public Profile': 'profilePublic',
          'Show Earnings': 'showEarnings',
          'Show Wallet Address': 'showWallet'
        };

        const key = keyMap[btn.dataset.setting];
        if (key) {
          await API.updateSetting(category, key, newVal);
          UI.showToast('Setting updated', 'success');
        }
      });
    });
  }

  /* ============================================================
     NOTIFICATIONS
  ============================================================ */

  function renderNotifications(notif) {
    const container = document.getElementById('settings-notifications');
    container.innerHTML = [
      createToggleRow('Email Notifications', 'Receive email for important updates', notif.email),
      createToggleRow('Push Notifications', 'Browser push notifications', notif.push),
      createToggleRow('In-App Notifications', 'Show notifications in the app', notif.inApp)
    ].join('');
    attachToggleHandlers(container, 'notifications');
  }

  /* ============================================================
     PRIVACY
  ============================================================ */

  function renderPrivacy(privacy) {
    const container = document.getElementById('settings-privacy');
    container.innerHTML = [
      createToggleRow('Public Profile', 'Allow others to see your profile', privacy.profilePublic),
      createToggleRow('Show Earnings', 'Display your earnings publicly', privacy.showEarnings),
      createToggleRow('Show Wallet Address', 'Show your wallet on profile', privacy.showWallet)
    ].join('');
    attachToggleHandlers(container, 'privacy');
  }

  /* ============================================================
     WALLET INFO
  ============================================================ */

  function renderWallet() {
    const container = document.getElementById('settings-wallet');
    const w = S.user.wallet;
    container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full ${w.connected ? 'bg-accent' : 'bg-error'}"></span>
            <span class="text-sm font-medium text-white">${w.connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div class="font-mono text-sm text-gray">${U.sanitize(w.address)}</div>
          <div class="text-xs text-gray mt-1">${U.sanitize(w.network)}</div>
        </div>
        <button class="text-sm text-accent border border-accent/30 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors" onclick="window.PublicaeComponents.showToast('Wallet reconnected!', 'success')">
          Reconnect
        </button>
      </div>`;
  }

  /* ============================================================
     DANGER ZONE
  ============================================================ */

  function initDangerZone() {
    document.getElementById('btn-export-data')?.addEventListener('click', () => {
      UI.showModal('Export Data', '<p>Your data export will be sent to your registered email address within 24 hours.</p>', [
        { label: 'Cancel', type: 'secondary' },
        { label: 'Export', type: 'primary', onClick: () => UI.showToast('Data export requested!', 'success') }
      ]);
    });

    document.getElementById('btn-delete-account')?.addEventListener('click', () => {
      UI.showModal('Delete Account', '<p class="text-error">This action is <strong>permanent</strong> and cannot be undone. All your data, posts, and $STATE earnings history will be deleted.</p>', [
        { label: 'Keep Account', type: 'secondary' },
        { label: 'Delete', type: 'primary', onClick: () => UI.showToast('Account deletion requested', 'info') }
      ]);
    });
  }

})();
