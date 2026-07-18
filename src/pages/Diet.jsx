import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { foods, foodCategories } from '../data/foods';

export default function Diet() {
  const [activeCat, setActiveCat] = useState('全部');
  const categories = ['全部', ...foodCategories];

  const filtered = activeCat === '全部' ? foods : foods.filter((f) => f.category === activeCat);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,105,140,0.06) 0%, transparent 70%)' }} />

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
            <Link to="/equipment" className="text-gray-500 hover:text-[#f06a9a] transition-colors">器材教学</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-[#111] mb-2">饮食建议</h2>
          <p className="text-gray-400 mb-8">科学搭配，吃出好身材。以下为常见食物营养成分参考。</p>

          {/* 分类筛选 */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat
                    ? 'bg-[#f06a9a] text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 食物列表 */}
          <div className="grid gap-3">
            {/* 表头 */}
            <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <span className="col-span-2">食物</span>
              <span>份量</span>
              <span>热量</span>
              <span>蛋白质</span>
            </div>
            {filtered.map((food, i) => (
              <motion.div
                key={food.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-5 gap-4 items-center px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="col-span-2">
                  <div className="font-medium text-[#111] text-sm">{food.name}</div>
                  <div className="text-xs text-gray-400">{food.category}</div>
                </div>
                <span className="text-sm text-gray-500">{food.unit}</span>
                <span className="text-sm font-medium text-[#f06a9a]">{food.calories} kcal</span>
                <span className="text-sm text-gray-600">{food.protein}g</span>
              </motion.div>
            ))}
          </div>

          {/* 底部提示 */}
          <div className="mt-10 p-6 rounded-2xl bg-[#fef1f7] text-sm text-gray-600 leading-relaxed">
            <p className="font-semibold text-[#c02660] mb-2">🍽 饮食小建议</p>
            <ul className="space-y-1.5">
              <li>• 减脂期：控制总热量摄入，优先选择高蛋白食物（鸡胸肉、鱼虾、豆腐）</li>
              <li>• 增肌期：保证蛋白质摄入（每天 1.2-1.6g/kg 体重），配合碳水</li>
              <li>• 塑形期：均衡搭配，多样化食材，控制油脂和糖分</li>
              <li>• 多喝水！每天至少 1.5-2L</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
