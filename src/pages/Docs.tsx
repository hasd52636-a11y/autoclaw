import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, X, Download, Key, Plug, AlertCircle, Code, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const translations = {
  zh: {
    title: '文档',
    subtitle: '完整的使用文档和API参考',
    sections: [
      { title: '快速开始', desc: '5分钟快速上手' },
      { title: '安装指南', desc: 'Chrome/Edge 安装步骤' },
      { title: '配置说明', desc: 'Token和授权配置' },
      { title: '工具清单', desc: '所有可用工具列表' },
      { title: '常见问题', desc: 'FAQ 解答' },
      { title: 'API参考', desc: '完整的API文档' }
    ],
    modals: {
      quickstart: {
        title: '快速开始',
        content: [
          { step: 1, title: '安装Chrome扩展', desc: '打开开发者模式，加载已解压的autoclaw-plugin文件夹' },
          { step: 2, title: '启动MCP服务', desc: '进入mcp目录，运行npm start启动服务' },
          { step: 3, title: '配置插件', desc: '选择端口30000（推荐），点击"接管所有标签页"完成授权' }
        ]
      },
      installation: {
        title: '安装指南',
        content: [
          { step: 1, title: '下载扩展文件', desc: '从本网站下载CRX文件' },
          { step: 2, title: '打开Chrome扩展管理', desc: '在地址栏输入 chrome://extensions/' },
          { step: 3, title: '开启开发者模式', desc: '在右上角开启开发者模式' },
          { step: 4, title: '加载扩展', desc: '点击"加载已解压的扩展程序"或直接拖放CRX文件' },
          { step: 5, title: '完成安装', desc: '扩展图标应出现在浏览器工具栏中' }
        ]
      },
      configuration: {
        title: '配置说明',
        content: [
          { step: 1, title: '获取Token', desc: '运行OpenClaw Gateway获取Token' },
          { step: 2, title: '打开扩展设置', desc: '点击扩展图标，选择"扩展设置"' },
          { step: 3, title: '输入Token', desc: '在Token输入框中粘贴获取的Token' },
          { step: 4, title: '设置授权时长', desc: '选择1-99小时的授权时长' },
          { step: 5, title: '确认授权', desc: '点击"确认授权"按钮完成配置' }
        ]
      },
      tools: {
        title: '工具清单',
        content: [
          { category: '核心组件', tools: ['autoclaw 扩展', 'autoclaw-mcp', 'autoclaw Gateway'] },
          { category: '功能模块', tools: ['浏览器控制', '标签页操作', '截图功能', '授权管理'] },
          { category: '集成能力', tools: ['MCP 工具集成', 'AI 函数调用'] },
          { category: '生态系统', tools: ['autoclaw-skill', 'autoclawluodiye'] }
        ]
      },
      faq: {
        title: '常见问题',
        content: [
          { question: 'Token 是什么？', answer: 'Token 是连接 OpenClaw 扩展和 Gateway 的凭证，相当于打开浏览器的钥匙。' },
          { question: '授权时长可以设置多久？', answer: '授权时长可以设置 1-99 小时，到期后可以续期。' },
          { question: '数据是否会上传到云端？', answer: '所有数据仅存储在本地，无需上传云端，确保安全性。' },
          { question: '是否支持所有浏览器？', answer: '目前主要支持 Chrome 和 Edge 浏览器。' },
          { question: '如何确保安全使用？', answer: '建议使用专用的 Chrome 配置文件，避免控制日常浏览的标签页。' }
        ]
      },
      api: {
        title: 'API参考',
        content: [
          { endpoint: '/api/v1/auth', method: 'POST', desc: '获取 autoclaw Gateway 授权Token' },
          { endpoint: '/api/v1/browser', method: 'GET', desc: '获取当前运行的浏览器列表' },
          { endpoint: '/api/v1/tab/:id', method: 'GET', desc: '获取指定标签页信息' },
          { endpoint: '/api/v1/tab/:id/click', method: 'POST', desc: '在指定标签页执行点击操作' },
          { endpoint: '/api/v1/tab/:id/type', method: 'POST', desc: '在指定标签页执行输入操作' },
          { endpoint: '/api/v1/tab/:id/screenshot', method: 'GET', desc: '获取指定标签页截图' }
        ]
      }
    },
    close: '关闭',
    next: '下一步',
    prev: '上一步'
  },
  en: {
    title: 'Documentation',
    subtitle: 'Complete usage guide and API reference',
    sections: [
      { title: 'Quick Start', desc: 'Get started in 5 minutes' },
      { title: 'Installation', desc: 'Chrome/Edge install guide' },
      { title: 'Configuration', desc: 'Token and auth setup' },
      { title: 'Tools', desc: 'All available tools' },
      { title: 'FAQ', desc: 'Frequently asked questions' },
      { title: 'API Reference', desc: 'Complete API docs' }
    ],
    modals: {
      quickstart: {
        title: 'Quick Start',
        content: [
          { step: 1, title: 'Install Chrome Extension', desc: 'Enable developer mode and load the unpacked autoclaw-plugin folder' },
          { step: 2, title: 'Start MCP Service', desc: 'Enter mcp directory and run npm start to start the service' },
          { step: 3, title: 'Configure Plugin', desc: 'Select port 30000 (recommended) and click "Attach All Tabs" to complete authorization' }
        ]
      },
      installation: {
        title: 'Installation',
        content: [
          { step: 1, title: 'Download Extension', desc: 'Download CRX file from this website' },
          { step: 2, title: 'Open Chrome Extensions', desc: 'Enter chrome://extensions/ in address bar' },
          { step: 3, title: 'Enable Developer Mode', desc: 'Toggle on Developer Mode in top right' },
          { step: 4, title: 'Load Extension', desc: 'Click "Load unpacked" or drag and drop CRX file' },
          { step: 5, title: 'Complete Installation', desc: 'Extension icon should appear in browser toolbar' }
        ]
      },
      configuration: {
        title: 'Configuration',
        content: [
          { step: 1, title: 'Get Token', desc: 'Run OpenClaw Gateway to get Token' },
          { step: 2, title: 'Open Extension Settings', desc: 'Click extension icon, select "Settings"' },
          { step: 3, title: 'Input Token', desc: 'Paste the obtained Token in the input field' },
          { step: 4, title: 'Set Auth Duration', desc: 'Select auth duration from 1-99 hours' },
          { step: 5, title: 'Confirm Authorization', desc: 'Click "Confirm" button to complete configuration' }
        ]
      },
      tools: {
        title: 'Tools',
        content: [
          { category: 'Core Components', tools: ['autoclaw Extension', 'autoclaw-mcp', 'autoclaw Gateway'] },
          { category: 'Feature Modules', tools: ['Browser Control', 'Tab Operations', 'Screenshot Function', 'Authorization Management'] },
          { category: 'Integration Capabilities', tools: ['MCP Tool Integration', 'AI Function Calling'] },
          { category: 'Ecosystem', tools: ['autoclaw-skill', 'autoclawluodiye'] }
        ]
      },
      faq: {
        title: 'FAQ',
        content: [
          { question: 'What is a Token?', answer: 'Token is the credential connecting OpenClaw extension and Gateway, like a key to your browser.' },
          { question: 'How long can I set the authorization duration?', answer: 'Authorization duration can be set from 1-99 hours, renewable after expiration.' },
          { question: 'Will data be uploaded to the cloud?', answer: 'All data is stored locally, no cloud upload, ensuring security.' },
          { question: 'Does it support all browsers?', answer: 'Currently mainly supports Chrome and Edge browsers.' },
          { question: 'How to use it safely?', answer: 'It is recommended to use a dedicated Chrome profile to avoid controlling daily browsing tabs.' }
        ]
      },
      api: {
        title: 'API Reference',
        content: [
          { endpoint: '/api/v1/auth', method: 'POST', desc: 'Get authorization Token' },
          { endpoint: '/api/v1/browser', method: 'GET', desc: 'Get browser list' },
          { endpoint: '/api/v1/tab/:id', method: 'GET', desc: 'Get tab information' },
          { endpoint: '/api/v1/tab/:id/click', method: 'POST', desc: 'Click operation' },
          { endpoint: '/api/v1/tab/:id/type', method: 'POST', desc: 'Type operation' },
          { endpoint: '/api/v1/tab/:id/screenshot', method: 'GET', desc: 'Screenshot operation' }
        ]
      }
    },
    close: 'Close',
    next: 'Next',
    prev: 'Previous'
  }
};

