import { motion } from 'framer-motion';

export default function App() {
  const navLinks = ['首页', '训练计划', '饮食建议', '器材教学', '关于我们'];

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: '个人训练计划',
      desc: '量身定制，高效达成目标',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      title: '饮食建议',
      desc: '营养搭配，吃出好身材',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5h11" /><rect x="4" y="3" width="16" height="4" rx="1" /><rect x="7" y="7" width="10" height="14" rx="2" /><line x1="9" y1="9" x2="12" y2="9" /><line x1="9" y1="13" x2="12" y2="13" /><line x1="9" y1="17" x2="12" y2="17" />
        </svg>
      ),
      title: '器材教学',
      desc: '详细视频讲解，轻松上手',
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ====== 主图背景 ====== */}
      <motion.img
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.95, scale: 1 }}
        transition={{ duration: 1.3, ease: 'easeOut', delay: 0.1 }}
        src="/hero-model.png"
        alt="FitHer"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ====== 呼吸光圈层 ====== */}
      <style>{`
        @keyframes glowOuter {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; filter: blur(50px); }
          50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.8; filter: blur(60px); }
        }
        @keyframes glowInner {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.65; filter: blur(20px); }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.9; filter: blur(35px); }
        }
      `}</style>
      {/* 外圈 — 大范围柔光，8秒 */}
      <div
        className="absolute rounded-full pointer-events-none z-[5]"
        style={{
          top: '50%', left: '50%',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(245, 105, 140, 0.15) 0%, rgba(245, 105, 140, 0.04) 40%, transparent 65%)',
          animation: 'glowOuter 8s ease-in-out infinite',
        }}
      />
      {/* 内圈 — 核心柔光，5秒 */}
      <div
        className="absolute rounded-full pointer-events-none z-[5]"
        style={{
          top: '50%', left: '50%',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(245, 105, 140, 0.25) 0%, rgba(245, 105, 140, 0.06) 35%, transparent 60%)',
          animation: 'glowInner 5s ease-in-out infinite',
        }}
      />

      {/* 底部渐隐层 */}
      <div className="absolute bottom-0 left-0 right-0 h-[180px] z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.3) 0%, transparent 100%)' }} />

      {/* ====== 顶部导航栏 ====== */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute top-[38px] left-[60px] right-[60px] z-20 flex items-center justify-between h-[64px]"
      >
        {/* Logo */}
        <motion.a
          href="#"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-11 h-11 rounded-xl bg-[#f06a9a] flex items-center justify-center shadow-lg shadow-[#f06a9a]/25">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[26px] font-bold tracking-tight text-[#111]">FitHer</span>
            <span className="text-[12px] text-[#f06a9a] tracking-wide">为更好的自己</span>
          </div>
        </motion.a>

        {/* 中间导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-[44px]"
        >
          {navLinks.map((link, i) => {
            const isActive = link === '首页';
            return (
              <motion.div
                key={link}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
              >
                {isActive ? (
                  <span className="inline-block px-6 py-2.5 bg-[#fde8ef] text-[#f06a9a] text-[15px] font-semibold rounded-[30px] cursor-default">
                    {link}
                  </span>
                ) : (
                  <a
                    href="#"
                    className="text-[15px] font-medium text-[#555] hover:text-[#f06a9a] transition-colors"
                  >
                    {link}
                  </a>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 右侧操作区 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-[18px] shrink-0"
        >
          {/* 搜索 */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-[44px] h-[44px] rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </motion.button>
          {/* 登录 */}
          <motion.button
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-[80px] h-[40px] border border-gray-300 text-[14px] font-medium text-[#555] rounded-[30px] bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:border-gray-400 transition-all"
          >
            登录
          </motion.button>
          {/* 开始训练 */}
          <motion.button
            whileHover={{
              scale: 1.05,
              translateY: -2,
              boxShadow: '0 12px 35px rgba(240,106,154,0.4), 0 0 0 8px rgba(240,106,154,0.06)',
            }}
            whileTap={{ scale: 0.95 }}
            className="w-[120px] h-[42px] bg-[#f06a9a] text-white text-[14px] font-semibold rounded-[30px] shadow-[0_8px_25px_rgba(240,106,154,0.25)] transition-all"
          >
            开始训练
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* ====== 中间 Hero 文字 ====== */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col items-center text-center max-w-[540px] pointer-events-auto"
          style={{ transform: 'translate(80px, -40px)' }}
        >
          {/* 主标题 */}
          <h1
            className="text-[72px] font-bold leading-[1.02] mb-[20px]"
            style={{ letterSpacing: '-3px' }}
          >
            <span
              className="bg-gradient-to-r from-[#F45F91] via-[#f57ba8] to-[#FF8DB5] bg-clip-text text-transparent"
            >
              轻松
            </span>
            <span className="text-[#111]">开启锻炼</span>
          </h1>

          {/* 副标题 */}
          <p className="text-[30px] text-[#111] font-medium mb-2 flex items-center gap-[15px]">
            <span>遇见更健康 · 更自信的自己</span>
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.9, duration: 0.45, type: 'spring', stiffness: 280 }}
              className="text-[#f06a9a] inline-block"
            >
              ♡
            </motion.span>
          </p>

          {/* 粉色手绘装饰线 */}
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.7, ease: 'easeInOut' }}
            width="180" height="12" viewBox="0 0 180 12" className="mb-8"
          >
            <motion.path
              d="M8 6 Q54 0 90 6 Q126 12 172 6"
              stroke="#f06a9a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.55"
            />
          </motion.svg>

          {/* 描述文字 */}
          <p className="text-[18px] text-[#777] leading-[1.8] mb-10 max-w-[500px]">
            个性化训练计划、科学饮食建议、器材使用视频教学，<br />
            助你高效达成目标，享受每一次进步！
          </p>

          {/* CTA 按钮 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.65, ease: 'easeOut' }}
            whileHover={{
              scale: 1.05,
              translateY: -3,
              boxShadow: '0 18px 50px rgba(240,100,150,0.32)',
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2.5 w-[260px] h-[60px] text-white text-[16px] font-semibold rounded-[30px] shadow-[0_15px_40px_rgba(240,100,150,0.25)] transition-all mt-6"
            style={{
              background: 'linear-gradient(135deg, #F56898 0%, #FF9ABB 100%)',
            }}
          >
            开始我的专属训练
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ delay: 1.7, duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-flex"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* ====== 底部功能模块 — 透明玻璃 ====== */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25, duration: 0.8, ease: 'easeOut' }}
        className="absolute bottom-[130px] left-0 right-0 z-10 flex items-center justify-center gap-5"
      >
        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ translateY: -3 }}
            className="w-[220px] glass-feature px-6 py-5 cursor-default flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fde8ef] flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="text-left min-w-0">
              <div className="text-[14px] font-semibold text-[#111] leading-tight">{item.title}</div>
              <div className="text-[12px] text-[#999] mt-1 leading-relaxed">{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ====== 最底部品牌标语 ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-[60px] left-0 right-0 z-10 flex items-center justify-center gap-3 text-[14px] text-[#aaa]"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.8, duration: 0.3, type: 'spring' }}
          className="w-1.5 h-1.5 rounded-full bg-[#f06a9a]/50 inline-block"
        />
        专为女性打造的健身平台
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.95, duration: 0.3, type: 'spring' }}
          className="w-1.5 h-1.5 rounded-full bg-[#f06a9a]/50 inline-block"
        />
      </motion.div>
    </div>
  );
}
