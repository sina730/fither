import { useState, useEffect, useMemo } from 'react';
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
    if (!profile) { navigate('/onboarding'); return; }
    const generated = generatePlan(profile);
    setPlan(generated);
  }, [navigate]);

  const logout = () => { doLogout(); navigate('/'); };

  // 按类型分组练习
  const grouped = useMemo(() => {
    if (!plan) return { warmup: [], main: [], cooldown: [] };
    const today = plan.schedule[selectedDay];
    const groups = { warmup: [], main: [], cooldown: [] };
    let globalIdx = 0;
    for (const ex of today.exercises) {
      const item = { ...ex, globalIdx: ++globalIdx };
      if (ex.type === '热身') groups.warmup.push(item);
      else if (ex.type === '拉伸') groups.cooldown.push(item);
      else groups.main.push(item);
    }
    return groups;
  }, [plan, selectedDay]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-gray-400 text-lg">正在生成你的专属训练计划...</div>
      </div>
    );
  }

  const today = plan.schedule[selectedDay];

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
            <Link to="/equipment" className="text-gray-500 hover:text-[#f06a9a] transition-colors">器材教学</Link>
            <Link to="/diet" className="text-gray-500 hover:text-[#f06a9a] transition-colors">饮食建议</Link>
            <Link to="/onboarding" className="text-[#f06a9a] font-medium hover:text-[#e55987] transition-colors border border-[#f06a9a] px-4 py-1.5 rounded-[999px]">重新制定计划</Link>
            <button onClick={logout} className="text-gray-400 hover:text-gray-600 transition-colors">退出</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 概览 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#fde8ef] to-[#fef1f7] rounded-3xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#111] mb-3">你的专属训练计划</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="bg-white/80 px-3 py-1.5 rounded-full">{plan.profile.goal}</span>
            <span className="bg-white/80 px-3 py-1.5 rounded-full">{plan.scene === 'gym' ? '🏋️ 健身房' : '🏠 居家'}</span>
            <span className="bg-white/80 px-3 py-1.5 rounded-full">每天 {plan.profile.dailyMinutes} 分钟</span>
            <span className="bg-white/80 px-3 py-1.5 rounded-full">{plan.totalDays} 天计划</span>
            {plan.profile.bodyParts?.length > 0 && (
              <span className="bg-white/80 px-3 py-1.5 rounded-full">重点：{plan.profile.bodyParts.join('、')}</span>
            )}
            {plan.profile.periodDate && (
              <span className="bg-[#ffeaea] px-3 py-1.5 rounded-full text-[#c0392b]">🩸 经期日已标记</span>
            )}
          </div>
          {plan.weightLossEstimate && (
            <p className="text-[13px] text-[#c02660] mt-3 font-medium">{plan.weightLossEstimate}</p>
          )}
        </motion.div>

        {/* 日期选择 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {plan.schedule.map((day, i) => (
            <button key={i} onClick={() => setSelectedDay(i)}
              className={`shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                selectedDay === i
                  ? 'bg-[#f06a9a] text-white shadow-lg shadow-[#f06a9a]/25'
                  : day.isPeriodDay
                    ? 'bg-[#ffeaea] text-[#c0392b] border border-[#f5c6cb] hover:bg-[#ffd6d6]'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}>
              <span className="text-[10px] opacity-70">{day.isPeriodDay ? '🩸' : day.type}</span>
              <span className="text-lg font-bold">{day.day}</span>
            </button>
          ))}
        </div>

        {/* 当日训练 */}
        <motion.div key={selectedDay} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#111]">
              第 {today.day} 天
              {today.isPeriodDay
                ? <span className="text-[#c0392b] ml-2">🩸 经期 · 轻量拉伸</span>
                : <span className="text-gray-400 ml-2">· {today.type}</span>
              }
            </h3>
            <span className="text-sm text-gray-400">约 {today.estimatedMinutes} 分钟</span>
          </div>

          {today.note && (
            <div className="mb-6 p-4 rounded-xl bg-[#ffeaea] text-sm text-[#c0392b] flex items-center gap-2 border border-[#f5c6cb]">
              <span>🩸</span> {today.note}
            </div>
          )}

          {/* ====== 热身 ====== */}
          {grouped.warmup.length > 0 && (
            <div className="mb-5 flex items-center justify-between p-4 rounded-xl bg-[#fff5f8] border border-[#fde8ef]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <div>
                  <div className="font-semibold text-[14px] text-[#111]">训练前热身</div>
                  <div className="text-[12px] text-gray-400">约 3 分钟 · 激活全身肌群，预防运动损伤</div>
                </div>
              </div>
              <a href="https://player.bilibili.com/player.html?bvid=BV1Ft4y1Q7Xa" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] font-medium text-[#f06a9a] hover:text-[#e55987] transition-colors bg-white px-4 py-2 rounded-[999px] border border-[#fde8ef] flex-shrink-0">
                <span>▶</span> 观看热身视频
              </a>
            </div>
          )}

          {/* ====== 正式训练 ====== */}
          {grouped.main.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#111] mb-3">
                <span>💪</span> 正式训练
              </div>
              <div className="space-y-2">
                {grouped.main.map((ex) => (
                  <ExerciseRow key={ex.globalIdx} ex={ex} />
                ))}
              </div>
            </div>
          )}

          {/* ====== 拉伸 ====== */}
          {grouped.cooldown.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f8f4ff] border border-[#ece3f8]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🧘</span>
                <div>
                  <div className="font-semibold text-[14px] text-[#111]">训练后拉伸</div>
                  <div className="text-[12px] text-gray-400">约 {Math.round(grouped.cooldown.reduce((a, e) => a + (e.timePerSet || e.sec || 30) * (e.sets || 1), 0) / 60)} 分钟 · 匹配当日训练部位，缓解肌肉酸痛</div>
                </div>
              </div>
              <a href="https://player.bilibili.com/player.html?bvid=BV1ei4y1y7pz" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] font-medium text-[#8e6fc4] hover:text-[#7b5ea7] transition-colors bg-white px-4 py-2 rounded-[999px] border border-[#ece3f8] flex-shrink-0">
                <span>▶</span> 跟练拉伸视频
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ExerciseRow({ ex }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-[#f06a9a] flex-shrink-0">
          {ex.globalIdx}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[#111] text-[14px] flex items-center gap-2">
            {ex.name}
            {ex.equipment && (
              <Link to={`/equipment`} className="text-[11px] font-normal text-[#f06a9a] hover:underline flex-shrink-0">
                📹 {ex.equipment}
              </Link>
            )}
          </div>
          {ex.note && <div className="text-[11px] text-gray-400 truncate">{ex.note}</div>}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className="text-[13px] font-medium text-[#111]">{ex.sets} 组 × {ex.reps}</div>
        <div className="text-[11px] text-gray-400">{ex.rest !== '—' ? `休息 ${ex.rest}` : ''}</div>
      </div>
    </div>
  );
}