export default function DocsPage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
  const t = translations[lang];
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleOpenModal = (modalId: string) => {
    setOpenModal(modalId);
    setCurrentStep(0);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handleNextStep = () => {
    if (openModal) {
      const content = t.modals[openModal as keyof typeof t.modals].content;
      if (currentStep < content.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
        <p className="text-xl font-bold text-gray-600 mb-12">{t.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {t.sections.map((section, i) => {
            const colors = ['bg-[#FF4911]', 'bg-[#33E1ED]', 'bg-[#FFD500]', 'bg-[#D56BFF]', 'bg-[#00E676]', 'bg-[#FF4911]'];
            const modalIds = ['quickstart', 'installation', 'configuration', 'tools', 'faq', 'api'];
            return (
              <div 
                key={i} 
                className={`${colors[i]} border-4 border-black rounded-3xl p-8 lego-shadow hover:-translate-y-2 transition-transform cursor-pointer`}
                onClick={() => handleOpenModal(modalIds[i])}
              >
                <BookOpen size={40} strokeWidth={2.5} className="mb-4" />
                <h3 className="text-2xl font-black mb-2">{section.title}</h3>
                <p className="font-bold opacity-80">{section.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {openModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border-4 border-black rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">{t.modals[openModal as keyof typeof t.modals].title}</h3>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 bg-gray-100 border-2 border-black rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                {openModal === 'quickstart' && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#FF4911] border-4 border-black rounded-full flex items-center justify-center text-white font-black text-xl">
                          {t.modals.quickstart.content[currentStep].step}
                        </div>
                        <h4 className="text-xl font-black">{t.modals.quickstart.content[currentStep].title}</h4>
                      </div>
                      <p className="font-bold text-gray-600 ml-16">{t.modals.quickstart.content[currentStep].desc}</p>
                    </div>
                    <div className="flex justify-between">
                      <button 
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        className={`px-4 py-2 border-4 border-black rounded-full font-bold ${currentStep === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {t.prev}
                      </button>
                      <button 
                        onClick={handleNextStep}
                        disabled={currentStep === t.modals.quickstart.content.length - 1}
                        className={`px-4 py-2 border-4 border-black rounded-full font-bold ${currentStep === t.modals.quickstart.content.length - 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#33E1ED] hover:bg-[#28c0cc]'}`}
                      >
                        {t.next}
                      </button>
                    </div>
                  </div>
                )}

                {openModal === 'installation' && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#33E1ED] border-4 border-black rounded-full flex items-center justify-center text-black font-black text-xl">
                          {t.modals.installation.content[currentStep].step}
                        </div>
                        <h4 className="text-xl font-black">{t.modals.installation.content[currentStep].title}</h4>
                      </div>
                      <p className="font-bold text-gray-600 ml-16">{t.modals.installation.content[currentStep].desc}</p>
                    </div>
                    <div className="flex justify-between">
                      <button 
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        className={`px-4 py-2 border-4 border-black rounded-full font-bold ${currentStep === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {t.prev}
                      </button>
                      <button 
                        onClick={handleNextStep}
                        disabled={currentStep === t.modals.installation.content.length - 1}
                        className={`px-4 py-2 border-4 border-black rounded-full font-bold ${currentStep === t.modals.installation.content.length - 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#33E1ED] hover:bg-[#28c0cc]'}`}
                      >
                        {t.next}
                      </button>
                    </div>
                  </div>
                )}

                {openModal === 'configuration' && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#FFD500] border-4 border-black rounded-full flex items-center justify-center text-black font-black text-xl">
                          {t.modals.configuration.content[currentStep].step}
                        </div>
                        <h4 className="text-xl font-black">{t.modals.configuration.content[currentStep].title}</h4>
                      </div>
                      <p className="font-bold text-gray-600 ml-16">{t.modals.configuration.content[currentStep].desc}</p>
                    </div>
                    <div className="flex justify-between">
                      <button 
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        className={`px-4 py-2 border-4 border-black rounded-full font-bold ${currentStep === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {t.prev}
                      </button>
                      <button 
                        onClick={handleNextStep}
                        disabled={currentStep === t.modals.configuration.content.length - 1}
                        className={`px-4 py-2 border-4 border-black rounded-full font-bold ${currentStep === t.modals.configuration.content.length - 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#33E1ED] hover:bg-[#28c0cc]'}`}
                      >
                        {t.next}
                      </button>
                    </div>
                  </div>
                )}

                {openModal === 'tools' && (
                  <div>
                    <div className="space-y-6">
                      {t.modals.tools.content.map((category, i) => (
                        <div key={i} className="bg-gray-50 border-4 border-black rounded-2xl p-6">
                          <h4 className="text-xl font-black mb-4">{category.category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {category.tools.map((tool, j) => (
                              <div key={j} className="flex items-center gap-2 p-3 bg-white border-2 border-black rounded-xl">
                                <Plug size={16} />
                                <span className="font-bold">{tool}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {openModal === 'faq' && (
                  <div className="space-y-6">
                    {t.modals.faq.content.map((item, i) => (
                      <div key={i} className="bg-gray-50 border-4 border-black rounded-2xl p-6">
                        <h4 className="text-lg font-black mb-3 flex items-center gap-2">
                          <AlertCircle size={20} />
                          {item.question}
                        </h4>
                        <p className="font-bold text-gray-600 pl-7">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {openModal === 'api' && (
                  <div className="space-y-4">
                    {t.modals.api.content.map((item, i) => (
                      <div key={i} className="bg-gray-50 border-4 border-black rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <code className={`px-3 py-1 rounded-full font-bold ${item.method === 'GET' ? 'bg-[#00E676]' : 'bg-[#33E1ED]'}`}>
                            {item.method}
                          </code>
                          <code className="font-mono font-bold text-[#FF4911]">{item.endpoint}</code>
                        </div>
                        <p className="font-bold text-gray-600 pl-16">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-[#FF4911] text-white border-4 border-black rounded-full font-bold hover:bg-[#e63c0a] transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
