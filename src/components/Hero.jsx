import { motion } from 'framer-motion';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.65, ease: [0.25, 0.4, 0.25, 1] } },
});

const stats = [
  { value: '10k+', label: '活跃用户' },
  { value: '500+', label: '专业课程' },
  { value: '98%', label: '满意度' },
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: '个人训练计划',
    desc: '量身定制，高效达成目标',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: '饮食建议',
    desc: '科学搭配，吃出好身材',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11" /><rect x="4" y="3" width="16" height="4" rx="1" /><rect x="7" y="7" width="10" height="14" rx="2" /><line x1="9" y1="9" x2="12" y2="9" /><line x1="9" y1="13" x2="12" y2="13" /><line x1="9" y1="17" x2="12" y2="17" />
      </svg>
    ),
    title: '器材教学',
    desc: '详细视频讲解，轻松上手',
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* ============ Background Glow Orbs ============ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Coral glow — top right */}
        <div
          className="absolute -top-[15%] right-[-8%] w-[55%] h-[55%] rounded-full glow-orb"
          style={{ background: 'radial-gradient(circle, rgba(255,94,83,0.15) 0%, rgba(255,94,83,0.04) 40%, transparent 70%)' }}
        />
        {/* Teal glow — bottom left */}
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full glow-orb"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.1) 0%, rgba(45,212,191,0.03) 40%, transparent 70%)', animationDelay: '-2s' }}
        />
        {/* Subtle center glow */}
        <div
          className="absolute top-[30%] left-[50%] w-[40%] h-[40%] rounded-full glow-orb"
          style={{ background: 'radial-gradient(circle, rgba(255,120,110,0.08) 0%, transparent 60%)', animationDelay: '-3s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10">
        {/* ============ HERO ROW ============ */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-6">
          {/* ── LEFT COL ── */}
          <div className="flex-1 flex flex-col justify-center pt-6 lg:pt-14 text-center lg:text-left max-w-[580px] mx-auto lg:mx-0">
            {/* Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn(0)}
              className="inline-flex items-center gap-2 self-center lg:self-start mb-7 px-4 py-1.5 rounded-full border border-[rgba(255,94,83,0.2)] bg-[rgba(255,94,83,0.06)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-medium text-coral-300 tracking-wider">AI 智能训练平台</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn(0.15)}
              className="text-[42px] md:text-[58px] lg:text-[68px] font-extrabold leading-[1.06] tracking-[-0.025em] mb-5"
            >
              <span className="text-white">让每一次</span>
              <br />
              <span className="gradient-coral">训练</span>
              <span className="text-white">都充满</span>
              <br />
              <span className="text-white">科技感</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeIn(0.3)}
              className="text-base md:text-lg text-gray-400 leading-relaxed mb-9 max-w-[480px] mx-auto lg:mx-0"
            >
              个性化训练计划、科学饮食建议、器材使用视频教学，助你高效达成目标，享受每一次进步！
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn(0.45)}
              className="flex items-center gap-4 justify-center lg:justify-start mb-12"
            >
              <a href="#" className="btn-primary inline-flex items-center gap-2 text-sm md:text-[15px] px-7 py-3.5">
                开始你的专属计划
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-2.5 text-gray-400 hover:text-gray-200 text-sm font-medium transition-colors"
              >
                <span className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-coral-500/40 group-hover:bg-coral-500/8 transition-all">
                  <svg width="11" height="13" viewBox="0 0 24 28" fill="currentColor" className="text-coral-400 ml-0.5">
                    <polygon points="0,0 24,14 0,28" />
                  </svg>
                </span>
                观看视频介绍
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn(0.6)}
              className="flex items-center gap-8 md:gap-12 justify-center lg:justify-start"
            >
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{s.value}</span>
                  <span className="text-xs md:text-sm text-gray-500">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COL: Model & Visual ── */}
          <div className="flex-1 flex items-center justify-center relative w-full lg:min-h-[580px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.25 }}
              className="relative w-full max-w-[480px] aspect-[5/6] flex items-center justify-center"
            >
              {/* Glow ring behind model */}
              <div
                className="absolute w-[80%] h-[80%] rounded-full pulse-ring"
                style={{
                  background: 'radial-gradient(circle, rgba(255,94,83,0.06) 0%, rgba(45,212,191,0.04) 40%, transparent 65%)',
                }}
              />
              {/* Outer glow */}
              <div
                className="absolute w-[90%] h-[90%] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,120,110,0.08) 0%, transparent 50%)',
                }}
              />

              {/* Model image */}
              <div
                className="relative z-10 w-[78%] h-[90%] rounded-[36px] overflow-hidden float-animation"
                style={{
                  boxShadow: '0 30px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(255,94,83,0.05)',
                }}
              >
                <img
                  src="/hero-model.png"
                  alt="FitHer 女性健身"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating mini card: Workout stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute top-[8%] right-[2%] glass rounded-xl px-4 py-3 shadow-xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-coral-500/15 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5e53" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">今日消耗</div>
                    <div className="text-sm font-bold text-white">328 kcal</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating mini card: Heart rate */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute bottom-[20%] left-[0%] glass rounded-xl px-4 py-3 shadow-xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/15 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">心率</div>
                    <div className="text-sm font-bold text-white">128 bpm</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ============ FEATURE CARDS ============ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn(0.8)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 lg:mt-16 pb-10"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.015 }}
              className="glass rounded-2xl p-5 md:p-6 flex items-center gap-4 cursor-default transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-white/[0.1]"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[rgba(255,94,83,0.08)] flex items-center justify-center text-coral-400 shrink-0">
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-[14px] md:text-[15px]">{item.title}</h3>
                <p className="text-xs md:text-[13px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
