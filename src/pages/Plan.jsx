import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { generatePlan } from '../data/rules';
import { storage } from '../utils/storage';
import { logout as doLogout } from '../utils/auth';

const PINK = '#F56898';
const shadow = '0 8px 28px rgba(0,0,0,0.05)';
const shadowLg = '0 12px 36px rgba(248,110,168,0.10)';
const cardR = 18;

/* ====== Day Card ====== */
function DayCard({ day, isSelected, onClick }) {
  return (
    <motion.button onClick={onClick} whileHover={{ y: -3 }} transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-[18px] border-0 cursor-pointer flex-shrink-0"
      style={{
        width: 76, minHeight: 72,
        background: isSelected ? `linear-gradient(135deg, #F86EA8, #FF9ABB)` : '#fff',
        color: isSelected ? '#fff' : '#888',
        boxShadow: isSelected ? '0 10px 25px rgba(248,110,168,0.25)' : shadow,
        border: isSelected ? 'none' : '1px solid #eee',
        transform: isSelected ? 'translateY(-2px)' : 'none',
      }}>
      <span className="text-[10px] font-semibold uppercase opacity-70">{day.type.length > 3 ? day.type.slice(0, 2) : day.type}</span>
      <span className="text-[18px] font-bold leading-none mt-[2px]">D{day.day}</span>
      {day.isPeriodDay && <span className="text-[11px] mt-[2px]">🩸</span>}
    </motion.button>
  );
}

