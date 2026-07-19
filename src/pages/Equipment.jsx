import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { mainCategories, allVideos, getCoverStyle } from '../data/equipmentData';

/* ========== Design Tokens ========== */
const PINK = '#F56898';
const shadow = '0 8px 28px rgba(0,0,0,0.05)';
const shadowLg = '0 16px 40px rgba(0,0,0,0.08)';

/* ========== 星级 ========== */
function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < n ? '#F56898' : '#e0e0e0'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      ))}
    </div>
  );
}

/* ========== 视频卡片 ========== */
function VideoCard({ video, index }) {
  const nav = useNavigate();
  const coverStyle = getCoverStyle(video, index);
  const playIcons = {
    strength: '🏋️', stretch: '🧘', treadmill: '🏃',
    'free-weight': '💪', 'glutes-legs': '🍑', 'chest-back': '🎯', core: '🔥', cardio: '💦',
  };
  const emoji = playIcons[video.category] || '▶';
  const hotCount = ((video.title.length * 1733 + index * 421) % 8000 + 2500).toFixed(0);

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => nav(`/equipment/video/${video.id}`)}
      className="cursor-pointer rounded-[20px] overflow-hidden flex flex-col"
      style={{ background: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
    >
      {/* 封面区域 — 220px 高 */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        {/* 真实封面图 或 占位渐变 */}
        {video.cover ? (
          <img src={video.cover} alt={video.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={coverStyle}>
            <span className="text-[56px] opacity-35 select-none">{emoji}</span>
          </div>
        )}
        {/* 渐变遮罩覆盖 */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)' }} />
        {/* 中央播放按钮 — 60px 圆，#FF6FA3 */}
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-transform duration-200"
            style={{ background: '#FF6FA3', boxShadow: '0 6px 24px rgba(255,111,163,0.40)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><polygon points="8,5 19,12 8,19" /></svg>
          </div>
        </div>
        {/* 右上角时长胶囊 */}
        <div className="absolute top-3 right-3 z-[3] px-3 py-1 rounded-[20px] text-[12px] font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
          {video.duration}
        </div>
      </div>
      {/* 信息区 */}
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#111] leading-tight">{video.title}</h3>
          <span className="text-[13px] font-medium flex items-center gap-1 flex-shrink-0" style={{ color: '#FF6FA3' }}>
            🔥 {hotCount}
          </span>
        </div>
        <p className="text-[13px]" style={{ color: '#999' }}>
          {video.level} · {video.duration}
        </p>
      </div>
    </motion.div>
  );
}

/* ========== 主组件 ========== */
export default function Equipment() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = useMemo(() => {
    let list = activeCategory === 'all' ? allVideos : allVideos.filter((v) => v.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (v) => v.title.toLowerCase().includes(q) || v.subcategory.toLowerCase().includes(q) || v.level.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const nav = useNavigate();

  return (
    <div className="min-h-screen relative">

      {/* ================================================================
          第1层 · 最底层：全局粉色渐变底色（全程保留，永不完全消失）
          ================================================================ */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #FFF5F8 0%, #FFF0F5 40%, #FFEFF4 70%, #fff 100%)' }} />

      {/* ================================================================
          导航栏（永远在最顶层，绝不被遮挡）
          ================================================================ */}
      <nav className="sticky top-0 z-[50]"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${PINK}, #FF9ABB)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(245,104,152,0.28)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>FitHer</span>
              <span style={{ fontSize: 12, color: '#F56898' }}>为更好的自己</span>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            <Link to="/" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>首页</Link>
            <Link to="/plan" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>训练计划</Link>
            <span style={{ fontSize: 16, fontWeight: 600, color: PINK, position: 'relative', cursor: 'default' }}>
              器材教学<span style={{ position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)', width: 36, height: 3, borderRadius: 999, background: PINK, display: 'block' }} /></span>
            <Link to="/diet" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>饮食建议</Link>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#999', cursor: 'default' }}>关于我们</span>
          </div>
          <div style={{ width: 160, flexShrink: 0 }} />
        </div>
      </nav>

      {/* ================================================================
          Hero 区域 — 独立区域，520px 固定高度
          左侧文字 + 右侧人物背景图（限制在 Hero 内部，不溢出）
          ================================================================ */}
      <section className="relative z-[1] overflow-hidden" style={{ height: 482, background: 'linear-gradient(180deg, #FFF8FA 0%, #FFF3F6 100%)' }}>

        {/* 人物背后柔粉圈圈光晕 */}
        <div className="absolute pointer-events-none"
          style={{
            bottom: '8%',
            right: '5%',
            width: 'clamp(460px, 44vw, 660px)',
            height: 'clamp(460px, 44vw, 660px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,120,155,0.16) 0%, rgba(245,140,170,0.08) 35%, rgba(245,160,185,0.02) 60%, transparent 75%)',
          }} />

        {/* 人物器材背景图 — absolute right bottom，限制在 Hero 内 */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          src="./健身器材教学首页顶部替换.png"
          alt=""
          className="absolute pointer-events-none"
          style={{
            right: 0,
            bottom: 0,
            width: 'clamp(420px, 40%, 650px)',
            height: '105%',
            objectFit: 'cover',
            objectPosition: '90% bottom',
            opacity: 0.88,
          }}
        />

        {/* 图片底部白色渐隐 — 让图片在 Hero 底部自然消失 */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 100,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,243,246,0.7) 50%, #FFF3F6 100%)',
          }} />

        {/* 文字 + 搜索框 — 水平居中 */}
        <div className="relative z-[3]" style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px', height: '100%' }}>
          <div className="flex flex-col items-center justify-center text-center" style={{ height: '100%', paddingTop: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* 两行标题 — 横向并排 */}
              <div className="flex items-baseline gap-3 mb-3 flex-wrap justify-center">
                <h1 className="text-[clamp(28px,4vw,44px)] font-bold leading-[1.2]"
                  style={{ color: '#111', letterSpacing: '-1px' }}>
                  掌握每个器材
                </h1>
                <span className="text-[clamp(30px,4.5vw,48px)] font-bold leading-[1.2]"
                  style={{ color: PINK, letterSpacing: '-1px' }}>
                  开始正确训练
                </span>
              </div>

              {/* 小字 */}
              <p className="text-[clamp(14px,1.6vw,17px)] leading-relaxed"
                style={{ color: '#999', maxWidth: 420 }}>
                新手自信指南，详细视频讲解，<br />轻松上手每一个器材
              </p>

              {/* 搜索框 — flex 布局，图标与输入区永不重叠 */}
              <div className="flex items-stretch" style={{ width: 480, maxWidth: '92vw', marginTop: 80, height: 56, borderRadius: 28, background: '#fff', border: '1px solid #f2f2f2', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {/* 左侧放大镜图标区 */}
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 60, background: '#fef7fa' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F56898" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                {/* 分隔空隙 */}
                <div className="flex-shrink-0" style={{ width: 16 }} />
                {/* 输入区 */}
                <input type="text" placeholder="搜索器材、训练动作或课程"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory('all'); }}
                  className="flex-1 h-full pr-6 text-[15px] outline-none bg-transparent"
                  style={{ color: '#333', minWidth: 0 }}
                  onFocus={(e) => { e.target.parentElement.style.borderColor = '#ff6ba8'; e.target.parentElement.style.boxShadow = '0 0 0 4px rgba(255,100,160,0.10)'; }}
                  onBlur={(e) => { e.target.parentElement.style.borderColor = '#f2f2f2'; e.target.parentElement.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)'; }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          分类导航 — 紧凑单行，nowrap，居中
          ================================================================ */}
      <section className="relative z-[3]" style={{ marginTop: 0 }}>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px' }}
          className="flex items-center gap-3 flex-nowrap justify-start" >
        {mainCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <motion.button key={cat.id}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className="flex items-center gap-2 h-[48px] rounded-[24px] text-[14px] font-semibold transition-all duration-200 flex-shrink-0"
              style={{
                padding: '0 28px',
                background: isActive ? '#FF6FA3' : '#FFFFFF',
                color: isActive ? '#fff' : '#666',
                border: isActive ? 'none' : '1px solid rgba(255,150,180,0.12)',
                boxShadow: isActive ? '0 4px 14px rgba(255,111,163,0.22)' : '0 2px 6px rgba(255,120,160,0.04)',
              }}
            >
              <span style={{ fontSize: 17 }}>{cat.icon}</span>
              <span>{cat.name}</span>
            </motion.button>
          );
        })}
        </div>
      </section>

      {/* ================================================================
          课程列表区域 — 统一版心容器
          ================================================================ */}
      <div className="relative z-[3]" style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px' }}>

        {/* 视频卡片网格 */}
        <section className="relative z-[3]" style={{ marginTop: 24 }}>
          <p className="text-[14px] mb-6" style={{ color: '#999' }}>
            {searchQuery
              ? `搜索 "${searchQuery}" — 找到 ${filteredVideos.length} 个课程`
              : activeCategory === 'all'
                ? `全部课程 · ${filteredVideos.length} 个教学`
                : `${mainCategories.find((c) => c.id === activeCategory)?.name || ''} · ${filteredVideos.length} 个教学`}
          </p>

          {filteredVideos.length > 0 ? (
            <motion.div layout
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 1200 }}
              className="max-md:grid-cols-[repeat(2,minmax(0,1fr))] max-sm:grid-cols-[1fr]">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video, i) => (
                  <motion.div key={video.id} layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}>
                    <VideoCard video={video} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-[56px] mb-4">🔍</span>
              <p className="text-[18px] text-[#999] mb-2">未找到相关课程</p>
              <p className="text-[14px] text-[#ccc]">试试其他关键词或分类</p>
            </div>
          )}
        </section>

        {/* 底部留白 */}
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
