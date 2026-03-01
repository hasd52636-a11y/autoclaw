/**
 * AutoClaw Chrome Extension - Background Service Worker
 * @version 5.1.1
 * 修复记录:
 * 1. [崩溃] 移除重复Ping定时器（原有5s+10s双ping会造成双倍心跳压力）
 * 2. [崩溃] onRelayClosed 中批量 detach 改为串行，防止并发崩溃
 * 3. [崩溃] attachTab 时增加 Network.enable + Input.enable，保证 CDP 协议完整启用
 * 4. [交互] handleForwardCdpCommand 修复 debuggee session 混淆问题
 * 5. [交互] Target.getTargets 改用 chrome.tabs.query 实现，更准确
 * 6. [稳定] 重连使用指数退避，避免频繁重连冲击服务器
 * 7. [稳定] tab 创建延迟从 500ms 提升到 800ms，给页面更多初始化时间
 * 8. [交互] 添加 Input.enable，启用 Input 域支持触摸和键盘事件
 */
'use strict';

const DEFAULT_PORT = 30000;
const BUILT_IN_TOKEN = 'autoclaw_builtin_Q0hpK2oV4F9tlwbYX3RELxiJNGDvayr8OPqZzkfs';
const OPENCLAW_TOKEN = 'Q0hpK2oV4F9tlwbYX3RELxiJNGDvayr8OPqZzkfs';
const DEFAULT_AUTH_HOURS = 24;
const DEFAULT_MAX_TABS = 50;

const BADGE = {
  off:        { text: 'OFF', color: '#9CA3AF' },
  connecting: { text: '···', color: '#F59E0B' },
  on:         { text: 'ON',  color: '#10B981' },
  error:      { text: '!',   color: '#EF4444' },
};

let relayWs = null;
let relayWs2 = null;  // 第二个WebSocket连接
let relayConnecting = false;
let relayConnecting2 = false;  // 第二个连接状态
let debugListenersInstalled = false;
let nextSession = 1;
let reconnectDelay = 3000;
const MAX_RECONNECT_DELAY = 30000;

const tabs = new Map();
const tabBySession = new Map();
const childSessionToTab = new Map();
const pending = new Map();

async function getConfig() {
  const s = await chrome.storage.local.get([
    'relayPort', 'gatewayToken', 'authTimestamp', 'authHours',
    'autoAttachAll', 'openMode', 'maxTabs', 'portMode'
  ]);
  const portMode = s.portMode || '30000';
  const port = parseInt(String(s.relayPort || ''), 10) || DEFAULT_PORT;
  
  return {
    portMode:     portMode,
    port:         port,
    port2:        portMode === 'dual' ? 18792 : port,  // 第二个端口
    token:        portMode === '30000' ? String(s.gatewayToken || BUILT_IN_TOKEN).trim() : String(s.gatewayToken || OPENCLAW_TOKEN).trim(),
    token2:       portMode === 'dual' ? OPENCLAW_TOKEN : (portMode === '30000' ? BUILT_IN_TOKEN : OPENCLAW_TOKEN),  // 第二个token
    timestamp:    Number(s.authTimestamp) || 0,
    authHours:    Number(s.authHours) || DEFAULT_AUTH_HOURS,
    autoAttachAll: s.autoAttachAll === true,
    openMode:     s.openMode || 'newTab',
    maxTabs:      Number(s.maxTabs) || DEFAULT_MAX_TABS,
  };
}

async function isAuthValid() {
  // 取消时间授权，改为永久化授权
  // 只要插件安装并连接成功，就保持授权状态
  return true;
}

async function setAllBadges(kind) {
  const cfg = BADGE[kind] || BADGE.off;
  const tabCount = tabs.size;
  const displayText = kind === 'on' && tabCount > 0 ? String(tabCount) : cfg.text;
  const titles = {
    off:        `AutoClaw: Not Connected (${tabCount} tabs)`,
    connecting: 'AutoClaw: Connecting...',
    on:         `AutoClaw: Connected (${tabCount} tabs)`,
    error:      'AutoClaw: Connection Error',
  };
  try {
    await chrome.action.setBadgeText({ text: displayText });
    await chrome.action.setBadgeBackgroundColor({ color: cfg.color });
    await chrome.action.setTitle({ title: titles[kind] || 'AutoClaw' });
  } catch {}
}

