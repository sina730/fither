import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { equipmentList, categories } from '../data/equipment';

export default function Equipment() {
  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >

      {/* 导航 */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f06a9a] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#111]">FitHer</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/plan" className="text-gray-500 hover:text-[#f06a9a] transition-colors">训练计划</Link>
            <Link to="/diet" className="text-gray-500 hover:text-[#f06a9a] transition-colors">饮食建议</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-[#111] mb-2">器材教学</h2>
          <p className="text-gray-400 mb-8">详细视频讲解，轻松上手每一个器材</p>

          {categories.map((cat) => (
            <div key={cat} className="mb-10">
              <h3 className="text-lg font-semibold text-[#111] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f06a9a]" />
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipmentList
                  .filter((e) => e.category === cat)
                  .map((eq) => (
                    <Link key={eq.id} to={`/equipment/${eq.id}`}>
                      <motion.div
                        whileHover={{ translateY: -3 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-[#fde8ef] transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#fde8ef] flex items-center justify-center mb-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f06a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="12" r="4" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-[#111] mb-1">{eq.name}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{eq.desc}</p>
                      </motion.div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
