/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, BookOpen, Plug, Lightbulb, Sparkles, Gift, MessageCircle,
  Link as LinkIcon, Clock, Zap, Lock, ShieldCheck, Key, Database, AlertTriangle,
  Menu, X, ChevronRight, Github
} from 'lucide-react';

import DownloadPage from './pages/Download';
import DocsPage from './pages/Docs';
import SkillsPage from './pages/Skills';
import MCPPage from './pages/MCP';
import OpenSourcePage from './pages/OpenSource';
import TipsPage from './pages/Tips';
import TokenPage from './pages/Token';
import CommunityPage from './pages/Community';

type Page = 'home' | 'download' | 'docs' | 'skills' | 'mcp' | 'opensource' | 'tips' | 'token' | 'community';

const translations = {
  zh: {
    nav: {
      download: '下载',
      docs: '文档',
      skills: 'Skills',
      mcp: 'MCP',
      opensource: '开源',
      tips: '技巧',
      token: '福利',
      community: '社群'
    },
    hero: {
      title: '赋予OpenClaw更强大的网页操控能力',
      subtitle: '基于Chrome Debugger API的浏览器自动化工具，支持收藏夹管理、CDP深度控制、自动化脚本和一次授权接管所有标签页',
      downloadBtn: '立即下载',
      docsBtn: '查看文档'
    },
    features: {
      title: '为什么选择 autoclaw',
      items: [
        { title: '收藏夹完整管理', desc: '用自然语言与openclaw对话实现对收藏夹及书签页的深度控制' },
        { title: '智能体的挖掘机', desc: '让智能体感知的手变成信息挖掘机，实现对浏览器的全量控制' },
        { title: '自动化机器人', desc: '通过智能体批量生成适应于自己专业领域的脚本模板，比如抖音点赞、批量截图、自动搜索等，无需额外token，或者单独API接口' },
        { title: '一次授权控制所有标签页', desc: '无需重复授权，一次点击接管所有现有和新增标签页' }
      ]
    },
    quickstart: {
      title: '快速开始',
      steps: [
        { title: '安装Chrome扩展', desc: '打开开发者模式，加载已解压的autoclaw-plugin文件夹' },
        { title: '启动MCP服务', desc: '进入mcp目录，运行npm start启动服务' },
        { title: '配置插件', desc: '选择端口30000（推荐），点击"接管所有标签页"完成授权' }
      ]
    },
    security: {
      title: '安全说明',
      items: [
        { title: '本地运行：所有数据仅存储在本地，无需上传云端' },
        { title: 'Token验证：连接需通过内置Token验证' },
        { title: '两种运行模式：增强模式（端口30000）和简单模式（端口18792）' },
        { title: '风险提示：授予AI浏览器控制权等同于授予"双手"' },
        { title: '建议：使用专用Chrome配置文件，避免控制日常浏览配置' }
      ]
    },
    footer: '© 2026 autoclaw. 基于OpenClaw生态。'
  },
  en: {
    nav: {
      download: 'Download',
      docs: 'Docs',
      skills: 'Skills',
      mcp: 'MCP',
      opensource: 'Open Source',
      tips: 'Tips',
      token: 'Benefits',
      community: 'Community'
    },
    hero: {
      title: 'Empower OpenClaw with Powerful Web Control',
      subtitle: 'Browser automation tool based on Chrome Debugger API, supporting bookmark management, CDP deep control, automation scripts, and one-time authorization for all tabs',
      downloadBtn: 'Download Now',
      docsBtn: 'View Docs'
    },
    features: {
      title: 'Why autoclaw',
      items: [
        { title: 'Complete Bookmark Management', desc: 'Use natural language to interact with openclaw for deep control of bookmarks and bookmark pages' },
        { title: 'Agent\'s Excavator', desc: 'Turn the agent\'s perception hand into an information excavator, achieving full control of the browser' },
        { title: 'Automation Robot', desc: 'Use agent to batch generate script templates suitable for your professional field, such as Douyin likes, batch screenshots, auto search, etc. No additional token or separate API interface required' },
        { title: 'One-time Authorization for All Tabs', desc: 'No repeated authorization, one click to take control of all existing and new tabs' }
      ]
    },
    quickstart: {
      title: 'Quick Start',
      steps: [
        { title: 'Install Chrome Extension', desc: 'Enable developer mode and load the unpacked autoclaw-plugin folder' },
        { title: 'Start MCP Service', desc: 'Enter mcp directory and run npm start to start the service' },
        { title: 'Configure Plugin', desc: 'Select port 30000 (recommended) and click "Attach All Tabs" to complete authorization' }
      ]
    },
    security: {
      title: 'Security',
      items: [
        { title: 'Local Run: All data stored locally, no cloud upload' },
        { title: 'Token Auth: Connection requires built-in Token verification' },
        { title: 'Two Modes: Enhanced mode (port 30000) and Simple mode (port 18792)' },
        { title: 'Risk Note: Granting AI browser control is like granting "hands"' },
        { title: 'Recommendation: Use dedicated Chrome profile' }
      ]
    },
    footer: '© 2026 autoclaw. Based on OpenClaw ecosystem.'
  }
};

