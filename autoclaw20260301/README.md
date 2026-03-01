# autoclaw_wboke

赋予OpenClaw更强大的网页操控能力和收藏夹操控能力。

## 功能特点

| 特性 | 说明 |
|------|------|
| 收藏夹管理 | 完整CRUD，支持文件夹操作 |
| CDP深度控制 | 执行JavaScript、元素操作、截图 |
| 自动化脚本 | 可复用脚本模板 |
| 一次授权 | 接管所有标签页，无需重复授权 |

## 两种模式

### 增强模式 (推荐) - 端口 30000
- MCP增强功能
- 收藏夹完整管理
- 一次授权接管所有标签页

### 简单模式 - 端口 18792
- 直连Gateway
- 基础网页操作

## 快速开始

### 1. 安装插件

1. 打开Chrome扩展管理页面 `chrome://extensions`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `autoclaw_wboke/autoclaw-plugin`

### 2. 启动MCP服务

```bash
cd autoclaw/mcp
npm start
```

### 3. 配置插件

1. 点击插件图标 → 设置
2. 选择端口 **30000**（推荐）
3. 点击「接管所有标签页」完成授权

## 使用方式

### 通过OpenClaw

1. 将 `autoclaw_wboke` 复制到 `~/.openclaw/workspace/skills/`
2. 在OpenClaw中直接说话，如：
   - "帮我收藏这个页面"
   - "打开百度并截图"
   - "搜索书签 Python"

### 通过命令行

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

## 文件结构

```
autoclaw_wboke/
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

## 可用工具

### 收藏夹管理
- `claw_get_bookmarks` - 获取所有书签
- `claw_create_bookmark` - 新建书签
- `claw_delete_bookmark` - 删除书签
- `claw_create_folder` - 新建文件夹
- `claw_move_bookmark` - 移动书签
- `claw_search_bookmarks` - 搜索书签

### 页面操作
- `claw_navigate` - 导航
- `claw_click_element` - 点击元素
- `claw_fill_input` - 填写输入框
- `claw_evaluate_js` - 执行JavaScript
- `claw_take_screenshot` - 截图
- `claw_scroll` - 滚动

## 常见问题

### Q: MCP服务无法启动
A: 确保已安装依赖：`cd autoclaw/mcp && npm install`

### Q: 插件无法连接
A: 1. 检查MCP服务是否运行在端口30000
   2. 检查Token是否正确
   3. 点击「接管所有标签页」完成授权

### Q: 如何使用脚本模板？
A: 在OpenClaw中直接说「用抖音点赞脚本」，AI会自动读取并执行。

## 技术支持

- MCP服务端口: 30000
- Token: autoclaw_builtin_Q0hpK2oV4F9tlwbYX3RELxiJNGDvayr8OPqZzkfs

---
Made with ❤️ for OpenClaw
