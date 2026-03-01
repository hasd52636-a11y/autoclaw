import { motion } from 'framer-motion';
import { Zap, ArrowLeft, Clock, Target, MousePointer, Search, FolderPlus, Trash2, LogIn } from 'lucide-react';

const translations = {
  zh: {
    title: '优质技能',
    subtitle: '基于 OpenClaw 的精选 AI 技能和工具',
    intro: '我们精心挑选了市面上与 OpenClaw 相关的优质技能和工具，帮助你更高效地使用浏览器自动化能力。',
    categories: [
      {
        name: '浏览器自动化',
        icon: MousePointer,
        color: 'bg-[#FF4911]',
        tools: [
          { name: 'Puppeteer', desc: 'Google 开发的浏览器自动化库', url: 'https://pptr.dev/' },
          { name: 'Playwright', desc: 'Microsoft 开发的跨浏览器自动化工具', url: 'https://playwright.dev/' },
          { name: 'Selenium', desc: '经典的浏览器自动化框架', url: 'https://www.selenium.dev/' },
          { name: 'Cypress', desc: '现代前端测试和自动化工具', url: 'https://www.cypress.io/' },
          { name: 'WebdriverIO', desc: '基于 WebDriver 的自动化测试框架', url: 'https://webdriver.io/' }
        ]
      },
      {
        name: 'AI 技能',
        icon: FolderPlus,
        color: 'bg-[#33E1ED]',
        tools: [
          { name: 'OpenAI Function Calling', desc: 'OpenAI 的函数调用能力', url: 'https://platform.openai.com/docs/guides/function-calling' },
          { name: 'Claude Tools', desc: 'Anthropic Claude 的工具使用', url: 'https://docs.anthropic.com/claude/docs/tools' },
          { name: 'Gemini Function Calling', desc: 'Google Gemini 的函数调用', url: 'https://ai.google.dev/docs/function_calling' },
          { name: 'LLM Agent Frameworks', desc: 'AI 代理框架', url: 'https://github.com/langchain-ai/langchain' }
        ]
      },
      {
        name: '工作流自动化',
        icon: LogIn,
        color: 'bg-[#D56BFF]',
        tools: [
          { name: 'Zapier', desc: '无代码工作流自动化平台', url: 'https://zapier.com/' },
          { name: 'Make', desc: '可视化工作流构建工具', url: 'https://www.make.com/' },
          { name: 'n8n', desc: '开源工作流自动化工具', url: 'https://n8n.io/' },
          { name: 'Airflow', desc: 'Apache 开源工作流编排平台', url: 'https://airflow.apache.org/' }
        ]
      },
      {
        name: '数据采集',
        icon: Target,
        color: 'bg-[#00E676]',
        tools: [
          { name: 'Scrapy', desc: 'Python 网络爬虫框架', url: 'https://scrapy.org/' },
          { name: 'Beautiful Soup', desc: 'Python HTML 解析库', url: 'https://www.crummy.com/software/BeautifulSoup/' },
          { name: 'Octoparse', desc: '可视化网页数据采集工具', url: 'https://www.octoparse.com/' },
          { name: 'ParseHub', desc: '智能网页数据提取工具', url: 'https://www.parsehub.com/' }
        ]
      },
      {
        name: 'OpenClaw 生态',
        icon: Zap,
        color: 'bg-[#FFD500]',
        tools: [
          { name: 'awesome-openclaw-usecases', desc: 'OpenClaw 使用案例集合', url: 'https://github.com/awesome-openclaw/awesome-openclaw-usecases' },
          { name: 'awesome-openclaw', desc: 'OpenClaw 生态资源集合', url: 'https://github.com/awesome-openclaw/awesome-openclaw' },
          { name: 'systemd 看门狗', desc: '进程监控和自动重启，防止僵尸进程', url: 'https://systemd.io/' },
          { name: 'Health Check', desc: '端口检测和进程状态监控，失败计数达到N次触发重启', url: 'https://github.com/healthchecks/healthchecks' },
          { name: 'openclaw-zero-token', desc: '使用免费 token 的方法', url: 'https://github.com/linuxhsj/openclaw-zero-token' },
          { name: 'Claw-X', desc: 'OpenClaw 相关网站', url: 'https://claw-x.com/' },
          { name: 'awesome-openclaw-skills-zh', desc: 'OpenClaw 中文技能集合', url: 'https://github.com/clawdbot-ai/awesome-openclaw-skills-zh' },
          { name: 'EvoMap', desc: 'AI Agent 的 DNA 系统，实现能力遗传、共享、进化', url: 'https://evomap.ai/' }
        ]
      }
    ],
    install: '推荐资源',
    installCmd: '点击链接查看详细信息和使用指南',
    github: '相关链接'
  },
  en: {
    title: 'Premium Skills',
    subtitle: 'Curated AI Skills and Tools for OpenClaw',
    intro: 'We have carefully selected high-quality skills and tools related to OpenClaw to help you use browser automation capabilities more efficiently.',
    categories: [
      {
        name: 'Browser Automation',
        icon: MousePointer,
        color: 'bg-[#FF4911]',
        tools: [
          { name: 'Puppeteer', desc: 'Google\'s browser automation library', url: 'https://pptr.dev/' },
          { name: 'Playwright', desc: 'Microsoft\'s cross-browser automation tool', url: 'https://playwright.dev/' },
          { name: 'Selenium', desc: 'Classic browser automation framework', url: 'https://www.selenium.dev/' },
          { name: 'Cypress', desc: 'Modern frontend testing and automation tool', url: 'https://www.cypress.io/' },
          { name: 'WebdriverIO', desc: 'WebDriver-based automation testing framework', url: 'https://webdriver.io/' }
        ]
      },
      {
        name: 'AI Skills',
        icon: FolderPlus,
        color: 'bg-[#33E1ED]',
        tools: [
          { name: 'OpenAI Function Calling', desc: 'OpenAI\'s function calling capability', url: 'https://platform.openai.com/docs/guides/function-calling' },
          { name: 'Claude Tools', desc: 'Anthropic Claude\'s tool usage', url: 'https://docs.anthropic.com/claude/docs/tools' },
          { name: 'Gemini Function Calling', desc: 'Google Gemini\'s function calling', url: 'https://ai.google.dev/docs/function_calling' },
          { name: 'LLM Agent Frameworks', desc: 'AI agent frameworks', url: 'https://github.com/langchain-ai/langchain' }
        ]
      },
      {
        name: 'Workflow Automation',
        icon: LogIn,
        color: 'bg-[#D56BFF]',
        tools: [
          { name: 'Zapier', desc: 'No-code workflow automation platform', url: 'https://zapier.com/' },
          { name: 'Make', desc: 'Visual workflow building tool', url: 'https://www.make.com/' },
          { name: 'n8n', desc: 'Open-source workflow automation tool', url: 'https://n8n.io/' },
          { name: 'Airflow', desc: 'Apache open-source workflow orchestration platform', url: 'https://airflow.apache.org/' }
        ]
      },
      {
        name: 'Data Scraping',
        icon: Target,
        color: 'bg-[#00E676]',
        tools: [
          { name: 'Scrapy', desc: 'Python web crawling framework', url: 'https://scrapy.org/' },
          { name: 'Beautiful Soup', desc: 'Python HTML parsing library', url: 'https://www.crummy.com/software/BeautifulSoup/' },
          { name: 'Octoparse', desc: 'Visual web data extraction tool', url: 'https://www.octoparse.com/' },
          { name: 'ParseHub', desc: 'Intelligent web data extraction tool', url: 'https://www.parsehub.com/' }
        ]
      },
      {
        name: 'OpenClaw Ecosystem',
        icon: Zap,
        color: 'bg-[#FFD500]',
        tools: [
          { name: 'awesome-openclaw-usecases', desc: 'OpenClaw use cases collection', url: 'https://github.com/awesome-openclaw/awesome-openclaw-usecases' },
          { name: 'awesome-openclaw', desc: 'OpenClaw ecosystem resources collection', url: 'https://github.com/awesome-openclaw/awesome-openclaw' },
          { name: 'systemd watchdog', desc: 'Process monitoring and automatic restart, prevent zombie processes', url: 'https://systemd.io/' },
          { name: 'Health Check', desc: 'Port detection and process status monitoring, trigger restart when failure count reaches N times', url: 'https://github.com/healthchecks/healthchecks' },
          { name: 'openclaw-zero-token', desc: 'Method to use free token', url: 'https://github.com/linuxhsj/openclaw-zero-token' },
          { name: 'Claw-X', desc: 'OpenClaw related website', url: 'https://claw-x.com/' },
          { name: 'awesome-openclaw-skills-zh', desc: 'OpenClaw Chinese skills collection', url: 'https://github.com/clawdbot-ai/awesome-openclaw-skills-zh' },
          { name: 'EvoMap', desc: 'AI Agent DNA system, enabling capability inheritance, sharing, and evolution', url: 'https://evomap.ai/' }
        ]
      }
    ],
    install: 'Recommended Resources',
    installCmd: 'Click links for detailed information and usage guides',
    github: 'Related Links'
  }
};

