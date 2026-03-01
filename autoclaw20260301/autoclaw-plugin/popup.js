// AutoClaw popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const tabsCount = document.getElementById('tabsCount');
  const attachAllBtn = document.getElementById('attachAllBtn');
  const disconnectBtn = document.getElementById('disconnectBtn');
  const openOptions = document.getElementById('openOptions');
  const content = document.getElementById('content');
  const loading = document.getElementById('loading');
  const openNewTab = document.getElementById('openNewTab');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalBtn = document.getElementById('modalBtn');

  function showModal(icon, title, message, type = 'success') {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalBtn.className = 'modal-btn ' + type;
    modalOverlay.classList.add('show');
  }

  modalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('show');
    }
  });

  function showLoading(show) {
    content.style.display = show ? 'none' : 'block';
    loading.classList.toggle('active', show);
  }

  function updateStatus(connected, count) {
    tabsCount.textContent = count;
    if (connected) {
      statusDot.className = 'status-dot connected';
      statusText.textContent = 'Connected';
    } else {
      statusDot.className = 'status-dot disconnected';
      statusText.textContent = 'Not connected';
    }
  }

  async function checkStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      updateStatus(response?.connected ?? false, response?.tabsCount ?? 0);
    } catch (e) {
      updateStatus(false, 0);
    }
  }

  attachAllBtn.addEventListener('click', async () => {
    showLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({ action: 'authorizeAndAttachAll' });
      if (response.success) {
        updateStatus(true, response.count);
        showModal('🎉', 'Success!', `Attached ${response.count} tabs`, 'success');
      } else {
        showModal('❌', 'Failed', response.error || 'Unknown error', 'error');
      }
    } catch (e) {
      showModal('❌', 'Error', e.message, 'error');
    }
    showLoading(false);
  });

  disconnectBtn.addEventListener('click', async () => {
    try {
      await chrome.runtime.sendMessage({ action: 'disconnect' });
      updateStatus(false, 0);
      showModal('👋', 'Disconnected', 'Connection closed', 'success');
    } catch (e) {
      showModal('❌', 'Error', e.message, 'error');
    }
  });

  openOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  openNewTab.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://www.wboke.com', active: false });
  });

  await checkStatus();

  setInterval(checkStatus, 3000);

  window.addEventListener('unload', () => {
    clearInterval(checkStatus);
  });
});
