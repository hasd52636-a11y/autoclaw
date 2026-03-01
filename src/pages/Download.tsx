import { motion } from 'framer-motion';
import { Download, Chrome, Monitor, ArrowLeft, Box } from 'lucide-react';

const translations = {
  zh: {
    title: '下载插件',
    subtitle: '选择您的浏览器开始安装',
    chrome: 'Chrome 浏览器',
    edge: 'Edge 浏览器',
    version: '当前版本',
    req: '系统要求',
    reqItems: ['Chrome 80+', 'Windows / macOS / Linux', '至少 100MB 可用空间'],
    install: '安装说明',
    installSteps: [
      '打开 Chrome 扩展管理页面 chrome://extensions',
      '开启右上角「开发者模式」',
      '点击「加载已解压的扩展程序」',
      '选择 autoclaw-plugin 文件夹'
    ],
    note: '注意：首次安装需要开启开发者模式。每次更新后需重新加载。'
  },
  en: {
    title: 'Download Plugin',
    subtitle: 'Choose your browser to install',
    chrome: 'Chrome Browser',
    edge: 'Edge Browser',
    version: 'Current Version',
    req: 'System Requirements',
    reqItems: ['Chrome 80+', 'Windows / macOS / Linux', 'At least 100MB free space'],
    install: 'Installation Guide',
    installSteps: [
      'Open Chrome extension management page chrome://extensions',
      'Enable "Developer mode" in the top right corner',
      'Click "Load unpacked"',
      'Select autoclaw-plugin folder'
    ],
    note: 'Note: Developer mode required for first install. Reload after each update.'
  }
};

export default function DownloadPage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
  const t = translations[lang];

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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Chrome */}
          <div className="bg-white border-4 border-black rounded-3xl p-8 lego-shadow hover:-translate-y-2 transition-transform">
            <div className="w-20 h-20 bg-[#33E1ED] border-4 border-black rounded-2xl flex items-center justify-center mb-6">
              <Chrome size={48} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black mb-4">{t.chrome}</h3>
            <p className="font-bold text-gray-600 mb-6">v1.0.0</p>
            <a href="/autoclaw20260301.zip" download className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FF4911] text-white border-4 border-black rounded-2xl font-black text-xl lego-shadow-hover">
              <Download size={24} />
              {lang === 'zh' ? '下载' : 'Download'}
            </a>
          </div>

          {/* Edge */}
          <div className="bg-white border-4 border-black rounded-3xl p-8 lego-shadow hover:-translate-y-2 transition-transform">
            <div className="w-20 h-20 bg-[#00E676] border-4 border-black rounded-2xl flex items-center justify-center mb-6">
              <Monitor size={48} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black mb-4">{t.edge}</h3>
            <p className="font-bold text-gray-600 mb-6">v1.0.0</p>
            <a href="/autoclaw20260301.zip" download className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#00E676] text-black border-4 border-black rounded-2xl font-black text-xl lego-shadow-hover">
              <Download size={24} />
              {lang === 'zh' ? '下载' : 'Download'}
            </a>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-[#FFD500] border-4 border-black rounded-3xl p-8 mb-8">
          <h3 className="text-2xl font-black mb-6">{t.req}</h3>
          <ul className="space-y-3">
            {t.reqItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-lg">
                <span className="w-3 h-3 bg-black rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Install Guide */}
        <div className="bg-white border-4 border-black rounded-3xl p-8">
          <h3 className="text-2xl font-black mb-6">{t.install}</h3>
          <ol className="space-y-4">
            {t.installSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-10 h-10 shrink-0 bg-black text-white border-4 border-black rounded-full flex items-center justify-center font-black">
                  {i + 1}
                </span>
                <span className="font-bold text-lg pt-1">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 p-4 bg-gray-100 border-4 border-black rounded-xl font-bold text-gray-600">
            {t.note}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