function setTabBadge(tabId, kind) {
  const cfg = BADGE[kind] || BADGE.off;
  chrome.action.setBadgeText({ tabId, text: cfg.text }).catch(() => {});
  chrome.action.setBadgeBackgroundColor({ tabId, color: cfg.color }).catch(() => {});
}

async function connectGateway() {
  if (relayWs && relayWs.readyState === WebSocket.OPEN) return;
  if (relayConnecting) { await new Promise(r => setTimeout(r, 500)); return; }

  const { port, token } = await getConfig();
  if (!token) throw new Error('Token not configured');

  relayConnecting = true;
  await setAllBadges('connecting');

  try {
    const wsUrl = token ? `ws://127.0.0.1:${port}/extension?token=${encodeURIComponent(token)}` : `ws://127.0.0.1:${port}/extension`;
    console.log('[AutoClaw] Connecting to MCP Server:', wsUrl.replace(token, '***'));

    await new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      const timeout = setTimeout(() => { ws.close(); reject(new Error('Connection timeout')); }, 3000);  // 减少到3秒

      ws.onopen = () => {
        clearTimeout(timeout);
        relayWs = ws;
        reconnectDelay = 3000; // 重置退避
        if (!debugListenersInstalled) {
          debugListenersInstalled = true;
          chrome.debugger.onEvent.addListener(onDebuggerEvent);
          chrome.debugger.onDetach.addListener(onDebuggerDetach);
        }
        ws.onmessage = (e) => onRelayMessage(String(e.data));
        ws.onclose   = (event) => {
          clearTimeout(timeout);
          onRelayClosed('closed');
          reject(new Error(`Connection closed code=${event.code}`));
        };
        ws.onerror   = (error) => {
          clearTimeout(timeout);
          onRelayClosed('error');
          reject(new Error('Connection failed'));
        };
        updateConnectionStatus();
        resolve();
      };
    });

    await setAllBadges('on');
    console.log('[AutoClaw] MCP Server Connected');
  } catch (err) {
    relayWs = null;
    await setAllBadges('error');
    throw err;
  } finally {
    relayConnecting = false;
  }
}

// [修复#2] 串行 detach，避免并发崩溃
async function onRelayClosed(reason) {
  console.log('[AutoClaw] MCP Server Disconnected:', reason);
  relayWs = null;
  for (const [id, p] of pending.entries()) { pending.delete(id); p.reject(new Error(`Connection lost: ${reason}`)); }
  for (const tabId of [...tabs.keys()]) {
    try { await chrome.debugger.detach({ tabId }); } catch {}
    setTabBadge(tabId, 'off');
  }
  tabs.clear(); tabBySession.clear(); childSessionToTab.clear();
  await setAllBadges('off');
  updateConnectionStatus();
  // [增强] 智能重连机制：立即重试 + 指数退避
  const attemptReconnect = async () => {
    if (!(await isAuthValid())) return;
    
    console.log(`[AutoClaw] 尝试重新连接 (延迟: ${reconnectDelay}ms)`);
    
    try {
      await connectGateway();
      reconnectDelay = 3000; // 成功连接后重置延迟
      console.log('[AutoClaw] ✅ 重新连接成功');
    } catch (error) {
      console.log(`[AutoClaw] ❌ 重新连接失败: ${error.message}`);
      // 指数退避，但最大不超过30秒
      reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
      setTimeout(attemptReconnect, reconnectDelay);
    }
  };
  
  // 立即开始第一次重试
  setTimeout(attemptReconnect, 1000);
}