const COLORS = {
  red: '#FF4911',
  blue: '#33E1ED',
  yellow: '#FFD500',
  green: '#00E676',
  purple: '#D56BFF',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#E5E7EB'
};

export default function App() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };
  
  useEffect(() => {
    const savedLang = localStorage.getItem('autoclaw-lang') as 'zh' | 'en';
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLang(savedLang);
    }
  }, []);

  const handleLangChange = (newLang: 'zh' | 'en') => {
    setLang(newLang);
    localStorage.setItem('autoclaw-lang', newLang);
  };

  const tData = translations[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", bounce: 0.5 }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden font-sans text-black selection:bg-[#FFD500] selection:text-black pb-20">
      
      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
        className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-6xl z-50 flex justify-between md:justify-center items-center bg-white border-4 border-black rounded-full px-4 md:px-12 py-3 lego-shadow-sm"
      >
        <div className="flex items-center gap-3 md:mr-8">
          <div className="w-10 h-10 rounded-xl bg-[#FF4911] border-4 border-black flex items-center justify-center text-white font-black text-lg">
            AC
          </div>
          <span className="font-black text-2xl tracking-tight hidden md:block">autoclaw</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4 font-bold text-lg">
          <button onClick={() => navigate('download')} className="hover:text-[#FF4911] transition-colors">{tData.nav.download}</button>
          <button onClick={() => navigate('docs')} className="hover:text-[#33E1ED] transition-colors">{tData.nav.docs}</button>
          <button onClick={() => navigate('opensource')} className="hover:text-[#FFD500] transition-colors">{tData.nav.opensource}</button>
          <button onClick={() => navigate('skills')} className="hover:text-[#D56BFF] transition-colors">{tData.nav.skills}</button>
          <button onClick={() => navigate('mcp')} className="hover:text-[#00E676] transition-colors">{tData.nav.mcp}</button>
          <button onClick={() => navigate('tips')} className="hover:text-[#FF4911] transition-colors">{tData.nav.tips}</button>
          <button onClick={() => navigate('token')} className="hover:text-[#33E1ED] transition-colors">{tData.nav.token}</button>
          <button onClick={() => navigate('community')} className="hover:text-[#00E676] transition-colors">{tData.nav.community}</button>
        </div>

        <div className="flex items-center gap-4 md:ml-8">
          <div className="flex bg-gray-100 border-4 border-black rounded-full overflow-hidden">
            <button 
              onClick={() => handleLangChange('zh')}
              className={`px-4 py-1.5 font-bold transition-colors ${lang === 'zh' ? 'bg-[#FFD500] text-black' : 'hover:bg-gray-200'}`}
            >
              中
            </button>
            <div className="w-1 bg-black"></div>
            <button 
              onClick={() => handleLangChange('en')}
              className={`px-4 py-1.5 font-bold transition-colors ${lang === 'en' ? 'bg-[#FFD500] text-black' : 'hover:bg-gray-200'}`}
            >
              EN
            </button>
          </div>
          
          <button 
            className="md:hidden p-2 border-4 border-black rounded-xl bg-[#33E1ED] text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 left-4 right-4 bg-white border-4 border-black rounded-3xl p-6 z-40 lego-shadow flex flex-col gap-4 font-bold text-xl md:hidden"
          >
            <button onClick={() => navigate('download')} className="flex items-center gap-3 p-4 bg-[#FF4911] text-white border-4 border-black rounded-2xl"><Download /> {tData.nav.download}</button>
            <button onClick={() => navigate('docs')} className="flex items-center gap-3 p-4 bg-[#33E1ED] border-4 border-black rounded-2xl"><BookOpen /> {tData.nav.docs}</button>
            <button onClick={() => navigate('opensource')} className="flex items-center gap-3 p-4 bg-[#FFD500] border-4 border-black rounded-2xl"><Github /> {tData.nav.opensource}</button>
            <button onClick={() => navigate('skills')} className="flex items-center gap-3 p-4 bg-[#D56BFF] border-4 border-black rounded-2xl"><Plug /> {tData.nav.skills}</button>
            <button onClick={() => navigate('mcp')} className="flex items-center gap-3 p-4 bg-[#00E676] border-4 border-black rounded-2xl"><Sparkles /> {tData.nav.mcp}</button>
            <button onClick={() => navigate('tips')} className="flex items-center gap-3 p-4 bg-[#FF4911] border-4 border-black rounded-2xl"><Lightbulb /> {tData.nav.tips}</button>
            <button onClick={() => navigate('token')} className="flex items-center gap-3 p-4 bg-[#33E1ED] border-4 border-black rounded-2xl"><Key /> {tData.nav.token}</button>
            <button onClick={() => navigate('community')} className="flex items-center gap-3 p-4 bg-[#00E676] border-4 border-black rounded-2xl"><MessageCircle /> {tData.nav.community}</button>
          </motion.div>
        )}

      {/* Main Content */}
      <main className="pt-40 px-6 max-w-7xl mx-auto w-full">
        {currentPage === 'home' && (<>
        
        {/* Hero Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-[60vh] flex flex-col items-center justify-center text-center mb-32 relative"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6 px-6 py-2 bg-[#FFD500] border-4 border-black rounded-full font-bold text-lg lego-shadow-sm transform -rotate-2">
            🚀 v1.0.0 is out!
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] max-w-5xl">
            {tData.hero.title}
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl font-bold text-gray-700 mb-12 max-w-3xl leading-relaxed">
            {tData.hero.subtitle}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
            <button onClick={() => navigate('download')} className="flex items-center justify-center gap-3 px-10 py-5 bg-[#FF4911] text-white border-4 border-black rounded-2xl font-black text-2xl lego-shadow lego-shadow-hover transition-all">
              <Download size={28} strokeWidth={3} />
              {tData.hero.downloadBtn}
            </button>
            <button onClick={() => navigate('docs')} className="flex items-center justify-center gap-3 px-10 py-5 bg-white border-4 border-black rounded-2xl font-black text-2xl lego-shadow lego-shadow-hover transition-all">
              <BookOpen size={28} strokeWidth={3} />
              {tData.hero.docsBtn}
            </button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="mb-32"
        >
          <div className="inline-block mb-12 bg-white border-4 border-black rounded-2xl px-8 py-4 lego-shadow-sm transform rotate-1">
            <h2 className="text-4xl md:text-5xl font-black">{tData.features.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tData.features.items.map((item, i) => {
              const bgColors = ['bg-[#33E1ED]', 'bg-[#FFD500]', 'bg-[#D56BFF]', 'bg-[#00E676]'];
              const icons = [<LinkIcon size={48} strokeWidth={2.5} />, <Clock size={48} strokeWidth={2.5} />, <Zap size={48} strokeWidth={2.5} />, <Lock size={48} strokeWidth={2.5} />];
              return (
                <div key={i} className={`${bgColors[i]} border-4 border-black rounded-3xl p-8 lego-shadow lego-shadow-hover transition-all relative overflow-hidden group`}>
                  {/* Decorative Lego Studs */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-50">
                    <div className="w-4 h-4 rounded-full border-4 border-black"></div>
                    <div className="w-4 h-4 rounded-full border-4 border-black"></div>
                  </div>
                  
                  <div className="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {icons[i]}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                  <p className="text-lg font-bold leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Quick Start Section (Lego Blocks) */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="mb-32"
        >
          <div className="inline-block mb-16 bg-white border-4 border-black rounded-2xl px-8 py-4 lego-shadow-sm transform -rotate-1">
            <h2 className="text-4xl md:text-5xl font-black">{tData.quickstart.title}</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-12 lg:gap-8 pt-4">
            {tData.quickstart.steps.map((step, i) => {
              const bgColors = ['bg-[#FF4911]', 'bg-[#33E1ED]', 'bg-[#FFD500]'];
              const textColors = ['text-white', 'text-black', 'text-black'];
              return (
                <div key={i} className={`relative flex-1 w-full max-w-md ${bgColors[i]} ${textColors[i]} border-4 border-black rounded-3xl p-8 lego-shadow hover:-translate-y-2 transition-transform`}>
                  {/* Lego Studs on top */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-4">
                    <div className={`w-12 h-6 border-4 border-black border-b-0 rounded-t-lg ${bgColors[i]}`}></div>
                    <div className={`w-12 h-6 border-4 border-black border-b-0 rounded-t-lg ${bgColors[i]}`}></div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 shrink-0 bg-white text-black border-4 border-black rounded-2xl flex items-center justify-center text-3xl font-black">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-black text-2xl mb-2">{step.title}</h3>
                      <p className="font-bold text-lg opacity-90">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Security Section */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className="max-w-4xl mx-auto bg-white border-8 border-black rounded-[40px] p-8 md:p-12 lego-shadow relative overflow-hidden">
            {/* Decorative hazard stripes */}
            <div className="absolute top-0 left-0 right-0 h-4" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFD500, #FFD500 20px, #000 20px, #000 40px)' }}></div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-10 mt-6 flex items-center gap-4">
              <ShieldCheck size={48} strokeWidth={3} className="text-[#00E676]" />
              {tData.security.title}
            </h2>
            
            <ul className="space-y-6">
              {tData.security.items.map((item, i) => {
                const icons = [<Lock size={28} />, <Key size={28} />, <Database size={28} />, <AlertTriangle size={28} />, <Lightbulb size={28} />];
                const iconBg = ['bg-[#00E676]', 'bg-[#33E1ED]', 'bg-[#D56BFF]', 'bg-[#FFD500]', 'bg-[#FF4911]'];
                return (
                  <li key={i} className="flex items-center gap-6 p-4 bg-gray-50 border-4 border-black rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className={`w-14 h-14 shrink-0 border-4 border-black rounded-xl flex items-center justify-center ${iconBg[i]} ${i === 3 || i === 4 ? 'text-white' : 'text-black'}`}>
                      {icons[i]}
                    </div>
                    <span className="text-lg md:text-xl font-bold">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t-8 border-black text-center">
          <div className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold text-lg">
            {tData.footer}
          </div>
        </footer>
        </>)}

        {/* Page Routes */}
        {currentPage === 'download' && <DownloadPage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'docs' && <DocsPage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'skills' && <SkillsPage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'mcp' && <MCPPage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'opensource' && <OpenSourcePage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'tips' && <TipsPage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'token' && <TokenPage lang={lang} onBack={() => navigate('home')} />}
        {currentPage === 'community' && <CommunityPage lang={lang} onBack={() => navigate('home')} />}
      </main>
    </div>
  );
}
