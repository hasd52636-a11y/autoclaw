import WebSocket from 'ws';

// MCP 服务器 WebSocket 地址
const wsUrl = 'ws://localhost:30000/mcp';

// 创建 WebSocket 连接
const ws = new WebSocket(wsUrl);

let msgId = 1;

// 发送命令到 MCP 服务器
function sendCommand(toolName, params) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const message = {
      id: id,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params || {}
      }
    };

    console.log('发送命令:', toolName, params);
    ws.send(JSON.stringify(message));

    const timeout = setTimeout(() => {
      reject(new Error('命令执行超时'));
    }, 15000);

    const handleMessage = (data) => {
      try {
        const response = JSON.parse(data);
        console.log('收到响应:', JSON.stringify(response, null, 2));
        if (response.id === id) {
          clearTimeout(timeout);
          ws.off('message', handleMessage);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result.content[0].text);
          }
        }
      } catch (e) {
        console.error('解析响应失败:', e);
      }
    };

    ws.on('message', handleMessage);
  });
}

// 连接成功
ws.on('open', async () => {
  console.log('已连接到 MCP 服务器');
  
  try {
    // 通过 JavaScript 代码设置插件授权状态
    console.log('通过 JavaScript 代码设置插件授权状态...');
    const authTimestamp = Date.now();
    const authHours = 24;
    
    const jsCode = `
      chrome.runtime.sendMessage({
        action: 'authorizeAndAttachAll'
      }, (response) => {
        console.log('授权结果:', response);
      });
    `;
    
    await sendCommand('claw_evaluate_js', {
      expression: jsCode
    });
    
    console.log('授权状态设置成功！');
    
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    // 关闭连接
    ws.close();
  }
});

// 连接错误
ws.on('error', (error) => {
  console.error('连接错误:', error);
});

// 连接关闭
ws.on('close', () => {
  console.log('连接已关闭');
});
