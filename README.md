# AutoClaw

![AutoClaw Logo](public/icon128.png)

赋予OpenClaw更强大的网页操控能力和收藏夹操控能力。

Empower OpenClaw with more powerful web control and bookmark management capabilities.

## 官方网站 | Official Website
[www.wboke.com](https://www.wboke.com)

## 特性 | Features

### 用自然语言控制浏览器 | Control Browser with Natural Language
- 通过OpenClaw使用自然语言指令控制浏览器
- 描述你的目标和步骤，AI会为你规划和执行操作
- 支持用自然语言管理收藏夹和书签

- Control browser with natural language commands through OpenClaw
- Describe your goals and steps, AI will plan and execute operations for you
- Support managing bookmarks and bookmark folders with natural language

### 多维度浏览器控制 | Multi-dimensional Browser Control
- **收藏夹管理**：完整CRUD操作，支持文件夹管理和书签搜索
- **CDP深度控制**：执行JavaScript、元素操作、截图等高级浏览器控制功能
- **自动化脚本**：可复用的脚本模板，如抖音点赞、批量截图、自动搜索等
- **一次授权**：接管所有标签页，无需重复授权

- **Bookmark Management**: Full CRUD operations, supporting folder management and bookmark search
- **CDP Deep Control**: Execute JavaScript, element operations, screenshots and other advanced browser control functions
- **Automation Scripts**: Reusable script templates like Douyin likes, batch screenshots, auto search, etc.
- **One-time Authorization**: Take control of all tabs without repeated authorization

### 两种运行模式 | Two Running Modes
- **增强模式** (推荐) - 端口 30000
  - MCP增强功能
  - 收藏夹完整管理
  - 一次授权接管所有标签页

- **简单模式** - 端口 18792
  - 直连Gateway
  - 基础网页操作

- **Enhanced Mode** (Recommended) - Port 30000
  - MCP enhanced features
  - Full bookmark management
  - One-time authorization to take control of all tabs

- **Simple Mode** - Port 18792
  - Direct connection to Gateway
  - Basic web operations

### 工具 | Tools
- **收藏夹管理工具**：创建、删除、移动、搜索书签和文件夹
- **页面操作工具**：导航、点击、填写、执行JavaScript、截图、滚动
- **标签页管理工具**：创建、关闭、切换、重载标签页
- **存储管理工具**：获取和设置cookies、localStorage、sessionStorage
- **MCP工具**：内置97款工具，比原厂插件功能更强大

- **Bookmark Management Tools**: Create, delete, move, search bookmarks and folders
- **Page Operation Tools**: Navigate, click, fill, execute JavaScript, take screenshots, scroll
- **Tab Management Tools**: Create, close, switch, reload tabs
- **Storage Management Tools**: Get and set cookies, localStorage, sessionStorage
- **MCP Tools**: Built-in 97 tools, more powerful than the original plugin

### MCP功能 | MCP Features
- **键盘操作**：按键、组合键、文本输入
- **截图和内容提取**：页面截图、HTML/文本内容提取、元素属性获取
- **鼠标和滚动操作**：鼠标移动、点击、右键点击、双击、滚轮滚动
- **触摸和滑动操作**：向上/向下/向左/向右滑动、点击
- **标签页管理**：创建、关闭、列出、切换、重载标签页
- **存储和cookie管理**：获取/设置cookies、localStorage/sessionStorage
- **配置和状态管理**：获取系统状态、配置、健康检查
- **JavaScript执行**：执行JavaScript代码
- **等待操作**：等待指定时间、元素出现、文本出现、URL匹配、导航完成

- **Keyboard Operations**: Press keys, key combinations, type text
- **Screenshot and Content Extraction**: Page screenshots, HTML/text content extraction, element attribute retrieval
- **Mouse and Scroll Operations**: Mouse movement, click, right-click, double-click, wheel scroll
- **Touch and Swipe Operations**: Swipe up/down/left/right, tap
- **Tab Management**: Create, close, list, switch, reload tabs
- **Storage and Cookie Management**: Get/set cookies, localStorage/sessionStorage
- **Configuration and Status Management**: Get system status, configuration, health check
- **JavaScript Execution**: Execute JavaScript code
- **Wait Operations**: Wait for specified time, element appearance, text appearance, URL match, navigation completion

### API
- **浏览器控制API**：控制浏览器行为的核心API
- **收藏夹管理API**：管理浏览器收藏夹的专用API
- **MCP接口**：通过MCP协议与AI Agent通信的接口

- **Browser Control API**: Core API for controlling browser behavior
- **Bookmark Management API**: Dedicated API for managing browser bookmarks
- **MCP Interface**: Interface for communicating with AI Agent through MCP protocol

### 无需复杂配置，快速体验 | Quick Experience without Complex Configuration
- **Chrome扩展**：通过Chrome扩展立即开始体验，无需复杂配置
- **MCP服务**：内置MCP服务，与OpenClaw无缝集成

- **Chrome Extension**: Start experiencing immediately through Chrome extension without complex configuration
- **MCP Service**: Built-in MCP service, seamlessly integrated with OpenClaw

### 本地安全运行 | Local Secure Operation
- 所有数据仅存储在本地，无需上传云端
- Token验证确保连接安全
- 支持专用Chrome配置文件，避免影响日常浏览

- All data is stored locally, no cloud upload required
- Token verification ensures connection security
- Support for dedicated Chrome profiles to avoid affecting daily browsing

## 快速开始 | Quick Start

### 1. 安装插件 | Install Plugin

1. 打开Chrome扩展管理页面 `chrome://extensions`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `autoclaw-plugin` 文件夹

1. Open Chrome extension management page `chrome://extensions`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `autoclaw-plugin` folder

### 2. 启动MCP服务 | Start MCP Service

```bash
cd mcp
npm start
```

### 3. 配置插件 | Configure Plugin

1. 点击插件图标 → 设置
2. 选择端口 **30000**（推荐）
3. 点击「接管所有标签页」完成授权

1. Click extension icon → Settings
2. Select port **30000** (recommended)
3. Click "Attach All Tabs" to complete authorization

## 使用方式 | Usage

### 通过OpenClaw | Through OpenClaw

1. 将 `autoclaw` 复制到 `~/.openclaw/workspace/skills/`
2. 在OpenClaw中直接说话，如：
   - "帮我收藏这个页面"
   - "打开百度并截图"
   - "搜索书签 Python"

1. Copy `autoclaw` to `~/.openclaw/workspace/skills/`
2. Speak directly in OpenClaw, such as:
   - "Help me bookmark this page"
   - "Open Baidu and take a screenshot"
   - "Search bookmarks for Python"

### 通过命令行 | Through Command Line

```bash
# 打开网页
curl -X POST http://127.0.0.1:30000/mcp -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "claw_navigate",
    "arguments": {"url": "https://www.baidu.com"}
  }
}'

# 截图
curl -X POST http://127.0.0.1:30000/mcp -d '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "claw_take_screenshot"
  }
}'

# 创建书签
curl -X POST http://127.0.0.1:30000/mcp -d '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "claw_create_bookmark",
    "arguments": {"title": "百度", "url": "https://www.baidu.com"}
  }
}'
```

## 文件结构 | File Structure

```
autoclaw/
├── SKILL.md              # 技能定义
├── scripts/             # 自动化脚本模板
│   ├── 抖音点赞.json
│   ├── 批量截图.json
│   └── 自动搜索.json
├── autoclaw-plugin/     # Chrome插件
│   ├── background.js
│   ├── popup.html
│   └── options.html
└── README.md
```

## 技术支持 | Technical Support

- MCP服务端口: 30000
- Token: autoclaw_builtin_Q0hpK2oV4F9tlwbYX3RELxiJNGDvayr8OPqZzkfs

---
Made with ❤️ for OpenClaw