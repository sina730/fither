import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { equipmentList } from '../data/equipment';

export default function EquipmentDetail() {
  const { id } = useParams();
  const eq = equipmentList.find((e) => e.id === parseInt(id));

  if (!eq) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">器材未找到</p>
          <Link to="/equipment" className="text-[#f06a9a] font-medium">返回列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,105,140,0.06) 0%, transparent 70%)' }} />

      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f06a9a] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <span className="text-lg font-bold text-[#111]">FitHer</span>
          </Link>
          <Link to="/equipment" className="text-sm text-gray-500 hover:text-[#f06a9a]">← 返回器材列表</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#fde8ef] text-[#f06a9a] text-xs font-medium mb-4">
            {eq.category}
          </span>
          <h2 className="text-3xl font-bold text-[#111] mb-4">{eq.name}</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{eq.desc}</p>

          {/* 视频播放器 */}
          <div className="rounded-2xl overflow-hidden bg-black mb-8 aspect-video">
            <iframe
              src={eq.bilibiliUrl}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
              title={`${eq.name} 教学视频`}
            />
          </div>

          {/* 使用方法 */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h4 className="font-semibold text-[#111] mb-2">使用方法</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{eq.usage}</p>
          </div>

          {/* 小贴士 */}
          <div className="bg-[#fef1f7] rounded-2xl p-6">
            <h4 className="font-semibold text-[#c02660] mb-3">💡 小贴士</h4>
            <ul className="space-y-2">
              {eq.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#f06a9a] mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
