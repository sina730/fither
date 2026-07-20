import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUser, logout } from '../utils/auth';
import { storage } from '../utils/storage';

/** 按用户隔离 key（与 Plan.jsx 保持一致） */
function uk(key) {
  const u = getCurrentUser();
  return u ? `${key}__${u.email}` : key;
}

const navLinks = ['首页', '训练计划', '动作指导', '饮食建议'];

const navRoutes = {
  '首页': '/',
  '训练计划': '/plan',
  '动作指导': '/equipment',
  '饮食建议': '/diet',
};

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: '个人训练计划',
    desc: '量身定制，高效达成目标',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11" /><rect x="4" y="3" width="16" height="4" rx="1" /><rect x="7" y="7" width="10" height="14" rx="2" /><line x1="9" y1="9" x2="12" y2="9" /><line x1="9" y1="13" x2="12" y2="13" /><line x1="9" y1="17" x2="12" y2="17" />
      </svg>
    ),
    title: '动作指导',
    desc: '详细视频讲解，轻松上手',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: '饮食建议',
    desc: '营养搭配，吃出好身材',
  },
];

const goalIcons = { '减脂': '🔥', '增肌': '💪', '塑形': '✨' };
const goalLabelMap = { '减脂': '减脂', '增肌': '增肌', '塑形': '塑形' };

