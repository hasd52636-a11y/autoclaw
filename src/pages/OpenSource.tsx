import { motion } from 'framer-motion';
import { Github, ArrowLeft, Box, Heart, Star, GitFork } from 'lucide-react';

const translations = {
  zh: {
    title: '开源项目',
    subtitle: '基于 OpenClaw 生态的开源组件',
    intro: 'autoclaw 是一个开源项目，我们相信浏览器自动化应该是开放和可扩展的。',
    projects: [
      {
        name: 'autoclaw',
        desc: 'Chrome 扩展 - 浏览器自动化控制器',
        lang: 'JavaScript',
        stars: '1.2K',
        forks: '120'
      },
      {
        name: 'autoclaw-mcp',
        desc: 'MCP 服务器实现',
        lang: 'TypeScript',
        stars: '800',
        forks: '80'
      },
      {
        name: 'autoclaw-skills',
        desc: 'AI 技能定义文件',
        lang: 'Markdown',
        stars: '300',
        forks: '30'
      },
      {
        name: 'openclaw-gateway',
        desc: 'OpenClaw Gateway 核心',
        lang: 'Go',
        stars: '5K',
        forks: '500'
      }
    ],
    contribute: '贡献指南',
    contributeDesc: '欢迎提交 Issue 和 Pull Request！',
    license: '许可证',
    licenseType: 'MIT License'
  },
  en: {
    title: 'Open Source',
    subtitle: 'Open Source Components Based on OpenClaw Ecosystem',
    intro: 'autoclaw is an open source project. We believe browser automation should be open and extensible.',
    projects: [
      {
        name: 'autoclaw',
        desc: 'Chrome Extension - Browser Automation Controller',
        lang: 'JavaScript',
        stars: '1.2K',
        forks: '120'
      },
      {
        name: 'autoclaw-mcp',
        desc: 'MCP Server Implementation',
        lang: 'TypeScript',
        stars: '800',
        forks: '80'
      },
      {
        name: 'autoclaw-skills',
        desc: 'AI Skill Definition Files',
        lang: 'Markdown',
        stars: '300',
        forks: '30'
      },
      {
        name: 'openclaw-gateway',
        desc: 'OpenClaw Gateway Core',
        lang: 'Go',
        stars: '5K',
        forks: '500'
      }
    ],
    contribute: 'Contributing',
    contributeDesc: 'Welcome Issues and Pull Requests!',
    license: 'License',
    licenseType: 'MIT License'
  }
};

export default function OpenSourcePage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
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

        <div className="bg-black border-4 border-black rounded-3xl p-8 mb-12">
          <p className="text-white font-bold text-lg">{t.intro}</p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {t.projects.map((project, i) => {
            const colors = ['bg-[#FF4911]', 'bg-[#33E1ED]', 'bg-[#D56BFF]', 'bg-[#00E676]'];
            return (
              <div key={i} className="bg-white border-4 border-black rounded-3xl p-6 hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${colors[i]} border-4 border-black rounded-2xl flex items-center justify-center`}>
                    <Box size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold">
                      <Star size={16} className="text-[#FFD500]" /> {project.stars}
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <GitFork size={16} /> {project.forks}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2">{project.name}</h3>
                <p className="font-bold text-gray-600 mb-4">{project.desc}</p>
                <span className="inline-block px-3 py-1 bg-gray-100 border-2 border-black rounded-full font-bold text-sm">
                  {project.lang}
                </span>
              </div>
            );
          })}
        </div>

        {/* Contribute & License */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#FFD500] border-4 border-black rounded-3xl p-8">
            <Heart size={40} strokeWidth={2.5} className="mb-4" />
            <h3 className="text-2xl font-black mb-2">{t.contribute}</h3>
            <p className="font-bold">{t.contributeDesc}</p>
          </div>
          <div className="bg-[#33E1ED] border-4 border-black rounded-3xl p-8">
            <Github size={40} strokeWidth={2.5} className="mb-4" />
            <h3 className="text-2xl font-black mb-2">{t.license}</h3>
            <p className="font-bold">{t.licenseType}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
