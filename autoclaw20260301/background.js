const DEFAULT_PORT = 18789;
const DEFAULT_AUTH_HOURS = 24;
const DEFAULT_MAX_TABS = 50;

const BADGE = {
  off: { text: '', color: '#000000' },
  connecting: { text: '…', color: '#F59E0B' },
  on: { text: 'ON', color: '#10B981' },
  error: { text: '!', color: '#EF4444' },
};

let relayWs = null;
let relayConnectPromise = null;
let debuggerListenersInstalled = false;
let autoAttachAllMode = false;

let nextSession = 1;

const tabs = new Map();
const tabBySession = new Map();
const childSessionToTab = new Map();
const pending = new Map();

function generateMessageId() {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function getConfig() {
  const stored = await chrome.storage.local.get([
    'relayPort', 'gatewayToken', 'authTimestamp', 'authHours',
    'autoAttachAll', 'openMode', 'maxTabs'
  ]);
  const port = Number.parseInt(String(stored.relayPort || ''), 10) || DEFAULT_PORT;
  const token = String(stored.gatewayToken || '').trim();
  const timestamp = Number(stored.authTimestamp) || 0;
  const authHours = Number(stored.authHours) || DEFAULT_AUTH_HOURS;
  const autoAttachAll = stored.autoAttachAll === true;
  const openMode = stored.openMode || 'current';
  const maxTabs = Number(stored.maxTabs) || DEFAULT_MAX_TABS;
  return { port, token, timestamp, authHours, autoAttachAll, openMode, maxTabs };
}

async function isAuthValid(timestamp) {
  if (!timestamp) return false;
  return Date.now() < timestamp + (24 * 60 * 60 * 1000);
}

function setBadge(tabId, kind) {
  const cfg = BADGE[kind];
  chrome.action.setBadgeText({ tabId, text: cfg.text });
  chrome.action.setBadgeBackgroundColor({ tabId, color: cfg.color });
}

async function ensureRelayConnection() {
  if (relayWs && relayWs.readyState === WebSocket.OPEN) return;
  if (relayConnectPromise) return await relayConnectPromise;

  const allTabs = await chrome.tabs.query({});
  for (const tab of allTabs) {
    if (tab.id) setBadge(tab.id, 'connecting');
  }

  relayConnectPromise = (async () => {
    const { port, token } = await getConfig();
    
    if (!token) {
      throw new Error('请先在扩展设置中配置授权 Token');
    }

    const wsUrl = `ws://127.0.0.1:${port}/extension?token=${encodeURIComponent(token)}`;
    console.log('[AutoClaw] 尝试连接到 Gateway:', wsUrl);

    const socket = new WebSocket(wsUrl);
    relayWs = socket;

    await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('WebSocket 连接超时')), 5000);
      socket.onopen = () => { clearTimeout(t); resolve(); };
      socket.onerror = () => { clearTimeout(t); reject(new Error('WebSocket 连接失败')); };
      socket.onclose = (ev) => { clearTimeout(t); reject(new Error(`连接关闭: ${ev.code}`)); };
    });

    socket.onmessage = (event) => onRelayMessage(String(event.data));
    socket.onclose = () => onRelayClosed('closed');
    socket.onerror = () => onRelayClosed('error');

    if (!debuggerListenersInstalled) {
      debuggerListenersInstalled = true;
      chrome.debugger.onEvent.addListener(onDebuggerEvent);
      chrome.debugger.onDetach.addListener(onDebuggerDetach);
    }
  })();

  try {
    await relayConnectPromise;
  } finally {
    relayConnectPromise = null;
  }
}

async function onRelayClosed(reason) {
  relayWs = null;
  for (const [, p] of pending.entries()) {
    pending.delete(p.id);
    p.reject(new Error(`连接断开: ${reason}`));
  }
  for (const tabId of tabs.keys()) {
    detachTab(tabId, 'disconnect');
  }
  tabs.clear();
  tabBySession.clear();
  childSessionToTab.clear();
  
  const allTabs = await chrome.tabs.query({});
  for (const tab of allTabs) {
    if (tab.id) setBadge(tab.id, 'off');
  }
}

