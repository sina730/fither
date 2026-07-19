import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { foodLibrary, libraryCategories, allLibraryFoods, dietAdvice, avoidFoods, heroFeatures } from '../data/foods';
import { logout as doLogout, isLoggedIn } from '../utils/auth';

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
              <div className="flex-1" style={{ padding: '36px 40px' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-[5px] h-[18px] rounded-[3px]" style={{ background: T.pink }} />
                  <h3 className="text-[16px] font-semibold m-0" style={{ color: '#444' }}>
                    {active}饮食原则
                  </h3>
                </div>
                <p className="text-[14px] mb-6 leading-relaxed" style={{ color: '#888' }}>{advice.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {advice.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px]" style={{ color: '#555' }}>
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
              className="flex items-center gap-2 text-[13px] font-medium border-0 cursor-pointer transition-all flex-shrink-0"
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
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: '#ccc' }}>{cat.enTitle}</span>
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
            style={{ width: 150, background: '#fff', border: '1px solid rgba(255,111,165,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
          >
            {food.image ? (
              <img src={food.image} alt={food.name} style={{ width: '100%', height: 120, objectFit: 'contain', objectPosition: 'center' }} />
            ) : (
              <div className="flex items-center justify-center" style={{ width: '100%', height: 120, background: '#fff4f7' }}>
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
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    doLogout();
    navigate('/');
  };

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
          style={{ height: 72, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between h-full" style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px' }}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div
                className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${T.pink}, #FF9ABB)`, boxShadow: `0 4px 14px rgba(255,111,165,0.22)` }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-[24px] font-bold" style={{ color: '#222' }}>FitHer</span>
                <span className="text-[10px]" style={{ color: T.pink }}>为更好的自己</span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>首页</Link>
              <Link to="/plan" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>训练计划</Link>
              <Link to="/equipment" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>器材教学</Link>
              <span className="text-[14px] font-semibold relative cursor-default" style={{ color: T.pink }}>
                饮食建议
                <span className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 w-[42px] h-[2px] rounded-[2px] block" style={{ background: T.pink }} />
              </span>
              <Link to="/" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>关于我们</Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-[13px] font-medium border rounded-[22px] bg-white cursor-pointer"
                  style={{ height: 42, padding: '0 20px', borderColor: '#e8e8e8', color: '#888' }}
                >
                  退出
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-[13px] font-medium border rounded-[22px] bg-white no-underline inline-flex items-center"
                  style={{ height: 42, padding: '0 20px', borderColor: '#e8e8e8', color: '#888' }}
                >
                  登录
                </Link>
              )}
              <button
                className="text-[13px] font-semibold text-white border-0 rounded-[22px] cursor-pointer"
                style={{ height: 42, padding: '0 22px', background: `linear-gradient(135deg, ${T.pink}, #FF9ABB)`, boxShadow: `0 4px 14px rgba(255,111,165,0.2)` }}
              >
                开始训练
              </button>
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