export default function SkillsPage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
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

        <div className="bg-[#FFD500] border-4 border-black rounded-3xl p-8 mb-12">
          <p className="font-bold text-lg">{t.intro}</p>
        </div>

        <div className="space-y-8">
          {t.categories.map((cat, i) => (
            <div key={i} className="bg-white border-4 border-black rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${cat.color} border-4 border-black rounded-2xl flex items-center justify-center`}>
                  <cat.icon size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black">{cat.name}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map((tool, j) => (
                  <div key={j} className="p-4 bg-gray-50 border-4 border-black rounded-2xl hover:bg-gray-100 transition-colors">
                    <code className="font-mono font-bold text-[#FF4911]">{tool.name}</code>
                    <p className="text-sm font-bold text-gray-600 mt-1">{tool.desc}</p>
                    {tool.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-bold text-[#33E1ED] hover:underline">
                        访问链接 →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Install Guide */}
        <div className="mt-12 bg-[#33E1ED] border-4 border-black rounded-3xl p-8">
          <h3 className="text-2xl font-black mb-4">{t.install}</h3>
          <p className="font-bold text-lg mb-4">{t.installCmd}</p>
          <div className="p-4 bg-black rounded-xl overflow-x-auto">
            <code className="text-[#00E676] font-mono">https://github.com/autoclaw/skills</code>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