function sendToRelay(payload) {
  return new Promise((resolve, reject) => {
    if (!relayWs || relayWs.readyState !== WebSocket.OPEN) {
      return reject(new Error('未连接到 Gateway'));
    }
    const id = generateMessageId();
    pending.set(id, { resolve, reject, id });
    relayWs.send(JSON.stringify({ ...payload, id }));
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error('请求超时'));
      }
    }, 30000);
  });
}

function onRelayMessage(data) {
  let msg;
  try { msg = JSON.parse(data); } catch { return; }
  
  if (msg.id && pending.has(msg.id)) {
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(String(msg.error)));
    else p.resolve(msg.result);
    return;
  }

  if (msg.method === 'Target.attachToTarget') {
    const tabId = Number(msg.params.tabId);
    if (tabId && tabs.has(tabId)) {
      tabs.get(tabId).targetId = msg.params.targetId;
    }
  }
}

async function onDebuggerEvent(source, method, params) {
  const tabId = source.tabId;
  if (!tabId || !tabs.has(tabId)) return;
  
  const tab = tabs.get(tabId);
  if (method === 'Page.frameNavigated' && params.frame.url === 'about:blank') return;
  
  if (method === 'Runtime.consoleAPICalled' && params.type === 'log') {
    console.log(`[Tab ${tabId}]`, ...params.args.map(a => a.value));
  }
}

function onDebuggerDetach(source, reason) {
  const tabId = source.tabId;
  if (!tabId) return;
  detachTab(tabId, reason);
}

async function attachTab(tabId) {
  const existing = tabs.get(tabId);
  if (existing?.state === 'connected') return;
  
  tabs.set(tabId, { state: 'connecting', sessionId: String(nextSession++) });
  
  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    await chrome.debugger.sendCommand({ tabId }, 'Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, filter: [{ type: 'page' }] });
    tabs.get(tabId).state = 'connected';
    setBadge(tabId, 'on');
  } catch (err) {
    tabs.delete(tabId);
    setBadge(tabId, 'error');
    throw err;
  }
}

async function detachTab(tabId, reason) {
  const tab = tabs.get(tabId);
  if (!tab) return;
  
  try { await chrome.debugger.detach({ tabId }); } catch {}
  tabs.delete(tabId);
  setBadge(tabId, 'off');
}

async function connectOrToggleForActiveTab() {
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = active?.id;
  if (!tabId) return;

  const { timestamp, autoAttachAll } = await getConfig();
  if (!(await isAuthValid(timestamp))) {
    chrome.runtime.openOptionsPage();
    return;
  }

  const existing = tabs.get(tabId);
  if (existing?.state === 'connected') {
    await detachTab(tabId, 'toggle');
    return;
  }

  tabs.set(tabId, { state: 'connecting' });
  setBadge(tabId, 'connecting');

  try {
    await ensureRelayConnection();
    await attachTab(tabId);
    setBadge(tabId, 'on');
  } catch (err) {
    tabs.delete(tabId);
    setBadge(tabId, 'error');
    console.warn('attach failed', err.message);
  }
}

chrome.action.onClicked.addListener(() => void connectOrToggleForActiveTab());

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onStartup.addListener(() => {
  initializeAllTabs();
});

async function initializeAllTabs() {
  const allTabs = await chrome.tabs.query({});
  for (const tab of allTabs) {
    if (tab.id) {
      setBadge(tab.id, 'off');
    }
  }
}

setInterval(async () => {
  const { timestamp, autoAttachAll } = await getConfig();
  if (isAuthValid(timestamp) && autoAttachAll) {
    try {
      await ensureRelayConnection();
    } catch {}
  }
}, 30000);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'tryConnect') {
    await ensureRelayConnection();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'disconnect') {
    if (relayWs) {
      relayWs.close();
      relayWs = null;
    }
    sendResponse({ success: true });
    return true;
  }
});
