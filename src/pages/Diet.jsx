import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { foodLibrary, libraryCategories, allLibraryFoods, dietAdvice, avoidFoods, heroFeatures } from '../data/foods';
import { logout, getCurrentUser } from '../utils/auth';
import { storage } from '../utils/storage';

function uk(key) {
  const u = getCurrentUser();
  return u ? `${key}__${u.email}` : key;
}

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
          style={{ background: 'linear-gradient(135deg, #F56898, #FF9ABB)', boxShadow: '0 4px 16px rgba(245,104,152,0.25)' }}>{initial}</div>
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

/* ============================================
   Design Tokens
   ============================================ */
const T = {
  pink: '#FF6FA5',
  pinkLight: '#fff0f5',
  pinkBg: '#FFF7FA',
  title: '#1a1a1a',
  body: '#666',
  sub: '#999',
  cardBg: '#ffffff',
  shadow: '0 4px 20px rgba(0,0,0,0.04)',
  shadowMd: '0 8px 30px rgba(0,0,0,0.06)',
  shadowLg: '0 16px 40px rgba(0,0,0,0.08)',
};

/* ============================================
   Sub-Components
   ============================================ */

function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ height: 400, background: 'linear-gradient(135deg, #fffdfd 0%, #fff7fa 55%, #fff1f6 100%)' }}
    >
      {/* 右侧餐盘图片 — 融入渐变，无硬边 */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none z-[1]"
        style={{
          width: '55%',
          backgroundImage: 'url(./饮食建议顶部背景图.png)',
          backgroundSize: 'auto 155%',
          backgroundPosition: '75% center',
          backgroundRepeat: 'no-repeat',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 40%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 40%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* 柔和粉色光晕 — 与首页 Banner 风格一致 */}
      <div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          top: '15%', right: '-6%',
          width: 520, height: 520,
          background: 'radial-gradient(circle, rgba(255,111,165,0.18) 0%, rgba(255,111,165,0.07) 40%, transparent 65%)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          bottom: '-10%', right: '20%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(255,150,180,0.10) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-[42px] font-bold leading-[1.2] mb-3" style={{ letterSpacing: '-1.5px' }}>
            <span style={{ color: '#1a1a1a' }}>科学饮食，</span>
            <br />
            <span style={{ color: T.pink }}>吃出更好的自己</span>
          </h1>
          <p className="text-[15px] leading-relaxed" style={{ color: '#999', maxWidth: 420, marginBottom: 20 }}>
            了解食物热量与蛋白质，找到适合自己的健康饮食方式。
          </p>

          {/* Feature cards — 玻璃卡片 */}
          <div className="flex gap-3" style={{ maxWidth: 540 }}>
            {heroFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className="flex-1 flex items-center gap-2.5"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  padding: '18px 16px',
                }}
              >
                <span className="text-[20px] leading-none flex-shrink-0">{f.icon}</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold leading-tight" style={{ color: '#444' }}>{f.title}</div>
                  <div className="text-[12px] leading-tight" style={{ color: '#aaa' }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DietAdvice() {
  const goals = ['减脂期', '增肌期', '保持期'];
  const [active, setActive] = useState('减脂期');
  const advice = dietAdvice[active];

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 40px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-[28px] font-bold mb-1.5" style={{ color: T.title }}>
          每日饮食建议
        </h2>
        <p className="text-[14px] mb-6" style={{ color: T.sub }}>
          根据不同训练目标，选择适合自己的食物。
        </p>

        {/* Toggle buttons */}
        <div className="flex gap-3 mb-8">
          {goals.map((g) => (
            <motion.button
              key={g}
              onClick={() => setActive(g)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="text-[14px] font-medium border-0 cursor-pointer transition-all"
              style={{
                height: 42,
                padding: '0 28px',
                borderRadius: 22,
                background: active === g ? T.pink : '#fff',
                color: active === g ? '#fff' : '#888',
                boxShadow: active === g ? `0 6px 20px rgba(255,111,165,0.25)` : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {g}
            </motion.button>
          ))}
        </div>

        {/* Advice card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-[24px]"
            style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}
          >
            <div className="flex flex-col md:flex-row">
              {/* 左侧：饮食原则 */}
              <div className="flex-1" style={{ padding: '22px 40px 36px 8px' }}>
                <div className="flex items-center gap-2" style={{ marginTop: -10, marginBottom: 8 }}>
                  <div className="w-[5px] h-[20px] rounded-[3px]" style={{ background: T.pink }} />
                  <h3 className="text-[20px] font-semibold m-0" style={{ color: '#444' }}>
                    {active}饮食原则
                  </h3>
                </div>
                <p className="text-[18px] leading-relaxed" style={{ color: '#888', marginTop: -10 }}>{advice.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
                  {advice.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-3 text-[18px]" style={{ color: '#555' }}>
                      <span
                        className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] flex-shrink-0 text-white font-medium"
                        style={{ background: T.pink }}
                      >
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 右侧：小贴士卡片 */}
              <div className="md:min-w-[240px] flex items-stretch" style={{ borderLeft: '1px solid rgba(0,0,0,0.04)' }}>
                <div
                  className="flex flex-col items-center justify-center text-center w-full rounded-r-[24px]"
                  style={{ padding: '36px 28px', background: `linear-gradient(180deg, ${T.pinkLight} 0%, #fff8fa 100%)` }}
                >
                  <span className="text-[36px] mb-3">💡</span>
                  <p className="text-[12px] font-semibold mb-2 tracking-wider" style={{ color: T.pink }}>小贴士</p>
                  <p className="text-[13px] leading-relaxed m-0" style={{ color: '#999' }}>
                    {advice.highlight}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function FoodCard({ food, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4, boxShadow: T.shadowMd }}
      className="rounded-[16px] overflow-hidden cursor-default"
      style={{ background: T.cardBg, boxShadow: T.shadow }}
    >
      {/* Image — 2:1 aspect, cover crop */}
      <div style={{ aspectRatio: '2/1', overflow: 'hidden', background: food.gradient }}>
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: food.fit || 'cover', objectPosition: 'center', transform: food.scale ? `scale(${food.scale})` : undefined }}
          />
        ) : null}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <h3 className="text-[14px] font-semibold mb-1.5" style={{ color: T.title }}>
          {food.name}
        </h3>
        <div className="flex items-center gap-3 text-[11px] mb-2">
          <span style={{ color: '#e8607a' }}>
            🔥 {food.calories} kcal
          </span>
          <span style={{ color: '#5b7ec2' }}>
            💪 {food.protein}g 蛋白质
          </span>
        </div>
        {food.tags && (
          <div className="flex gap-1.5 flex-wrap">
            {food.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2.5 py-[3px] rounded-[20px]"
                style={{ background: '#fff0f5', color: '#d46082', border: '1px solid rgba(212,96,130,0.15)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FoodRecommendations() {
  const [activeCat, setActiveCat] = useState('all');
  const categories = Object.values(foodLibrary);

  const visibleCategories = activeCat === 'all'
    ? categories
    : categories.filter(c => c.id === activeCat);

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 40px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-[28px] font-bold mb-1.5" style={{ color: T.title }}>
          食物推荐
        </h2>
        <p className="text-[14px] mb-6" style={{ color: T.sub }}>
          根据不同需求，选择适合自己的健康食物。
        </p>

        {/* Category filter pills */}
        <div className="flex gap-3 mb-10 overflow-x-auto">
          {libraryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-[15px] font-medium border-0 cursor-pointer transition-all flex-shrink-0"
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: 20,
                background: activeCat === cat.id ? T.pink : '#fff',
                color: activeCat === cat.id ? '#fff' : '#888',
                boxShadow: activeCat === cat.id ? `0 4px 16px rgba(255,111,165,0.22)` : '0 1px 6px rgba(0,0,0,0.04)',
              }}
            >
              <span className="text-[15px]">{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Food categories */}
      {visibleCategories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: 16, padding: '28px 28px 32px', background: cat.bg, borderRadius: 20 }}>
          <div style={{ marginBottom: 22 }}>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-[20px] font-bold m-0" style={{ color: T.title }}>
                <span className="mr-1.5">{cat.icon}</span>
                {cat.title}
              </h3>
              <span className="text-[11px] font-semibold tracking-widest" style={{ color: '#ccc' }}>{cat.enTitle}</span>
            </div>
            <p className="text-[13px] m-0" style={{ color: T.sub }}>{cat.desc}</p>
          </div>
          <div className="food-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {cat.foods.map((food, i) => (
              <FoodCard key={food.name} food={food} index={i} />
            ))}
          </div>
        </div>
      ))}

      <style>{`
        @media (max-width: 900px) {
          .food-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function AvoidFoods() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 40px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-[28px] font-bold mb-1.5" style={{ color: T.title }}>
          训练期间尽量少吃
        </h2>
        <p className="text-[14px] mb-6" style={{ color: T.sub }}>
          常见高热量食物，可能影响训练效果。
        </p>
      </motion.div>

      {/* Horizontal scroll container */}
      <style>{`.avs::-webkit-scrollbar{height:4px}.avs::-webkit-scrollbar-thumb{background:#f0d0db;border-radius:2px}`}</style>
      <div className="avs flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f0d0db transparent' }}>
        {avoidFoods.map((food, i) => (
          <motion.div
            key={food.name}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(255,111,165,0.12)' }}
            className="flex-shrink-0 flex flex-col items-center gap-3 rounded-[18px] overflow-hidden cursor-default transition-shadow"
            style={{ width: 170, background: '#fff', border: '1px solid rgba(255,111,165,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
          >
            {food.image ? (
              <img src={food.image} alt={food.name} style={{ width: '100%', height: 150, objectFit: 'contain', objectPosition: 'center' }} />
            ) : (
              <div className="flex items-center justify-center" style={{ width: '100%', height: 150, background: '#fff4f7' }}>
                <span className="text-[28px]" style={{ color: '#d46082' }}>{food.name.charAt(0)}</span>
              </div>
            )}
            <div className="text-center px-3 pb-4">
              <div className="text-[14px] font-semibold mb-1" style={{ color: '#444' }}>{food.name}</div>
              <div className="text-[12px] mb-1.5" style={{ color: T.pink }}>
                约{food.calories} {food.unit}
              </div>
              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-[8px]" style={{ background: '#ffe8ef', color: '#d46082' }}>{food.tag}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FooterTip() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 70px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-[20px] p-6 flex items-start gap-4"
        style={{ background: `linear-gradient(135deg, ${T.pinkLight}, #fff8fa)`, border: '1px solid rgba(255,111,165,0.08)' }}
      >
        <span className="text-[28px] flex-shrink-0">💡</span>
        <div>
          <p className="text-[15px] font-semibold mb-1" style={{ color: '#555' }}>小贴士：</p>
          <p className="text-[14px] leading-relaxed" style={{ color: '#888' }}>
            饮食控制不是拒绝美食，合理搭配才能长期坚持。
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================
   Main Page
   ============================================ */
export default function Diet() {
  const navigate = useNavigate();
  const [showUserCard, setShowUserCard] = useState(false);
  const loggedIn = !!getCurrentUser();

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* Page overlay for readability */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(255,255,255,0.45)' }} />

      <div className="relative z-10">
        {/* ═══ NAV ═══ */}
        <nav
          className="sticky top-0 z-30"
          style={{ height: 72, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between h-full" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0">
              <div
                className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, #F56898, #FF9ABB)`, boxShadow: '0 4px 16px rgba(245,104,152,0.28)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-[28px] font-bold" style={{ color: '#111' }}>FitHer</span>
                <span className="text-[12px]" style={{ color: '#F56898' }}>为更好的自己</span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="flex items-center" style={{ gap: 44 }}>
              <Link to="/" className="text-[16px] font-medium no-underline" style={{ color: '#666' }}>首页</Link>
              <Link to="/plan" className="text-[18px] font-medium no-underline" style={{ color: '#666' }}>训练计划</Link>
              <Link to="/equipment" className="text-[18px] font-medium no-underline" style={{ color: '#666' }}>动作指导</Link>
              <span className="text-[18px] font-semibold relative cursor-default" style={{ color: '#F56898' }}>
                饮食建议
                <span className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 w-[36px] h-[3px] rounded-[999px] block" style={{ background: '#F56898' }} />
              </span>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 flex-shrink-0" style={{ width: 160, justifyContent: 'flex-end' }}>
              {loggedIn ? (
                <div className="relative">
                  <button onClick={() => setShowUserCard(!showUserCard)}
                    className="h-[42px] text-white text-[16px] font-semibold rounded-[30px] transition-all flex items-center justify-center border-0 cursor-pointer"
                    style={{ padding: '0 20px', background: 'linear-gradient(135deg, #F56898, #FF9ABB)', boxShadow: '0 8px 25px rgba(240,106,154,0.25)' }}>
                    个人主页
                  </button>
                  {showUserCard && <UserCard
                    onClose={() => setShowUserCard(false)}
                    onGoPlan={() => { setShowUserCard(false); const hasProfile = !!storage.get(uk('profile')); navigate(hasProfile ? '/plan' : '/onboarding'); }}
                    onLogout={() => { logout(); setShowUserCard(false); navigate('/'); }}
                  />}
                </div>
              ) : (
                <Link to="/login" className="text-[16px] font-medium no-underline" style={{ color: '#666' }}>登录</Link>
              )}
            </div>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <HeroBanner />

        {/* ═══ DIET ADVICE ═══ */}
        <DietAdvice />

        {/* ═══ FOOD RECOMMENDATIONS ═══ */}
        <FoodRecommendations />

        {/* ═══ AVOID FOODS ═══ */}
        <AvoidFoods />

        {/* ═══ FOOTER TIP ═══ */}
        <FooterTip />
      </div>
    </div>
  );
}