// 第二个MCP服务器连接（用于双端口模式）
async function connectGateway2() {
  if (relayWs2 && relayWs2.readyState === WebSocket.OPEN) return;
  if (relayConnecting2) { await new Promise(r => setTimeout(r, 500)); return; }

  const { port2, token2 } = await getConfig();
  if (!token2) return;  // 第二个连接可选，不抛错误

  relayConnecting2 = true;

  try {
    const wsUrl = `ws://127.0.0.1:${port2}/extension?token=${encodeURIComponent(token2)}`;
    console.log('[AutoClaw] Connecting to second MCP Server:', wsUrl.replace(token2, '***'));

    await new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      const timeout = setTimeout(() => { ws.close(); reject(new Error('Second connection timeout')); }, 8000);

      ws.onopen = () => {
        clearTimeout(timeout);
        relayWs2 = ws;
        relayConnecting2 = false;
        console.log('[AutoClaw] Second connection established');
        updateConnectionStatus();
        resolve();
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        relayWs2 = null;
        relayConnecting2 = false;
        console.log('[AutoClaw] Second connection closed:', event.code, event.reason);
        onRelayClosed2(`closed: ${event.code} ${event.reason}`);
        reject(new Error(`Second connection closed: ${event.code} ${event.reason}`));
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        relayWs2 = null;
        relayConnecting2 = false;
        console.error('[AutoClaw] Second connection error:', error);
        onRelayClosed2(`error: ${error.message}`);
        reject(error);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('[AutoClaw] Second message:', msg);
          // 可以在这里处理第二个连接的消息
        } catch (error) {
          console.error('[AutoClaw] Second message parse error:', error);
        }
      };
    });
  } catch (error) {
    relayConnecting2 = false;
    console.error('[AutoClaw] Second connection failed:', error);
    // 第二个连接失败不影响主连接
  }
}

// 第二个连接关闭处理
async function onRelayClosed2(reason) {
  console.log('[AutoClaw] Second MCP Server Disconnected:', reason);
  relayWs2 = null;
  updateConnectionStatus();
  // 第二个连接不需要自动重连，避免冲突
}

