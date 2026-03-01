import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Users, Github, Mail, MessageSquare } from 'lucide-react';

const translations = {
  zh: {
    title: '社群',
    subtitle: '加入 autoclaw 社区，与开发者交流',
    intro: '有问题？有代码建议？想贡献？我们欢迎你的加入！',
    channels: [
      { name: 'GitHub', desc: '提交 Issue 和 PR', icon: Github, color: 'bg-[#FF4911]' },
      { name: '微信', desc: '聊天讨论: wirelesscharger', icon: MessageSquare, color: 'bg-[#33E1ED]' },
      { name: 'Email', desc: '商务合作联系: 909599954@qq.com', icon: Mail, color: 'bg-[#D56BFF]' }
    ],
    join: '加入社群',
    stats: [
      { value: '10K+', label: '用户' },
      { value: '500+', label: 'GitHub Stars' },
      { value: '50+', label: '贡献者' }
    ],
    contribution: '贡献指南',
    contributionList: [
      'Fork 项目',
      '创建功能分支',
      '提交代码',
      '创建 Pull Request',
      '等待代码 review'
    ]
  },
  en: {
    title: 'Community',
    subtitle: 'Join autoclaw community, chat with developers',
    intro: 'Have questions? Have suggestions? Want to contribute? We welcome you!',
    channels: [
      { name: 'GitHub', desc: 'Submit Issues and PRs', icon: Github, color: 'bg-[#FF4911]' },
      { name: 'WeChat', desc: 'Chat discussion: wirelesscharger', icon: MessageSquare, color: 'bg-[#33E1ED]' },
      { name: 'Email', desc: 'Business inquiries: 909599954@qq.com', icon: Mail, color: 'bg-[#D56BFF]' }
    ],
    join: 'Join Community',
    stats: [
      { value: '10K+', label: 'Users' },
      { value: '500+', label: 'GitHub Stars' },
      { value: '50+', label: 'Contributors' }
    ],
    contribution: 'Contributing',
    contributionList: [
      'Fork the project',
      'Create feature branch',
      'Commit your changes',
      'Create Pull Request',
      'Wait for review'
    ]
  }
};

export default function CommunityPage({ lang, onBack }: { lang: 'zh' | 'en'; onBack: () => void }) {
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
        <p className="text-xl font-bold text-gray-600 mb-8">{t.subtitle}</p>

        <div className="bg-gradient-to-r from-[#FF4911] to-[#D56BFF] border-4 border-black rounded-3xl p-8 mb-12 text-white">
          <p className="font-bold text-lg">{t.intro}</p>
        </div>

        {/* Community Channels */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {t.channels.map((channel, i) => (
            <div key={i} className="bg-white border-4 border-black rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform cursor-pointer">
              <div className={`w-16 h-16 ${channel.color} border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <channel.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black mb-2">{channel.name}</h3>
              <p className="font-bold text-gray-600">{channel.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-black border-4 border-black rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-black text-white mb-8 text-center">{t.join}</h3>
          <div className="grid grid-cols-3 gap-6">
            {t.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-[#FFD500]">{stat.value}</div>
                <div className="font-bold text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Guide */}
        <div className="bg-white border-4 border-black rounded-3xl p-8">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <Users size={32} strokeWidth={2.5} />
            {t.contribution}
          </h3>
          <div className="flex flex-wrap gap-4">
            {t.contributionList.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-10 h-10 bg-[#33E1ED] border-4 border-black rounded-full flex items-center justify-center font-black">
                  {i + 1}
                </span>
                <span className="font-bold">{step}</span>
                {i < t.contributionList.length - 1 && <span className="text-gray-400">→</span>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
