import { motion } from 'framer-motion';
import { Plug, ArrowLeft, Server, Code, Terminal, Box } from 'lucide-react';

const translations = {
  zh: {
    title: 'MCP 服务器',
    subtitle: 'Model Context Protocol 服务器 - 连接 AI 与浏览器',
    intro: 'autoclaw-mcp 是基于 MCP 协议的服务器实现，让 AI 能够通过标准协议控制浏览器。',
    features: [
      { title: '标准 MCP 协议', desc: '完全兼容 Anthropic MCP 规范' },
      { title: 'WebSocket 连接', desc: '通过 WebSocket 与 Gateway 通信' },
      { title: '工具注册', desc: '自动注册所有浏览器操作工具' },
      { title: 'TypeScript', desc: '完整的类型支持' }
    ],
    architecture: '架构图',
    archDesc: 'AI → MCP Server → WebSocket → Gateway → Chrome Extension → Browser',
    install: '安装使用',
    installSteps: [
      '克隆项目: git clone https://github.com/autoclaw/mcp.git',
      '安装依赖: npm install',
      '构建项目: npm run build',
      '启动服务: npm start',
      '配置 AI: 在 Claude/OpenCode 中添加 MCP 服务器'
    ],
    config: '配置文件示例',
    port: '默认端口',
    ws: 'WebSocket'
  },
  en: {
    title: 'MCP Server',
    subtitle: 'Model Context Protocol Server - Connect AI to Browser',
    intro: 'autoclaw-mcp is an MCP protocol server implementation that enables AI to control browser via standard protocol.',
    features: [
      { title: 'Standard MCP Protocol', desc: 'Fully compatible with Anthropic MCP spec' },
      { title: 'WebSocket Connection', desc: 'Communicate with Gateway via WebSocket' },
      { title: 'Tool Registration', desc: 'Auto-register all browser operation tools' },
      { title: 'TypeScript', desc: 'Full type support' }
    ],
    architecture: 'Architecture',
    archDesc: 'AI → MCP Server → WebSocket → Gateway → Chrome Extension → Browser',
    install: 'Installation',
    installSteps: [
      'Clone: git clone https://github.com/autoclaw/mcp.git',
      'Install: npm install',
      'Build: npm run build',
      'Start: npm start',
      'Configure: Add MCP server in Claude/OpenCode'
    ],
    config: 'Config Example',
    port: 'Default Port',
    ws: 'WebSocket'
  }
};

export default function MCPPage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
  const t = translations[lang];

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <button onClick={onBack} className="flex items-center gap-2 font-bold text-lg mb-1 hover:text-[#FF4911] transition-colors">
          <ArrowLeft size={24} />
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </button>

        <h1 className="text-5xl md:text-6xl font-black mb-4 mt-0">{t.title}</h1>
        <p className="text-xl font-bold text-gray-600 mb-8">{t.subtitle}</p>

        <div className="bg-[#D56BFF] border-4 border-black rounded-3xl p-8 mb-12 text-white">
          <p className="font-bold text-lg">{t.intro}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {t.features.map((feature, i) => {
            const colors = ['bg-[#FF4911]', 'bg-[#33E1ED]', 'bg-[#FFD500]', 'bg-[#00E676]'];
            const IconComponent = [Server, Code, Box, Terminal][i];
            return (
              <div key={i} className={`${colors[i]} border-4 border-black rounded-3xl p-6 flex items-start gap-4`}>
                <IconComponent size={32} strokeWidth={2.5} className="shrink-0" />
                <div>
                  <h3 className="font-black text-xl mb-1">{feature.title}</h3>
                  <p className="font-bold opacity-80">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture */}
        <div className="bg-white border-4 border-black rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-black mb-6">{t.architecture}</h3>
          <div className="p-6 bg-gray-100 border-4 border-black rounded-2xl font-mono text-center text-lg font-bold overflow-x-auto">
            {t.archDesc}
          </div>
        </div>

        {/* Install Guide */}
        <div className="bg-[#00E676] border-4 border-black rounded-3xl p-8">
          <h3 className="text-2xl font-black mb-6">{t.install}</h3>
          <ol className="space-y-3 mb-6">
            {t.installSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 font-bold">
                <span className="w-8 h-8 shrink-0 bg-black text-white rounded-full flex items-center justify-center font-black">
                  {i + 1}
                </span>
                <code className="font-mono text-sm bg-black text-white px-3 py-1 rounded">{step}</code>
              </li>
            ))}
          </ol>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border-4 border-black rounded-xl">
              <p className="font-bold text-gray-600 mb-2">{t.port}</p>
              <code className="text-2xl font-black text-[#FF4911]">30000</code>
            </div>
            <div className="p-4 bg-white border-4 border-black rounded-xl">
              <p className="font-bold text-gray-600 mb-2">{t.ws}</p>
              <code className="text-lg font-black">ws://127.0.0.1:30000/extension</code>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