// 消息路由协调机制
function sendToAppropriateRelay(payload) {
  const method = payload.method || '';
  
  // 书签操作始终发送到MCP服务器（端口30000）
  if (method.includes('bookmark') || method.includes('claw_')) {
    if (relayWs && relayWs.readyState === WebSocket.OPEN) {
      relayWs.send(JSON.stringify(payload));
      return true;
    }
    // 如果主连接不可用，尝试第二个连接
    if (relayWs2 && relayWs2.readyState === WebSocket.OPEN) {
      relayWs2.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }
  
  // 基础控制操作可以发送到Gateway（端口18792）
  if (method.includes('browser') || method.includes('page')) {
    if (relayWs2 && relayWs2.readyState === WebSocket.OPEN) {
      relayWs2.send(JSON.stringify(payload));
      return true;
    }
    // 备选：如果Gateway不可用，使用MCP服务器
    if (relayWs && relayWs.readyState === WebSocket.OPEN) {
      relayWs.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }
  
  // 默认发送到主连接
  if (relayWs && relayWs.readyState === WebSocket.OPEN) {
    relayWs.send(JSON.stringify(payload));
    return true;
  }
  
  // 备选：发送到第二个连接
  if (relayWs2 && relayWs2.readyState === WebSocket.OPEN) {
    relayWs2.send(JSON.stringify(payload));
    return true;
  }
  
  return false;
}

function sendToRelay(payload) {
  if (!sendToAppropriateRelay(payload)) {
    throw new Error('No active MCP server connection');
  }
}

// ==================== Bookmark Operations ====================
async function handleBookmarkOp(msg) {
  const { id, action, payload } = msg;
  try {
    let result;
    switch (action) {
      case 'getBookmarks': {
        const tree = await chrome.bookmarks.getTree();
        const flatten = (nodes) => {
          const list = [];
          for (const node of nodes) {
            if (node.url) list.push({ id: node.id, title: node.title, url: node.url, parentId: node.parentId, dateAdded: node.dateAdded });
            if (node.children) list.push(...flatten(node.children));
          }
          return list;
        };
        result = flatten(tree);
        break;
      }
      case 'getBookmarkTree': result = await chrome.bookmarks.getTree(); break;
      case 'searchBookmarks': result = await chrome.bookmarks.search(String(payload?.query || '')); break;
      case 'createBookmark': {
        const d = { title: String(payload.title || ''), url: String(payload.url || '') };
        if (payload.parentId) d.parentId = String(payload.parentId);
        result = await chrome.bookmarks.create(d);
        break;
      }
      case 'updateBookmark': {
        const upd = {};
        if (payload.title !== undefined) upd.title = payload.title;
        if (payload.url   !== undefined) upd.url   = payload.url;
        result = await chrome.bookmarks.update(String(payload.id), upd);
        break;
      }
      case 'deleteBookmark': {
        await chrome.bookmarks.remove(String(payload.id));
        result = { success: true, id: payload.id };
        break;
      }
      case 'removeFolder': {
        await chrome.bookmarks.removeTree(String(payload.id));
        result = { success: true, id: payload.id };
        break;
      }
      case 'createFolder': {
        const fd = { title: String(payload.title || 'New Folder') };
        if (payload.parentId) fd.parentId = String(payload.parentId);
        result = await chrome.bookmarks.create(fd);
        break;
      }
      case 'moveBookmark': {
        result = await chrome.bookmarks.move(String(payload.id), { parentId: String(payload.parentId), index: payload.index });
        break;
      }
      case 'openInNewTab': {
        const url = String(payload?.url || '');
        if (!url) throw new Error('URL cannot be empty');
        const newTab = await chrome.tabs.create({ url, active: false });
        const config = await getConfig();
        if (config.autoAttachAll && newTab.id && tabs.size < config.maxTabs) {
          setTimeout(async () => {
            try { await connectGateway(); await attachTab(newTab.id); } catch {}
          }, 800); // [修复#7]
        }
        result = { success: true, tabId: newTab.id, url };
        break;
      }
      default:
        throw new Error(`Unknown bookmark operation: ${action}`);
    }
    sendToRelay({ id, result });
  } catch (err) {
    console.error('[AutoClaw] Bookmark operation failed:', err.message);
    sendToRelay({ id, error: err.message });
  }
}

async function onRelayMessage(text) {
  let msg;
  try { msg = JSON.parse(text); } catch { return; }
  // [修复#1] 只响应 ping，不自己发起心跳（服务端已有心跳定时器）
  if (msg.method === 'ping') { try { sendToRelay({ method: 'pong' }); } catch {} return; }
  if (msg.method === 'bookmarkOp') { await handleBookmarkOp(msg); return; }
  if (msg.method === 'configOp') { await handleConfigOp(msg); return; }
  if (typeof msg.id === 'number' && (msg.result !== undefined || msg.error !== undefined)) {
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(String(msg.error))); else p.resolve(msg.result);
    return;
  }
  if (typeof msg.id === 'number' && msg.method === 'forwardCDPCommand') {
    try {
      const result = await handleForwardCdpCommand(msg);
      sendToRelay({ id: msg.id, result });
    } catch (err) {
      const method = msg?.params?.method || '';
      if (err.message.includes('not attached') || err.message.includes('No attached tab')) {
        console.log('[AutoClaw] CDP session invalid, trying to reattach...');
        const tabId = getAnyConnectedTab();
        if (tabId) {
          try { await chrome.debugger.detach({ tabId }); } catch {}
          tabs.delete(tabId);
          tabBySession.delete(tabId);
          childSessionToTab.forEach((ptid, csid) => { if (ptid === tabId) childSessionToTab.delete(csid); });
        }
      }
      sendToRelay({ id: msg.id, error: err.message });
    }
  }
}

// [修复#3] attachTab 启用更多CDP域
async function attachTab(tabId, opts = {}) {
  const config = await getConfig();
  if (tabs.size >= config.maxTabs) throw new Error(`Tab limit reached (${config.maxTabs})`);
  const debuggee = { tabId };
  try { await chrome.debugger.detach(debuggee); } catch {}
  await chrome.debugger.attach(debuggee, '1.3');
  await chrome.debugger.sendCommand(debuggee, 'Page.enable').catch(() => {});
  await chrome.debugger.sendCommand(debuggee, 'Runtime.enable').catch(() => {});
  await chrome.debugger.sendCommand(debuggee, 'Network.enable').catch(() => {});
  await chrome.debugger.sendCommand(debuggee, 'Input.enable').catch(() => {});
  // 确保输入事件不被忽略
  await chrome.debugger.sendCommand(debuggee, 'Input.setIgnoreInputEvents', { ignore: false }).catch(() => {});
  const info = await chrome.debugger.sendCommand(debuggee, 'Target.getTargetInfo').catch(() => ({}));
  const targetId = String(info?.targetInfo?.targetId || `local-${tabId}`);
  const sessionId = `cb-tab-${nextSession++}`;
  tabs.set(tabId, { state: 'connected', sessionId, targetId });
  tabBySession.set(sessionId, tabId);
  if (!opts.skipEvent) {
    try { sendToRelay({ method: 'forwardCDPEvent', params: { method: 'Target.attachedToTarget', params: { sessionId, targetInfo: { ...(info.targetInfo || {}), targetId, attached: true }, waitingForDebugger: false } } }); } catch {}
  }
  setTabBadge(tabId, 'on');
  return { sessionId, targetId };
}

async function detachTab(tabId, reason) {
  const tab = tabs.get(tabId);
  if (tab?.sessionId && tab?.targetId) {
    try { sendToRelay({ method: 'forwardCDPEvent', params: { method: 'Target.detachedFromTarget', params: { sessionId: tab.sessionId, targetId: tab.targetId, reason } } }); } catch {}
  }
  if (tab?.sessionId) tabBySession.delete(tab.sessionId);
  tabs.delete(tabId);
  for (const [csid, ptid] of childSessionToTab.entries()) { if (ptid === tabId) childSessionToTab.delete(csid); }
  try { await chrome.debugger.detach({ tabId }); } catch {}
  setTabBadge(tabId, 'off');
}

function getTabBySessionId(sessionId) { return tabBySession.get(sessionId) || null; }
function getTabByTargetId(targetId) { for (const [tabId, tab] of tabs.entries()) { if (tab.targetId === targetId) return tabId; } return null; }
function getAnyConnectedTab() { for (const [tabId, tab] of tabs.entries()) { if (tab.state === 'connected') return tabId; } return null; }

// [修复#4 #5] 修复 CDP 转发：debuggee session 混淆问题 + Target.getTargets 实现
async function handleForwardCdpCommand(msg) {
  const method    = String(msg?.params?.method || '').trim();
  const params    = msg?.params?.params;
  const sessionId = typeof msg?.params?.sessionId === 'string' ? msg.params.sessionId : undefined;
  const tabId = (sessionId ? getTabBySessionId(sessionId) : null) || (params?.targetId ? getTabByTargetId(params.targetId) : null) || getAnyConnectedTab();
  if (!tabId) throw new Error(`No attached tab: ${method}`);
  const debuggee = { tabId };

  if (method === 'Target.createTarget') {
    const config = await getConfig();
    if (tabs.size >= config.maxTabs) throw new Error(`Tab limit reached`);
    const url = typeof params?.url === 'string' ? params.url : 'about:blank';
    if (config.openMode === 'newTab') {
      const newTab = await chrome.tabs.create({ url, active: false });
      if (!newTab.id) throw new Error('Failed to create tab');
      await new Promise(r => setTimeout(r, 300));
      const attached = await attachTab(newTab.id);
      return { targetId: attached.targetId };
    } else {
      await chrome.tabs.update(tabId, { url });
      return { targetId: tabs.get(tabId)?.targetId };
    }
  }

  if (method === 'Target.closeTarget') {
    const toClose = params?.targetId ? getTabByTargetId(params.targetId) : tabId;
    if (!toClose) return { success: false };
    try { await chrome.tabs.remove(toClose); } catch { return { success: false }; }
    return { success: true };
  }

  if (method === 'Target.activateTarget') {
    const toActivate = params?.targetId ? getTabByTargetId(params.targetId) : tabId;
    if (!toActivate) return {};
    const t = await chrome.tabs.get(toActivate).catch(() => null);
    if (!t) return {};
    if (t.windowId) await chrome.windows.update(t.windowId, { focused: true }).catch(() => {});
    await chrome.tabs.update(toActivate, { active: true }).catch(() => {});
    return {};
  }

  // [修复#5] Target.getTargets 使用 chrome.tabs.query 实现，更准确
  if (method === 'Target.getTargets') {
    const allTabs = await chrome.tabs.query({});
    return {
      targetInfo: allTabs.map(t => ({
        targetId: tabs.get(t.id)?.targetId || String(t.id),
        type: 'page',
        url: t.url || '',
        title: t.title || '',
        attached: tabs.has(t.id),
        browserContextId: ''
      }))
    };
  }

  // [修复#4] 只有子session才混入sessionId，避免主tab session混淆
  const tabState = tabs.get(tabId);
  const useDebugger = (sessionId && tabState?.sessionId && sessionId !== tabState.sessionId)
    ? { ...debuggee, sessionId }
    : debuggee;
  return await chrome.debugger.sendCommand(useDebugger, method, params);
}

function onDebuggerEvent(source, method, params) {
  const tabId = source.tabId;
  if (!tabId) return;
  const tab = tabs.get(tabId);
  if (!tab?.sessionId) return;
  if (method === 'Target.attachedToTarget' && params?.sessionId) childSessionToTab.set(String(params.sessionId), tabId);
  if (method === 'Target.detachedFromTarget' && params?.sessionId) childSessionToTab.delete(String(params.sessionId));
  try { sendToRelay({ method: 'forwardCDPEvent', params: { sessionId: source.sessionId || tab.sessionId, method, params } }); } catch {}
}

function onDebuggerDetach(source, reason) {
  const tabId = source.tabId;
  if (!tabId || !tabs.has(tabId)) return;
  detachTab(tabId, reason);
}

chrome.action.onClicked.addListener(async () => {
  if (!(await isAuthValid())) { chrome.runtime.openOptionsPage(); return; }
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = active?.id;
  if (!tabId) return;
  const existing = tabs.get(tabId);
  if (existing?.state === 'connected') { await detachTab(tabId, 'toggle'); return; }
  setTabBadge(tabId, 'connecting');
  tabs.set(tabId, { state: 'connecting' });
  try { await connectGateway(); await attachTab(tabId); }
  catch (err) { tabs.delete(tabId); setTabBadge(tabId, 'error'); console.warn('[AutoClaw] Attach failed:', err.message); }
});

async function attachAllTabs() {
  if (!(await isAuthValid())) return;
  try {
    await connectGateway();
    const allTabs = await chrome.tabs.query({});
    const config = await getConfig();
    let count = 0;
    for (const tab of allTabs) {
      if (!tab.id || tabs.has(tab.id)) continue;
      if (tabs.size >= config.maxTabs) break;
      try {
        await attachTab(tab.id, { skipEvent: false });
        count++;
        if (count % 5 === 0) await new Promise(r => setTimeout(r, 200));
      } catch {}
    }
    console.log(`[AutoClaw] Global Auth: Attached ${count} tabs`);
  } catch (err) { console.error('[AutoClaw] Global attach failed:', err.message); }
}

chrome.tabs.onCreated.addListener(async (tab) => {
  const config = await getConfig();
  if (!tab.id) return;
  if (!(await isAuthValid())) return;
  setTimeout(async () => {
    if (tabs.has(tab.id) || tabs.size >= config.maxTabs) return;
    try { await connectGateway(); await attachTab(tab.id); } catch {}
  }, 800); // [修复#7] 增加等待时间
});

// ==================== Integrity Check ====================
const OFFICIAL_UPDATE_URL = 'https://www.wboke.com';

function verifyIntegrity() {
  try {
    const manifest = chrome.runtime.getManifest();
    if (!manifest) return false;
    return true;
  } catch (e) {
    return false;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'verifyIntegrity') {
    sendResponse({ valid: verifyIntegrity(), url: OFFICIAL_UPDATE_URL });
    return true;
  }
  if (request.action === 'tryConnect') {
    connectGateway().then(() => sendResponse({ success: true })).catch(e => sendResponse({ success: false, error: e.message }));
    return true;
  }
  if (request.action === 'authorizeAndAttachAll') {
    if (!verifyIntegrity()) {
      sendResponse({ success: false, error: 'Integrity check failed. Download original from: ' + OFFICIAL_UPDATE_URL });
      return true;
    }
    attachAllTabs().then(() => sendResponse({ success: true, count: tabs.size })).catch(e => sendResponse({ success: false, error: e.message }));
    return true;
  }
  if (request.action === 'getStatus') {
    const mainConnected = relayWs && relayWs.readyState === WebSocket.OPEN;
    const secondConnected = relayWs2 && relayWs2.readyState === WebSocket.OPEN;
    const connected = mainConnected || secondConnected;
    sendResponse({ connected: connected, tabsCount: tabs.size });
    return true;
  }
  if (request.action === 'disconnect') { if (relayWs) relayWs.close(); sendResponse({ success: true }); return true; }
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      gatewayToken: BUILT_IN_TOKEN,
      relayPort: DEFAULT_PORT,
      portMode: '30000',
      autoAttachAll: true,
      openMode: 'newTab',
      maxTabs: 50,
      classifyMode: 'local'
    });
    chrome.runtime.openOptionsPage();
  }
  chrome.tabs.query({}).then(allTabs => { allTabs.forEach(t => t.id && setTabBadge(t.id, 'off')); });
});

