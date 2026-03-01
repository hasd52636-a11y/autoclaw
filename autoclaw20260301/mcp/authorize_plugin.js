import WebSocket from 'ws';
import fs from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

// MCP 服务器 WebSocket 地址
const wsUrl = 'ws://localhost:30000/mcp';

// 发送命令到 MCP 服务器
function sendCommand(toolName, params) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let msgId = 1;

    ws.on('open', () => {
      const message = {
        id: msgId++,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: params || {}
        }
      };

      ws.send(JSON.stringify(message));
    });

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('命令执行超时'));
    }, 10000);

    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data);
        clearTimeout(timeout);
        ws.close();
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result.content[0].text);
        }
      } catch (e) {
        clearTimeout(timeout);
        ws.close();
        reject(new Error('解析响应失败'));
      }
    });

    ws.on('error', (error) => {
      clearTimeout(timeout);
      ws.close();
      reject(error);
    });

    ws.on('close', () => {
      // 连接关闭，不做处理
    });
  });
}

// 创建配置文件
function createConfigFile() {
  const configPath = join(homedir(), '.autoclaw', 'config.json');
  const configDir = dirname(configPath);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  const config = {
    mode: 'auto',
    local: {
      port: 30000,
      host: '127.0.0.1'
    },
    cloud: {
      provider: 'browserbase',
      apiKey: '',
      projectId: ''
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('配置文件已创建:', configPath);
}

// 尝试授权插件
async function authorizePlugin() {
  try {
    console.log('创建配置文件...');
    createConfigFile();
    
    console.log('\n检查系统状态...');
    const statusResult = await sendCommand('claw_get_status', {});
    console.log('系统状态:', statusResult);
    
    console.log('\n检查健康状态...');
    const healthResult = await sendCommand('claw_health_check', {});
    console.log('健康状态:', healthResult);
    
    console.log('\n检查诊断信息...');
    const diagnoseResult = await sendCommand('claw_diagnose', { full: true });
    console.log('诊断信息:', diagnoseResult);
    
  } catch (error) {
    console.error('操作失败:', error.message);
  }
}

// 运行授权
authorizePlugin();