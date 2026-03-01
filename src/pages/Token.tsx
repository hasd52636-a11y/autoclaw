import { motion } from 'framer-motion';
import { Key, ArrowLeft, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const translations = {
  zh: {
    title: '免费福利',
    subtitle: '获取免费 AI 模型 API Token 的方法',
    intro: '以下是两种获取免费 AI 模型 API Token 的方法，帮助你免费使用各种 AI 服务。',
    cases: [
      {
        title: '英伟达 (NVIDIA) 免费 API Key',
        desc: '英伟达提供免费的 AI 模型 API Key，可用于访问 Kimi K2.5 等模型。',
        steps: [
          '打开英伟达官网并注册账号',
          '创建英伟达云账号',
          '验证手机号',
          '生成 API Key',
          '配置到 AI 工具中使用'
        ],
        url: 'https://build.nvidia.com/moonshotai/kimi-k2.5',
        note: '注意：需验证手机号，可选择 API Key 过期时间'
      },
      {
        title: 'OpenClaw Zero Token',
        desc: '通过浏览器登录认证，免费访问 DeepSeek、豆包、Claude 等 AI 平台。',
        steps: [
          '克隆 GitHub 仓库',
          '安装依赖',
          '运行 Gateway',
          '在浏览器中登录 AI 平台',
          '开始免费使用 AI 模型'
        ],
        url: 'https://github.com/linuxhsj/openclaw-zero-token',
        note: '注意：豆包需要 doubao-free-api 代理'
      }
    ],
    note: '注意：使用免费 Token 时请遵守各平台的使用条款。'
  },
  en: {
    title: 'Free Benefits',
    subtitle: 'Methods to get free AI model API tokens',
    intro: 'Here are two methods to get free AI model API tokens, helping you use various AI services for free.',
    cases: [
      {
        title: 'NVIDIA Free API Key',
        desc: 'NVIDIA provides free AI model API keys for accessing models like Kimi K2.5.',
        steps: [
          'Open NVIDIA website and register an account',
          'Create NVIDIA cloud account',
          'Verify phone number',
          'Generate API Key',
          'Configure in AI tools'
        ],
        url: 'https://build.nvidia.com/moonshotai/kimi-k2.5',
        note: 'Note: Phone verification required, API Key expiration time optional'
      },
      {
        title: 'OpenClaw Zero Token',
        desc: 'Access DeepSeek, Doubao, Claude and other AI platforms for free via browser login authentication.',
        steps: [
          'Clone GitHub repository',
          'Install dependencies',
          'Run Gateway',
          'Login to AI platforms in browser',
          'Start using AI models for free'
        ],
        url: 'https://github.com/linuxhsj/openclaw-zero-token',
        note: 'Note: Doubao requires doubao-free-api proxy'
      }
    ],
    note: 'Note: Please comply with the terms of service of each platform when using free tokens.'
  }
};

export default function TokenPage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('hanzhong_Q0hpK2oV4F9tlwbYX3RELxiJNGDvayr8OPqZzkfs');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <button onClick={onBack} className="flex items-center gap-2 font-bold text-lg mb-1 hover:text-[#FF4911] transition-colors">
          <ArrowLeft size={24} />
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </button>

        <h1 className="text-5xl md:text-6xl font-black mb-4 mt-0">{t.title}</h1>
        <p className="text-xl font-bold text-gray-600 mb-8">{t.subtitle}</p>

        <div className="bg-[#FFD500] border-4 border-black rounded-3xl p-8 mb-12">
          <p className="font-bold text-lg">{t.intro}</p>
        </div>

        {/* Token Cases */}
        <div className="space-y-8 mb-12">
          {t.cases.map((item, i) => {
            const colors = ['bg-[#FF4911]', 'bg-[#33E1ED]'];
            return (
              <div key={i} className="bg-white border-4 border-black rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <span className={`w-12 h-12 ${colors[i]} border-4 border-black rounded-full flex items-center justify-center text-white`}>
                      {i + 1}
                    </span>
                    {item.title}
                  </h3>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
                  >
                    <ExternalLink size={16} />
                    {lang === 'zh' ? '访问链接' : 'Visit Link'}
                  </a>
                </div>
                
                <p className="font-bold text-gray-600 mb-6">{item.desc}</p>
                
                <ol className="space-y-3 mb-6">
                  {item.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 font-bold">
                      <span className="w-6 h-6 shrink-0 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center text-sm">
                        {j + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                
                <div className="p-4 bg-yellow-100 border-2 border-yellow-500 rounded-xl">
                  <p className="font-bold text-yellow-700">{item.note}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 p-4 bg-red-100 border-4 border-red-500 rounded-xl font-bold text-center text-red-700">
          {t.note}
        </p>
      </motion.div>
    </div>
  );
}