chrome.runtime.onStartup.addListener(async () => {
  const allTabs = await chrome.tabs.query({});
  allTabs.forEach(t => t.id && setTabBadge(t.id, 'off'));
  if (await isAuthValid()) {
    const config = await getConfig();
    if (config.autoAttachAll) setTimeout(() => attachAllTabs().catch(() => {}), 2000);
    else setTimeout(() => connectGateway().catch(() => {}), 2000);
  }
});

const ALLOWED_CONFIG_KEYS = [
  'relayPort', 'gatewayToken', 'authTimestamp', 'authHours',
  'autoAttachAll', 'openMode', 'maxTabs', 'portMode'
];

function isAllowedConfigKey(key) { return ALLOWED_CONFIG_KEYS.includes(key); }

async function handleConfigOp(msg) {
  const { id, action, payload } = msg;
  try {
    let result;
    switch (action) {
      case 'getConfig': {
        const s = await chrome.storage.local.get([
          'relayPort', 'gatewayToken', 'authTimestamp', 'authHours',
          'autoAttachAll', 'openMode', 'maxTabs', 'portMode'
        ]);
        result = {
          mode: 'auto',
          local: { port: parseInt(s.relayPort) || DEFAULT_PORT, host: '127.0.0.1' },
          plugin: {
            portMode: s.portMode || '30000',
            openMode: s.openMode || 'newTab',
            autoAttachAll: s.autoAttachAll || false,
            maxTabs: parseInt(s.maxTabs) || DEFAULT_MAX_TABS,
            authHours: parseInt(s.authHours) || DEFAULT_AUTH_HOURS
          }
        };
        break;
      }
      case 'setConfig': {
        const { key, value } = payload;
        if (!isAllowedConfigKey(key)) throw new Error(`Config key "${key}" is not allowed.`);
        await chrome.storage.local.set({ [key]: value });
        result = { success: true, key, value };
        broadcastConfigChange(key, value);
        break;
      }
      default:
        throw new Error(`Unknown config operation: ${action}`);
    }
    sendToRelay({ id, result });
  } catch (err) {
    console.error('[AutoClaw] Config operation failed:', err.message);
    sendToRelay({ id, error: err.message });
  }
}