function UserCard({ onClose, onGoPlan, onLogout }) {
  const cardRef = useRef(null);
  const user = getCurrentUser();
  const profile = storage.get(uk('profile'));
  const goal = profile?.goal || '减脂';
  const checkinDays = Object.keys(storage.get(uk('checkins')) || {}).length;
  const initial = (user?.email || '?')[0].toUpperCase();

  useEffect(() => {
    const h = (e) => { if (cardRef.current && !cardRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <motion.div ref={cardRef} initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
      className="absolute right-0 top-[50px] z-50 rounded-[20px] overflow-hidden"
      style={{ width: 280, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 16px 48px rgba(50,25,35,0.12)' }}>
      <div style={{ padding: '22px 22px 18px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white text-[20px] font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f06a9a, #FF9ABB)', boxShadow: '0 4px 16px rgba(240,106,154,0.25)' }}>{initial}</div>
        <p className="text-[16px] font-semibold m-0 tracking-[-0.2px]" style={{ color: '#2d2a30' }}>{user?.email || '未登录'}</p>
      </div>
      <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="text-center">
          <p className="text-[22px] font-bold m-0 leading-none" style={{ color: '#302d33' }}>{goalIcons[goal] || '🎯'} {goalLabelMap[goal] || goal}</p>
          <p className="text-[11px] m-0 mt-1" style={{ color: '#9d969f' }}>健身目标</p>
        </div>
        <div style={{ width: 1, background: 'rgba(0,0,0,0.05)' }} />
        <div className="text-center">
          <p className="text-[22px] font-bold m-0 leading-none" style={{ color: '#302d33' }}>{checkinDays}<span className="text-[13px] font-normal ml-0.5" style={{ color: '#9d969f' }}>天</span></p>
          <p className="text-[11px] m-0 mt-1" style={{ color: '#9d969f' }}>累计打卡</p>
        </div>
      </div>
      <div style={{ padding: '8px 12px' }}>
        <button onClick={onGoPlan}
          className="w-full text-left text-[13px] font-medium border-0 bg-transparent cursor-pointer rounded-[10px] transition-colors flex items-center gap-2"
          style={{ height: 40, padding: '0 12px', color: '#565158' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fdf2f6'; e.currentTarget.style.color = '#ee6a98'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#565158'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          查看训练计划
        </button>
        <button onClick={onLogout}
          className="w-full text-left text-[13px] font-medium border-0 bg-transparent cursor-pointer rounded-[10px] transition-colors flex items-center gap-2"
          style={{ height: 40, padding: '0 12px', color: '#999' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#666'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#999'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          退出登录
        </button>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserCard, setShowUserCard] = useState(false);

  const loggedIn = isLoggedIn();

  const handleCTA = () => {
    if (loggedIn) {
      const hasProfile = !!storage.get(uk('profile'));
      navigate(hasProfile ? '/plan' : '/onboarding');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ====== 主图背景 ====== */}
      <motion.img
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.95, scale: 1 }}
        transition={{ duration: 1.3, ease: 'easeOut', delay: 0.1 }}
        src="./hero-model.png"
        alt="FitHer"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'translate(30px, 20px)' }}
      />

      {/* ====== 粉色泡泡呼吸 overlay ====== */}
      <style>{`
        @keyframes bubbleBreathe {
          0%, 100% { transform: translate(-50%, -50%) scale(0.85); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
      <div
        className="absolute rounded-full pointer-events-none z-[5]"
        style={{
          top: '50%', left: '50%',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(245, 105, 140, 0.4) 0%, rgba(245, 105, 140, 0.12) 40%, transparent 65%)',
          animation: 'bubbleBreathe 5s ease-in-out infinite',
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
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F56898, #FF9ABB)', boxShadow: '0 4px 16px rgba(245,104,152,0.28)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[30px] font-bold" style={{ color: '#111' }}>FitHer</span>
            <span className="text-[12px]" style={{ color: '#F56898' }}>为更好的自己</span>
          </div>
        </Link>

        {/* 中间导航 */}
        <div className="hidden lg:flex items-center gap-[44px]">
          {navLinks.map((link, i) => {
            const isActive = link === '首页';
            const route = navRoutes[link] || '/';
            return (
              <motion.div
                key={link}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
              >
                {isActive ? (
                  <span className="inline-block px-6 py-2.5 bg-[#fde8ef] text-[#F56898] text-[18px] font-semibold rounded-[30px] cursor-default">
                    {link}
                  </span>
                ) : (
                  <Link
                    to={route}
                    className="text-[18px] font-medium text-[#666] hover:text-[#F56898] transition-colors"
                  >
                    {link}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-[18px] shrink-0">
          {loggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserCard(!showUserCard)}
                className="h-[42px] text-white text-[18px] font-semibold rounded-[30px] transition-all flex items-center justify-center"
                style={{ padding: '0 22px', background: 'linear-gradient(135deg, #F56898, #FF9ABB)', boxShadow: '0 8px 25px rgba(240,106,154,0.25)' }}
              >
                个人主页
              </button>
              {showUserCard && <UserCard
                onClose={() => setShowUserCard(false)}
                onGoPlan={() => { setShowUserCard(false); const hasProfile = !!storage.get(uk('profile')); navigate(hasProfile ? '/plan' : '/onboarding'); }}
                onLogout={() => { logout(); setShowUserCard(false); navigate('/'); }}
              />}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="w-[80px] h-[40px] border border-gray-300 text-[18px] font-medium text-[#666] rounded-[30px] bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:border-gray-400 transition-all flex items-center justify-center"
              >
                登录
              </Link>
              <button
                onClick={handleCTA}
                className="w-[120px] h-[42px] text-white text-[18px] font-semibold rounded-[30px] shadow-[0_8px_25px_rgba(240,106,154,0.25)] hover:shadow-[0_12px_35px_rgba(240,106,154,0.4)] transition-all"
                style={{ background: 'linear-gradient(135deg, #F56898, #FF9ABB)' }}
              >
                开始训练
              </button>
            </>
          )}
        </div>
      </motion.nav>

      {/* ====== 中间 Hero 文字 ====== */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col items-center text-center max-w-[540px] pointer-events-auto"
          style={{ transform: 'translate(105px, -40px)' }}
        >
          {/* 主标题 */}
          <h1
            className="text-[72px] font-bold leading-[1.02] mb-[20px]"
            style={{ letterSpacing: '-3px' }}
          >
            <span className="bg-gradient-to-r from-[#F45F91] via-[#f57ba8] to-[#FF8DB5] bg-clip-text text-transparent">
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
            onClick={handleCTA}
            className="inline-flex items-center justify-center gap-2.5 w-[260px] h-[60px] text-white text-[18px] font-semibold rounded-[30px] shadow-[0_15px_40px_rgba(240,100,150,0.25)] transition-all mt-6"
            style={{
              background: 'linear-gradient(135deg, #F56898 0%, #FF9ABB 100%)',
            }}
          >
            {loggedIn ? '进入我的训练计划' : '开启我的专属训练'}
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

      {/* ====== 底部功能模块 ====== */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25, duration: 0.8, ease: 'easeOut' }}
        className="absolute bottom-[110px] left-0 right-0 z-10 flex items-start justify-center gap-[90px]"
      >
        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ translateY: -4 }}
            className="w-[180px] flex flex-col items-center text-center cursor-default py-6 px-4"
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#fde8ef] flex items-center justify-center shrink-0 mb-3">
              {item.icon}
            </div>
            <div className="text-[14px] font-semibold text-[#111] mb-1.5">{item.title}</div>
            <div className="text-[12px] text-[#999] leading-relaxed">{item.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ====== 最底部品牌标语 ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-[30px] left-0 right-0 z-10 flex items-center justify-center gap-3 text-[14px] text-[#aaa]"
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
