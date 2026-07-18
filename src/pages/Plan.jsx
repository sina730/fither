import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { generatePlan } from '../data/rules';
import { storage } from '../utils/storage';
import { logout as doLogout } from '../utils/auth';

export default function Plan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const profile = storage.get('profile');
    if (!profile) {
      navigate('/onboarding');
      return;
    }
    const generated = generatePlan(profile);
    setPlan(generated);
  }, [navigate]);

  const logout = () => {
    doLogout();
    navigate('/');
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-lg">正在生成你的专属训练计划...</div>
      </div>
    );
  }

  const today = plan.schedule[selectedDay];

  return (
    <div className="min-h-screen bg-white relative">
      {/* 背景装饰 */}
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,105,140,0.06) 0%, transparent 70%)' }} />

      {/* 顶部导航 */}
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
            <Link to="/equipment" className="text-gray-500 hover:text-[#f06a9a] transition-colors">器材教学</Link>
            <Link to="/diet" className="text-gray-500 hover:text-[#f06a9a] transition-colors">饮食建议</Link>
            <button onClick={logout} className="text-gray-400 hover:text-gray-600 transition-colors">退出</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 计划概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#fde8ef] to-[#fef1f7] rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-[#111] mb-3">你的专属训练计划</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="bg-white/80 px-3 py-1.5 rounded-full">{plan.profile.goal}</span>
            <span className="bg-white/80 px-3 py-1.5 rounded-full">每天 {plan.profile.dailyMinutes} 分钟</span>
            <span className="bg-white/80 px-3 py-1.5 rounded-full">{plan.totalDays} 天计划</span>
            {plan.profile.bodyParts?.length > 0 && (
              <span className="bg-white/80 px-3 py-1.5 rounded-full">
                重点：{plan.profile.bodyParts.join('、')}
              </span>
            )}
          </div>
        </motion.div>

        {/* 日期选择 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {plan.schedule.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                selectedDay === i
                  ? 'bg-[#f06a9a] text-white shadow-lg shadow-[#f06a9a]/25'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-[10px] opacity-70">{day.type}</span>
              <span className="text-lg font-bold">{day.day}</span>
            </button>
          ))}
        </div>

        {/* 当日训练内容 */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#111]">
              第 {today.day} 天 · {today.type}
            </h3>
            <span className="text-sm text-gray-400">约 {today.estimatedMinutes} 分钟</span>
          </div>

          {today.note && (
            <div className="mb-6 p-4 rounded-xl bg-[#fef1f7] text-sm text-[#c02660] flex items-center gap-2">
              <span>🌸</span> {today.note}
            </div>
          )}

          <div className="space-y-4">
            {today.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#f06a9a]">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[#111]">{ex.name}</div>
                    <div className="text-xs text-gray-400">{ex.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#111]">
                    {ex.sets} 组 × {ex.reps}
                  </div>
                  <div className="text-xs text-gray-400">休息 {ex.rest}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