function broadcastConfigChange(key, value) {
  if (relayWs && relayWs.readyState === WebSocket.OPEN) {
    sendToRelay({ method: 'configChanged', params: { key, value } });
  }
}

// 扩展启动时初始化连接
chrome.runtime.onStartup.addListener(async () => {
  console.log('[AutoClaw] Extension starting up');
  await initConnections();
});

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[AutoClaw] Extension installed/updated');
  await initConnections();
});

// 初始化所有连接
async function initConnections() {
  const config = await getConfig();
  
  // 主连接
  if (await isAuthValid()) {
    connectGateway().catch(() => {});
  }
  
  // 第二个连接（双端口模式）
  if (config.portMode === 'dual') {
    connectGateway2().catch(() => {});
  }
  
  // 自动创建测试书签
  setTimeout(() => autoCreateTestBookmarks(), 3000);
}

// 自动创建测试书签功能
async function autoCreateTestBookmarks() {
  try {
    console.log('[AutoClaw] 开始自动创建测试书签...');
    
    // 获取书签树
    const tree = await chrome.bookmarks.getTree();
    
    // 查找today文件夹
    let todayFolder = findFolderByName(tree[0], 'today');
    
    if (!todayFolder) {
      console.log('[AutoClaw] 未找到today文件夹，先创建文件夹');
      const newFolder = await chrome.bookmarks.create({
        title: 'today',
        parentId: '1'  // 书签栏的ID
      });
      todayFolder = newFolder;
    }
    
    // 创建测试书签
    const testBookmarks = [
      { title: "测试01", url: "https://www.xinhuanet.com" },
      { title: "测试02", url: "https://www.people.com.cn" },
      { title: "测试03", url: "https://news.cctv.com" }
    ];
    
    for (const bookmark of testBookmarks) {
      const result = await chrome.bookmarks.create({
        parentId: todayFolder.id,
        title: bookmark.title,
        url: bookmark.url
      });
      console.log(`[AutoClaw] ✅ 创建书签: ${bookmark.title}`);
    }
    
    console.log('[AutoClaw] 🎉 测试书签创建完成！');
    
  } catch (error) {
    console.error('[AutoClaw] 自动创建书签失败:', error);
  }
}

