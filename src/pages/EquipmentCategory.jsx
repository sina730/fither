import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryDetailMap, getCoverStyle } from '../data/equipmentData';

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
    'free-weight': '💪', 'glutes-legs': '🍑', 'chest-back': '🎯', core: '🔥', cardio: '🔥',
  };
  const emoji = playIcons[video.category] || '▶';

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: shadowLg }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => nav(`/equipment/video/${video.id}`)}
      className="cursor-pointer rounded-[24px] overflow-hidden flex flex-col"
      style={{ background: '#fff', boxShadow: shadow, border: '1px solid #f2f2f2' }}
    >
      {/* 封面 16:9 */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {video.cover ? (
          <img src={video.cover} alt={video.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={coverStyle}>
            <span className="text-[40px] opacity-50 select-none">{emoji}</span>
          </div>
        )}
        {/* 播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center"
            style={{ background: 'rgba(245,104,152,0.88)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(245,104,152,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
          </div>
        </div>
        {/* 时长 */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-[8px] text-[11px] font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          {video.duration}
        </div>
      </div>
      {/* 信息区 */}
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold text-[#111] leading-tight">{video.title}</h3>
        <div className="flex items-center gap-2 text-[12px] text-[#999]">
          <span>{video.level}</span>
          <span className="w-1 h-1 rounded-full bg-[#ddd]" />
          <span>{video.duration}</span>
        </div>
        <Stars n={video.rating} />
      </div>
    </motion.div>
  );
}

/* ========== 主组件 ========== */
export default function EquipmentCategory() {
  const { categoryId } = useParams();
  const nav = useNavigate();
  const detail = categoryDetailMap[categoryId];

  /* 未找到 */
  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <span className="text-[56px] block mb-4">🔍</span>
          <p className="text-[18px] text-[#999] mb-2">分类未找到</p>
          <Link to="/equipment" className="text-[15px] font-medium" style={{ color: PINK }}>← 返回器材教学</Link>
        </div>
      </div>
    );
  }

  /* 统计 */
  let totalVideos = 0;
  detail.subcategories.forEach((s) => { totalVideos += s.videos.length; });

  return (
    <div className="min-h-screen relative bg-white">
      {/* 淡粉渐变底 */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 900px 600px at 50% 25%, rgba(245,105,140,0.04), transparent 70%)' }} />

      {/* ====== 导航栏 ====== */}
      <nav className="sticky top-0 z-30"
        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
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
            <Link to="/equipment" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>器材教学</Link>
            <Link to="/diet" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>饮食建议</Link>
          </div>
          <div style={{ width: 160, flexShrink: 0 }} />
        </div>
      </nav>

      {/* ====== 统一版心容器 ====== */}
      <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 32px' }}>

        {/* ====== 页面顶部信息 ====== */}
        <section className="relative z-10" style={{ paddingTop: 40, paddingBottom: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-[13px] text-[#bbb] mb-4">
              <Link to="/equipment" className="hover:text-[#F56898] transition-colors">器材教学</Link>
              <span>/</span>
              <span className="text-[#999]">{detail.title}</span>
            </div>

            <h1 className="text-[36px] font-bold text-[#111] mb-2" style={{ letterSpacing: '-1px' }}>
              {detail.title}
            </h1>
            <p className="text-[16px] text-[#999] mb-1">{detail.subtitle}</p>
            <p className="text-[14px] text-[#bbb]">共 {totalVideos} 个教学</p>

            {detail.description && (
              <p className="text-[14px] text-[#999] mt-4 leading-relaxed" style={{ maxWidth: 600 }}>{detail.description}</p>
            )}
          </motion.div>
        </section>

        {/* ====== 子分类 + 视频网格 ====== */}
        <section className="relative z-10" style={{ marginBottom: 80 }}>
          {detail.subcategories.map((sub, si) => (
            <motion.div key={sub.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: si * 0.08 }}
              style={{ marginTop: si === 0 ? 0 : 40 }}
            >
              {/* 子分类标题 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: PINK }} />
                <h2 className="text-[20px] font-bold text-[#111]">{sub.name}</h2>
                <span className="text-[13px] text-[#ccc]">({sub.videos.length})</span>
              </div>

              {/* 视频卡片网格：3列，gap 32px */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 32 }}
                className="max-md:grid-cols-[repeat(2,minmax(0,1fr))] max-sm:grid-cols-[1fr]">
                {sub.videos.map((video, vi) => (
                  <VideoCard key={video.id} video={video} index={vi} />
                ))}
              </div>
            </motion.div>
          ))}
        </section>

        {/* ====== 返回按钮 ====== */}
        <div className="flex justify-center" style={{ marginBottom: 64 }}>
          <button onClick={() => nav('/equipment')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[999px] text-[14px] font-medium transition-all hover:-translate-y-0.5"
            style={{ color: PINK, background: '#fde8ef', border: 'none', cursor: 'pointer' }}>
            ← 返回全部课程
          </button>
        </div>
      </div>
    </div>
  );
}