/* ====== Exercise Row ====== */
function ExerciseRow({ ex, idx, checked, onToggle }) {
  const icons = { '有氧': '🏃', '力量': '💪', '核心': '🎯', '拉伸': '🧘', '热身': '🔥' };
  return (
    <motion.div whileHover={{ y: -3, boxShadow: shadowLg }} transition={{ duration: 0.3 }}
      className="flex items-center gap-4 rounded-[18px] p-5" style={{ background: '#fff', boxShadow: shadow, border: '1px solid #f5f5f5' }}>
      {/* Checkbox */}
      <button onClick={onToggle}
        className="w-[24px] h-[24px] rounded-[6px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{ borderColor: checked ? PINK : '#ddd', background: checked ? PINK : '#fff', cursor: 'pointer' }}>
        {checked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </button>
      {/* Number circle */}
      <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
        style={{ background: checked ? '#fde8ef' : '#f5f5f5', color: checked ? PINK : '#999' }}>
        {idx}
      </div>
      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="text-[16px] font-semibold text-[#111] flex items-center gap-2"
          style={{ textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.45 : 1 }}>
          {ex.name}
          {ex.equipment && !checked && <Link to="/equipment" className="text-[11px] font-normal text-[#F56898] hover:underline flex-shrink-0">📹 {ex.equipment}</Link>}
        </div>
        {ex.note && <div className="text-[13px] text-[#aaa] mt-0.5">{ex.note}</div>}
      </div>
      {/* Sets/reps right-aligned */}
      <div className="text-right flex-shrink-0">
        <div className="text-[15px] font-semibold text-[#111]">{ex.sets} 组 × {ex.reps}</div>
        {ex.rest !== '—' && <div className="text-[12px] text-[#bbb] mt-0.5">休息 {ex.rest}</div>}
      </div>
    </motion.div>
  );
}

/* ====== 主组件 ====== */
export default function Plan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [doneMap, setDoneMap] = useState({});
  const scrollRef = useRef(null);
  const [showLF, setShowLF] = useState(false);
  const [showRF, setShowRF] = useState(true);

  useEffect(() => {
    const profile = storage.get('profile');
    if (!profile) { navigate('/onboarding'); return; }
    setPlan(generatePlan(profile));
  }, [navigate]);

  const checkFade = () => {
    const el = scrollRef.current; if (!el) return;
    setShowLF(el.scrollLeft > 8);
    setShowRF(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const logout = () => { doLogout(); navigate('/'); };

  const { grouped, today, todayDone, todayTotal, todayPct } = useMemo(() => {
    if (!plan) return { grouped: { warmup: [], main: [], cooldown: [] }, today: null, todayDone: 0, todayTotal: 0, todayPct: 0 };
    const t = plan.schedule[selectedDay];
    const g = { warmup: [], main: [], cooldown: [] };
    let gi = 0;
    for (const ex of t.exercises) {
      const item = { ...ex, globalIdx: ++gi };
      if (ex.type === '热身') g.warmup.push(item);
      else if (ex.type === '拉伸') g.cooldown.push(item);
      else g.main.push(item);
    }
    const allEx = [...g.warmup, ...g.main, ...g.cooldown];
    const total = allEx.length;
    const done = allEx.filter((ex) => doneMap[`${selectedDay}-${ex.globalIdx}`]).length;
    return { grouped: g, today: t, todayDone: done, todayTotal: total, todayPct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [plan, selectedDay, doneMap]);

  const toggleDone = (exGlobalIdx) => {
    setDoneMap((prev) => ({ ...prev, [`${selectedDay}-${exGlobalIdx}`]: !prev[`${selectedDay}-${exGlobalIdx}`] }));
  };

  const wu = grouped.warmup[0];
  const wuMin = wu ? Math.round((wu.sec || 180) / 60) : 3;
  const wuLabel = wu?.reps || `${wuMin} 分钟`;
  const wuDesc = plan?.scene === 'gym' ? '含跑步机快走 · 激活全身肌群' : '激活全身肌群 · 预防运动损伤';
  const wuUrl = wu?.videoUrl || 'https://player.bilibili.com/player.html?bvid=BV1n1i7BGEjC';
  const cdMin = Math.round(grouped.cooldown.reduce((a, e) => a + (e.sec || e.timePerSet || 30) * (e.sets || 1), 0) / 60);

  if (!plan || !today) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-[#bbb] text-[18px]">正在生成你的专属训练计划...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'rgba(255,255,255,0.58)' }} />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse 900px 700px at 50% 35%, rgba(245,105,140,0.04), transparent 70%)' }} />

      {/* ====== Header ====== */}
      <nav className="sticky top-0 z-30" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
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
            <span style={{ fontSize: 16, fontWeight: 600, color: PINK, position: 'relative', cursor: 'default' }}>
              训练计划<span style={{ position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)', width: 36, height: 3, borderRadius: 999, background: PINK, display: 'block' }} /></span>
            <Link to="/equipment" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>器材教学</Link>
            <Link to="/diet" style={{ fontSize: 16, fontWeight: 500, color: '#666', textDecoration: 'none' }}>饮食建议</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            <Link to="/onboarding" style={{ fontSize: 15, fontWeight: 500, color: '#F56898', textDecoration: 'none' }}>重新制定计划</Link>
            <button onClick={logout} style={{ fontSize: 15, fontWeight: 500, color: '#bbb', border: 'none', background: 'transparent', cursor: 'pointer' }}>退出</button>
          </div>
        </div>
      </nav>

      {/* ====== 内容 ====== */}
      <div className="relative z-10" style={{ padding: '16px 40px 80px' }}>

        {/* ── 第一层：标题 ── */}
        <h1 className="text-[32px] font-bold text-[#111] mb-[24px]">专属训练计划</h1>

        {/* ── 第二层：标签 ── */}
        <div className="flex flex-wrap items-center gap-2.5 mb-[16px]">
          {[
            { icon: '🎯', label: plan.profile.goal, accent: true },
            { icon: plan.scene === 'gym' ? '🏋️' : '🏠', label: plan.scene === 'gym' ? '健身房' : '居家' },
            { icon: '⏱', label: `${plan.profile.dailyMinutes} 分钟/天` },
            { icon: '📅', label: `${plan.totalDays} 天计划` },
          ].map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[999px] text-[13px] font-medium"
              style={{ background: b.accent ? '#fde8ef' : 'rgba(255,255,255,0.85)', color: b.accent ? PINK : '#777', border: '1px solid #f0f0f0' }}>
              {b.icon} {b.label}
            </span>
          ))}
          {today.isPeriodDay && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[999px] text-[13px] font-medium" style={{ background: '#ffeaea', color: '#c0392b', border: '1px solid #fdd' }}>🩸 经期调整</span>
          )}
        </div>

        {/* ── 第三层：体重信息 ── */}
        {plan.weightLossEstimate && (
          <p className="text-[14px] mb-[28px]" style={{ color: '#c02660' }}>{plan.weightLossEstimate}</p>
        )}
        {!plan.weightLossEstimate && plan.profile.weight && <div className="mb-[28px]" />}

        {/* ── Day 导航 ── */}
        <div className="relative mb-[24px]">
          {showLF && <div className="absolute left-0 top-0 bottom-0 w-[50px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)' }} />}
          <div ref={scrollRef} onScroll={checkFade} className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {plan.schedule.map((day, i) => (
              <DayCard key={i} day={day} isSelected={selectedDay === i} onClick={() => setSelectedDay(i)} />
            ))}
          </div>
          {showRF && <div className="absolute right-0 top-0 bottom-0 w-[50px] z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)' }} />}
        </div>

        {/* ── 进度条 ── */}
        <div className="rounded-[16px] p-4 mb-[24px]" style={{ background: '#fff', boxShadow: shadow }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-semibold text-[#111]">完成 {todayDone} / {todayTotal} 动作</span>
            <span className="text-[24px] font-bold" style={{ color: PINK }}>{todayPct}%</span>
          </div>
          <div className="h-[10px] rounded-full bg-[#f3f0f2] overflow-hidden">
            <motion.div className="h-full rounded-full"
              animate={{ width: `${todayPct}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1.2] }}
              style={{ background: `linear-gradient(90deg, #F86EA8, #FF9ABB)`, boxShadow: '0 0 10px rgba(248,110,168,0.30)' }}>
              <div className="h-full rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%)' }} />
            </motion.div>
          </div>
          <div className="mt-2.5 text-[13px] text-[#bbb]">
            {todayDone === 0 ? '开始完成今天的训练吧 ✨' : todayDone === todayTotal ? '🎉 今日训练全部完成！' : `还剩 ${todayTotal - todayDone} 个动作`}
          </div>
        </div>

        {/* ── 训练列表 ── */}
        <div className="flex flex-col" style={{ gap: 14 }}>
          {/* 日期标题 */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[22px] font-bold text-[#111]">
              第 {today.day} 天
              {today.isPeriodDay ? <span className="text-[#c0392b] ml-2 text-[15px]">🩸 经期</span> : <span className="text-[#999] ml-2 text-[15px] font-normal">· {today.type}</span>}
            </h2>
            <span className="text-[14px] text-[#bbb]">约 {today.estimatedMinutes} 分钟</span>
          </div>
          {today.note && (
            <div className="rounded-[14px] p-3.5 text-[13px] flex items-center gap-2" style={{ color: '#c0392b', background: '#fff5f5', border: '1px solid #fdd' }}>🩸 {today.note}</div>
          )}

          {/* 热身 ── 淡粉底 + 安娜B站封面 */}
          {wu && (
            <motion.div whileHover={{ y: -3, boxShadow: shadowLg }} transition={{ duration: 0.3 }}
              className="rounded-[18px] p-5 flex items-center justify-between gap-4" style={{ background: '#FFF6F8', boxShadow: shadow }}>
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => toggleDone(wu.globalIdx)}
                  className="w-[24px] h-[24px] rounded-[6px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{ borderColor: doneMap[`${selectedDay}-${wu.globalIdx}`] ? PINK : '#ddd', background: doneMap[`${selectedDay}-${wu.globalIdx}`] ? PINK : '#fff', cursor: 'pointer' }}>
                  {doneMap[`${selectedDay}-${wu.globalIdx}`] && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <span className="text-[22px]">🔥</span>
                <div>
                  <div className="text-[16px] font-semibold text-[#111]" style={{ textDecoration: doneMap[`${selectedDay}-${wu.globalIdx}`] ? 'line-through' : 'none', opacity: doneMap[`${selectedDay}-${wu.globalIdx}`] ? 0.45 : 1 }}>训练前热身</div>
                  <div className="text-[13px] text-[#999] mt-0.5">约 {wuLabel} · {wuDesc}</div>
                </div>
              </div>
              <a href={wuUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] font-medium text-white rounded-[999px] px-5 py-2.5 transition-all hover:shadow-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${PINK}, #FF9ABB)`, boxShadow: `0 4px 12px rgba(245,104,152,0.18)` }}>▶ 开始热身</a>
            </motion.div>
          )}

          {/* 正式训练 */}
          {grouped.main.map((ex) => (
            <ExerciseRow key={ex.globalIdx} ex={ex} idx={ex.globalIdx}
              checked={!!doneMap[`${selectedDay}-${ex.globalIdx}`]}
              onToggle={() => toggleDone(ex.globalIdx)} />
          ))}

          {/* 拉伸 ── 淡紫底 + 安娜B站封面 */}
          {grouped.cooldown.length > 0 && (() => {
            const cd = grouped.cooldown[0];
            return (
              <motion.div whileHover={{ y: -3, boxShadow: shadowLg }} transition={{ duration: 0.3 }}
                className="rounded-[18px] p-5 flex items-center justify-between gap-4" style={{ background: '#FFF8FD', boxShadow: shadow }}>
                <div className="flex items-center gap-4 min-w-0">
                  <button onClick={() => toggleDone(cd.globalIdx)}
                    className="w-[24px] h-[24px] rounded-[6px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{ borderColor: doneMap[`${selectedDay}-${cd.globalIdx}`] ? PINK : '#ddd', background: doneMap[`${selectedDay}-${cd.globalIdx}`] ? PINK : '#fff', cursor: 'pointer' }}>
                    {doneMap[`${selectedDay}-${cd.globalIdx}`] && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                  <span className="text-[22px]">🧘</span>
                  <div>
                    <div className="text-[16px] font-semibold text-[#111]" style={{ textDecoration: doneMap[`${selectedDay}-${cd.globalIdx}`] ? 'line-through' : 'none', opacity: doneMap[`${selectedDay}-${cd.globalIdx}`] ? 0.45 : 1 }}>训练后拉伸</div>
                    <div className="text-[13px] text-[#999] mt-0.5">约 {cdMin} 分钟 · 缓解肌肉酸痛</div>
                  </div>
                </div>
                <a href="https://player.bilibili.com/player.html?bvid=BV1ev421y7PD" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] font-medium rounded-[999px] px-5 py-2.5 transition-all hover:shadow-lg flex-shrink-0"
                  style={{ color: '#8e6fc4', border: '1px solid #e8dff5', background: '#faf7ff' }}>▶ 拉伸课程</a>
              </motion.div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