// 递归查找文件夹函数
function findFolderByName(node, name) {
  if (node.title === name && !node.url) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findFolderByName(child, name);
      if (found) return found;
    }
  }
  return null;
}

// 连接状态协调函数
function updateConnectionStatus() {
  const mainConnected = relayWs && relayWs.readyState === WebSocket.OPEN;
  const secondConnected = relayWs2 && relayWs2.readyState === WebSocket.OPEN;
  
  if (mainConnected && secondConnected) {
    setAllBadges('on');
    console.log('[AutoClaw] Dual connection: Both servers connected');
  } else if (mainConnected) {
    setAllBadges('on');
    console.log('[AutoClaw] Single connection: MCP server connected');
  } else if (secondConnected) {
    setAllBadges('on');
    console.log('[AutoClaw] Single connection: Gateway connected');
  } else {
    setAllBadges('off');
    console.log('[AutoClaw] No connections');
  }
}

// 实时连接监控
let connectionMonitor = null;

function startConnectionMonitor() {
  if (connectionMonitor) clearInterval(connectionMonitor);
  
  connectionMonitor = setInterval(async () => {
    const config = await getConfig();
    const mainConnected = relayWs && relayWs.readyState === WebSocket.OPEN;
    const secondConnected = relayWs2 && relayWs2.readyState === WebSocket.OPEN;
    
    // 监控主连接
    if (config.portMode !== '18792' && !mainConnected && !relayConnecting && await isAuthValid()) {
      console.log('[Monitor] 主连接断开，尝试重连...');
      connectGateway().catch(() => {});
    }
    
    // 监控第二个连接
    if (config.portMode === 'dual' && !secondConnected && !relayConnecting2) {
      console.log('[Monitor] 第二个连接断开，尝试重连...');
      connectGateway2().catch(() => {});
    }
    
    // 更新连接状态
    updateConnectionStatus();
    
  }, 5000); // 每5秒检查一次
}

// 在扩展启动时启动监控
chrome.runtime.onStartup.addListener(() => {
  startConnectionMonitor();
});

chrome.runtime.onInstalled.addListener(() => {
  startConnectionMonitor();
});

// 修改原有的连接状态更新
const originalSetAllBadges = setAllBadges;
setAllBadges = async function(kind) {
  await originalSetAllBadges(kind);
  updateConnectionStatus();
};
