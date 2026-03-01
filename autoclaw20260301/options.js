const DEFAULT_PORT = 18789;

function clampPort(value) {
  const n = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(n)) return DEFAULT_PORT;
  if (n <= 0 || n > 65535) return DEFAULT_PORT;
  return n;
}

function updateRelayUrl(port) {
  const el = document.getElementById('relay-url');
  if (!el) return;
  el.textContent = `ws://127.0.0.1:${port}/extension`;
}

function feedback(kind, msg) {
  const el = document.getElementById('feedback');
  if (!el) return;
  el.className = 'feedback ' + kind;
  el.textContent = msg;
  el.style.display = kind ? 'block' : 'none';
}

async function checkServer(port, token) {
  return new Promise((resolve) => {
    const wsUrl = `ws://127.0.0.1:${port}/extension?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);
    
    const timeout = setTimeout(() => {
      ws.close();
      resolve({ success: false, error: '连接超时' });
    }, 3000);
    
    ws.onopen = () => {
      clearTimeout(timeout);
      ws.close();
      resolve({ success: true });
    };
    
    ws.onerror = () => {
      clearTimeout(timeout);
      resolve({ success: false, error: '连接失败' });
    };
  });
}

async function load() {
  const stored = await chrome.storage.local.get([
    'relayPort', 'gatewayToken', 'authTimestamp', 'authHours',
    'autoAttachAll', 'openMode', 'maxTabs'
  ]);
  
  const port = clampPort(stored.relayPort);
  const token = String(stored.gatewayToken || '').trim();
  
  document.getElementById('port').value = String(port);
  document.getElementById('token').value = token;
  document.getElementById('autoAttachAll').checked = stored.autoAttachAll === true;
  document.getElementById('maxTabs').value = String(stored.maxTabs || 50);
  
  const openMode = stored.openMode || 'current';
  document.querySelectorAll('input[name="openMode"]').forEach(r => {
    r.checked = r.value === openMode;
  });
  
  updateRelayUrl(port);
  
  if (token) {
    const statusEl = document.getElementById('status');
    statusEl.style.display = 'block';
    statusEl.textContent = '正在检查连接...';
    statusEl.className = 'status';
    
    const result = await checkServer(port, token);
    if (result.success) {
      statusEl.textContent = '✅ Gateway 连接正常';
      statusEl.className = 'status connected';
    } else {
      statusEl.textContent = '❌ ' + (result.error || '无法连接到 Gateway');
      statusEl.className = 'status disconnected';
    }
  }
}

async function save() {
  const portInput = document.getElementById('port');
  const tokenInput = document.getElementById('token');
  const autoAttachAllInput = document.getElementById('autoAttachAll');
  const maxTabsInput = document.getElementById('maxTabs');
  
  const port = clampPort(portInput.value);
  const token = String(tokenInput.value || '').trim();
  const autoAttachAll = autoAttachAllInput.checked;
  const maxTabs = Number(maxTabsInput.value) || 50;
  
  const openMode = document.querySelector('input[name="openMode"]:checked')?.value || 'current';
  
  if (!token) {
    feedback('err', '请输入 Token');
    return;
  }
  
  const authHours = 24;
  const authTimestamp = Date.now();
  
  await chrome.storage.local.set({
    relayPort: port,
    gatewayToken: token,
    authTimestamp,
    authHours,
    autoAttachAll,
    openMode,
    maxTabs
  });
  
  portInput.value = String(port);
  tokenInput.value = token;
  
  updateRelayUrl(port);
  
  const result = await checkServer(port, token);
  if (result.success) {
    feedback('ok', '✅ 配置已保存，Gateway 连接正常！');
  } else {
    feedback('err', '⚠️ 配置已保存，但无法连接到 Gateway: ' + (result.error || '未知错误'));
  }
}

document.getElementById('save').addEventListener('click', () => void save());

void load();
