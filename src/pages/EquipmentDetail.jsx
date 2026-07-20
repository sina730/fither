import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allVideos } from '../data/equipmentData';

/* ========== Design Tokens ========== */
const PINK = '#F56898';
const shadow = '0 8px 28px rgba(0,0,0,0.05)';

export default function EquipmentDetail() {
  const { videoId } = useParams();
  const nav = useNavigate();

  /* 查找视频数据 */
  const video = allVideos.find((v) => v.id === videoId);

  /* 未找到 */
  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <span className="text-[56px] block mb-4">🔍</span>
          <p className="text-[18px] text-[#999] mb-2">课程未找到</p>
          <Link to="/equipment" className="text-[15px] font-medium" style={{ color: PINK }}>← 返回动作指导</Link>
        </div>
      </div>
    );
  }

  /* 返回链接：优先返回分类页，否则返回动作指导首页 */
  const backUrl = video.category ? `/equipment/${video.category}` : '/equipment';
  const backLabel = '返回';

  /* 相关推荐：同 category 的其他视频（最多 3 个） */
  const related = allVideos
    .filter((v) => v.category === video.category && v.id !== video.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen relative bg-white">
      {/* 淡粉渐变底 */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse 900px 600px at 50% 20%, rgba(245,105,140,0.04), transparent 70%)' }} />

      {/* ====== 导航栏 ====== */}
      <nav className="sticky top-0 z-30" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
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
            <Link to="/plan" style={{ fontSize: 18, fontWeight: 500, color: '#666', textDecoration: 'none' }}>训练计划</Link>
            <Link to="/equipment" style={{ fontSize: 18, fontWeight: 500, color: '#666', textDecoration: 'none' }}>动作指导</Link>
            <Link to="/diet" style={{ fontSize: 18, fontWeight: 500, color: '#666', textDecoration: 'none' }}>饮食建议</Link>
          </div>
          <div style={{ width: 160, flexShrink: 0 }} />
        </div>
      </nav>

      {/* ====== 内容区 ====== */}
      <div style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '32px 32px 0' }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* 面包屑 */}
          <div className="flex items-center gap-2 text-[13px] text-[#bbb] mb-5">
            <Link to="/equipment" className="hover:text-[#F56898] transition-colors">动作指导</Link>
            <span>/</span>
            {video.category && (
              <>
                <Link to={`/equipment/${video.category}`} className="hover:text-[#F56898] transition-colors">{video.subcategory ? '...' : ''}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#999]">{video.title}</span>
          </div>

          {/* 标签 */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-[999px] text-[12px] font-medium"
              style={{ background: '#fde8ef', color: PINK }}>
              {video.level}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-[999px] text-[12px] font-medium"
              style={{ background: '#f5f5f5', color: '#999' }}>
              {video.duration}
            </span>
            {video.subcategory && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-[999px] text-[12px] font-medium"
                style={{ background: '#f5f5f5', color: '#999' }}>
                {video.subcategory}
              </span>
            )}
          </div>

          <h1 className="text-[32px] font-bold text-[#111] mb-6" style={{ letterSpacing: '-0.5px' }}>
            {video.title}
          </h1>

          {/* 视频播放器 */}
          {video.bilibiliUrl ? (
            <div className="rounded-[20px] overflow-hidden bg-black mb-10 aspect-video shadow-lg">
              <iframe
                src={video.bilibiliUrl}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title={`${video.title} 教学视频`}
              />
            </div>
          ) : (
            <div className="rounded-[20px] overflow-hidden mb-10 aspect-video flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #fde8ef 0%, #fff 100%)', boxShadow: shadow }}>
              <div className="text-center">
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(245,104,152,0.12)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={PINK}>
                    <polygon points="8,5 19,12 8,19" />
                  </svg>
                </div>
                <p className="text-[15px] text-[#999]">视频即将上线</p>
                <p className="text-[13px] text-[#ccc] mt-1">敬请期待</p>
              </div>
            </div>
          )}

          {/* 相关推荐 */}
          {related.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[18px] font-bold text-[#111] mb-4">相关推荐</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((rv) => (
                  <motion.div
                    key={rv.id}
                    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
                    onClick={() => nav(`/equipment/video/${rv.id}`)}
                    className="cursor-pointer rounded-[18px] p-4 transition-all"
                    style={{ background: '#fff', boxShadow: shadow, border: '1px solid #f5f5f5' }}
                  >
                    <h4 className="text-[14px] font-semibold text-[#111] mb-1.5">{rv.title}</h4>
                    <div className="flex items-center gap-2 text-[12px] text-[#999]">
                      <span>{rv.level}</span>
                      <span className="w-1 h-1 rounded-full bg-[#ddd]" />
                      <span>{rv.duration}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 返回按钮 */}
          <div className="flex justify-center" style={{ marginTop: 38, paddingBottom: 32 }}>
            <button
              onClick={() => nav(-1)}
              className="inline-flex items-center gap-3 px-14 py-5 rounded-[999px] text-[24px] font-semibold transition-all hover:-translate-y-0.5"
              style={{ color: '#fff', background: `linear-gradient(135deg, ${PINK}, #FF9ABB)`, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245,104,152,0.25)' }}
            >
              ← 返回列表
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
