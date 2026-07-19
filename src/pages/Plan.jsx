import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { generatePlan } from '../data/rules';
import { storage } from '../utils/storage';
import { logout as doLogout, isLoggedIn } from '../utils/auth';

/* ============================================
   Tokens
   ============================================ */
const C = {
  pink: '#f06a9a', pinkBg: '#fff4f8', pinkLight: '#fde8ef', pinkBorder: 'rgba(240,106,154,0.10)',
  title: '#29262c', body: '#686269', sub: '#9d969f', muted: '#aaa4ab',
  cardBg: 'rgba(255,255,255,0.82)', cardBorder: 'rgba(45,30,36,0.045)',
  shadow: '0 12px 32px rgba(50,25,35,0.045)', shadowSm: '0 8px 22px rgba(45,24,34,0.035)',
};

/* ============================================
   Helpers
   ============================================ */
function calcCal(min) { return Math.round(min * 6.5); }
function getMetrics(ex) {
  const m = [];
  if (ex.sets > 1) m.push({ val: ex.sets, label: '组数' });
  if (ex.reps && ex.reps !== '—') m.push({ val: ex.reps, label: ex.type === '有氧' || ex.type === '热身' || ex.type === '拉伸' ? '时间' : '次数' });
  if (ex.rest && ex.rest !== '—') m.push({ val: ex.rest, label: '休息' });
  return m;
}
function getDur(ex) { const t = ex.sec * (ex.sets || 1); return t >= 60 ? `${Math.round(t / 60)} 分钟` : `${t} 秒`; }
function getNote(ex) {
  if (ex.note) return ex.note;
  const map = { '热身': '热身激活 · 提高心率', '拉伸': '放松肌肉 · 缓解肌肉酸痛', '有氧': '有氧燃脂 · 提升心肺', '力量': '力量训练 · 增强肌力', '核心': '核心训练 · 稳定躯干' };
  return map[ex.type] || '';
}

const goalIcons = { '减脂': '🔥', '增肌': '💪', '塑形': '✨', '保持健康': '🌱' };
const goalLabelMap = { '减脂': '减脂', '增肌': '增肌', '塑形': '塑形', '保持健康': '保持健康' };

/* ============================================
   Sub-Components
   ============================================ */

function DayCard({ day, isSelected, onClick }) {
  const done = day._done;
  const typeIcons = { '力量日': '💪', '有氧日': '🏃', '综合日': '⭐', '塑形日': '✨', '经期拉伸': '🩸', '经期恢复': '🌸' };
  const icon = day.isPeriodDay ? '🩸' : (typeIcons[day.type] || '💪');
  return (
    <motion.button onClick={onClick} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }} className="flex-shrink-0 relative cursor-pointer border-0 flex flex-col items-center justify-center gap-[6px]"
      style={{
        width: 90, height: 90, borderRadius: 18,
        background: isSelected ? 'linear-gradient(145deg, #fff0f5, #ffe4ed)' : C.cardBg,
        backdropFilter: 'blur(12px)', border: isSelected ? '1.5px solid #f276a2' : `1px solid ${C.cardBorder}`,
        boxShadow: isSelected ? '0 8px 20px rgba(240,106,154,0.14)' : C.shadowSm,
      }}>
      {done && <span className="absolute top-[10px] right-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px]" style={{ background: '#4ade80', color: '#fff' }}>✓</span>}
      <span className="text-[13px] font-semibold" style={{ color: isSelected ? C.pink : '#888' }}>Day {String(day.day).padStart(2, '0')}</span>
      <span className="text-[20px]">{icon}</span>
      <span className="text-[11px] font-medium" style={{ color: isSelected ? '#d46082' : C.sub }}>{day.isPeriodDay ? '经期日' : day.type}</span>
      {isSelected && <div className="w-[38px] h-[3px] rounded-[2px]" style={{ background: C.pink }} />}
    </motion.button>
  );
}

function InfoCard({ icon, iconBg, label, value }) {
  return (
    <div className="rounded-[17px] flex items-center gap-3" style={{ minHeight: 74, padding: '14px 16px', background: C.cardBg, border: `1px solid ${C.pinkBorder}`, boxShadow: C.shadowSm, backdropFilter: 'blur(12px)' }}>
      <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: iconBg }}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium m-0 leading-tight" style={{ color: C.sub }}>{label}</p>
        <p className="text-[16px] font-semibold m-0 leading-tight mt-0.5" style={{ color: '#353138' }}>{value}</p>
      </div>
    </div>
  );
}

function ExerciseRow({ ex, idx, checked, onToggle, onStart }) {
  const metrics = getMetrics(ex);
  const dur = getDur(ex);
  return (
    <motion.div whileHover={{ background: '#fffafd' }} transition={{ duration: 0.2 }}
      className="flex items-center gap-4" style={{ height: 86, padding: '0 22px', borderBottom: '1px solid rgba(0,0,0,0.035)', opacity: checked ? 0.55 : 1 }}>
      {/* Seq */}
      <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0" style={{ background: '#fde8ef', color: '#ee6a98' }}>{idx}</div>
      {/* Thumb */}
      <div className="flex-shrink-0 rounded-[9px] flex items-center justify-center text-[22px]" style={{ width: 102, height: 62, background: 'linear-gradient(135deg, #fde8ef, #fff4f8)' }}>🏋️</div>
      {/* Name + note */}
      <div className="min-w-0" style={{ width: '28%' }}>
        <p className="text-[15px] font-semibold m-0 leading-tight truncate" style={{ color: '#353138', textDecoration: checked ? 'line-through' : 'none' }}>{ex.name}</p>
        <p className="text-[11.5px] m-0 mt-0.5" style={{ color: '#99939b' }}>{getNote(ex)}</p>
      </div>
      {/* Params */}
      <div className="flex gap-4 flex-1 justify-center">
        <ParamBox val={dur} label="时长" />
        {metrics.map((m, i) => <ParamBox key={i} val={m.val} label={m.label} />)}
      </div>
      {/* Btn */}
      <motion.button onClick={(e) => { e.stopPropagation(); onStart(ex); }}
        whileHover={{ background: '#fde8ef' }} whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-1.5 text-[12px] font-semibold rounded-[18px] border-0 cursor-pointer flex-shrink-0 transition-colors"
        style={{ width: 112, height: 36, color: '#ee6695', background: '#fff7fa', border: '1px solid #f7bfd1' }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#ee6695"><polygon points="8,5 19,12 8,19" /></svg>观看教学
      </motion.button>
      {/* Check */}
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
        style={{ borderColor: checked ? C.pink : '#ddd', background: checked ? C.pink : 'transparent', cursor: 'pointer' }}>
        {checked && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></motion.svg>}
      </button>
    </motion.div>
  );
}

function ParamBox({ val, label }) {
  return (
    <div className="text-center flex-shrink-0" style={{ minWidth: 70 }}>
      <p className="text-[13px] font-semibold m-0 leading-tight" style={{ color: '#4b464d' }}>{val}</p>
      <p className="text-[10.5px] m-0 mt-[3px] leading-tight" style={{ color: C.muted }}>{label}</p>
    </div>
  );
}

function DashCard({ icon, iconBg, title, value, unit, children }) {
  return (
    <div className="rounded-[17px] flex flex-col" style={{ minHeight: 116, padding: 20, background: 'rgba(255,255,255,0.92)', border: `1px solid ${C.cardBorder}` }}>
      <div className="flex items-center gap-3">
        <div className="w-[44px] h-[44px] rounded-[13px] flex items-center justify-center text-[20px] flex-shrink-0" style={{ background: iconBg }}>{icon}</div>
        <span className="text-[14px] font-medium" style={{ color: C.sub }}>{title}</span>
      </div>
      <div className="flex-1 flex items-end mt-3">
        {children || <p className="text-[28px] font-semibold m-0 leading-none" style={{ color: '#302d33' }}>{value}{unit && <span className="text-[12px] font-normal ml-1" style={{ color: C.sub }}>{unit}</span>}</p>}
      </div>
    </div>
  );
}

/* ============================================
   Main
   ============================================ */
export default function Plan() {
  const nav = useNavigate();
  const [plan, setPlan] = useState(null);
  const [sel, setSel] = useState(0);
  const [doneMap, setDoneMap] = useState({});
  const dayRef = useRef(null);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const p = storage.get('profile');
    if (!p) { nav('/onboarding'); return; }
    const generated = generatePlan(p);
    setPlan(generated);
    const saved = storage.get('planDoneMap'); if (saved) setDoneMap(saved);
  }, [nav]);

  useEffect(() => {
    if (Object.keys(doneMap).length > 0) storage.set('planDoneMap', doneMap);
  }, [doneMap]);

  const logout = () => { doLogout(); nav('/'); };

  const dayStatuses = useMemo(() => {
    if (!plan) return [];
    return plan.schedule.map((day, di) => {
      const total = day.exercises.length;
      const done = day.exercises.filter((_, ei) => doneMap[`${di}-${ei + 1}`]).length;
      return { _done: total > 0 && done === total };
    });
  }, [plan, doneMap]);

  const { today, todayDone, todayTotal, todayPct } = useMemo(() => {
    if (!plan) return { today: null, todayDone: 0, todayTotal: 0, todayPct: 0 };
    const t = plan.schedule[sel];
    if (!t) return { today: null, todayDone: 0, todayTotal: 0, todayPct: 0 };
    const done = t.exercises.filter((_, ei) => doneMap[`${sel}-${ei + 1}`]).length;
    return { today: t, todayDone: done, todayTotal: t.exercises.length, todayPct: t.exercises.length > 0 ? Math.round((done / t.exercises.length) * 100) : 0 };
  }, [plan, sel, doneMap]);

  const toggle = useCallback((gi) => setDoneMap((p) => ({ ...p, [`${sel}-${gi}`]: !p[`${sel}-${gi}`] })), [sel]);
  const start = useCallback((ex) => {
    if (ex.videoId) nav(`/equipment/video/${ex.videoId}`);
    else if (ex.videoUrl) window.open(ex.videoUrl, '_blank');
    else if (ex.equipment) nav('/equipment');
    else window.open('https://player.bilibili.com/player.html?bvid=BV1jM4y177oN', '_blank');
  }, [nav]);

  if (!plan || !today) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fffdfd 0%, #fff7fa 55%, #fff1f6 100%)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} className="w-[40px] h-[40px] rounded-full border-[3px]" style={{ borderColor: C.pinkLight, borderTopColor: C.pink }} />
    </div>;
  }

  const cal = calcCal(today.estimatedMinutes);
  const goal = plan?.profile?.goal || '保持健康';
  const gym = plan?.scene === 'gym';
  const wk = Math.floor(sel / 7) + 1;
  const goalIcon = goalIcons[goal] || '🎯';
  const scheduleWithStatus = plan.schedule.map((d, i) => ({ ...d, ...(dayStatuses[i] || {}) }));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffdfd 0%, #fff7fa 55%, #fff1f6 100%)' }}>
      {/* Glow */}
      <div className="absolute pointer-events-none z-0" style={{ top: '-5%', right: '-3%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,104,152,0.10) 0%, transparent 70%)' }} />

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-30" style={{ height: 72, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between h-full" style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px' }}>
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f06a9a, #FF9ABB)', boxShadow: '0 4px 14px rgba(240,106,154,0.22)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <div className="flex flex-col leading-none gap-0.5"><span className="text-[24px] font-bold" style={{ color: '#222' }}>FitHer</span><span className="text-[10px]" style={{ color: C.pink }}>为更好的自己</span></div>
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>首页</Link>
            <span className="text-[14px] font-semibold relative cursor-default" style={{ color: C.pink }}>
              训练计划<span className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 w-[42px] h-[2px] rounded-[2px] block" style={{ background: C.pink }} />
            </span>
            <Link to="/equipment" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>器材教学</Link>
            <Link to="/diet" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>饮食建议</Link>
            <Link to="/" className="text-[14px] font-medium no-underline" style={{ color: '#565158' }}>关于我们</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-[22px] bg-white border" style={{ width: 230, height: 42, borderColor: '#e8e8e8' }}>
              <input placeholder="搜索课程、器材…" className="flex-1 bg-transparent border-none outline-none text-[13px] px-4" style={{ color: '#999' }} />
              <span className="pr-3 text-[14px]" style={{ color: '#bbb' }}>🔍</span>
            </div>
            {loggedIn ? (
              <button onClick={logout} className="text-[13px] font-medium border rounded-[22px] bg-white cursor-pointer" style={{ height: 42, padding: '0 20px', borderColor: '#e8e8e8', color: '#888' }}>退出</button>
            ) : (
              <Link to="/login" className="text-[13px] font-medium border rounded-[22px] bg-white no-underline inline-flex items-center" style={{ height: 42, padding: '0 20px', borderColor: '#e8e8e8', color: '#888' }}>登录</Link>
            )}
            <button className="text-[13px] font-semibold text-white border-0 rounded-[22px] cursor-pointer" style={{ height: 42, padding: '0 22px', background: 'linear-gradient(135deg, #f06a9a, #FF9ABB)', boxShadow: '0 4px 14px rgba(240,106,154,0.2)' }}>开始训练</button>
          </div>
        </div>
      </nav>

      {/* ═══ CONTENT ═══ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10" style={{ maxWidth: 1440, margin: '0 auto', padding: '44px 40px 80px' }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="text-[40px] font-semibold m-0 leading-[1.2] tracking-[-0.6px]" style={{ color: '#29262c' }}>
            你的专属<span style={{ color: C.pink }}>训练计划</span>
          </h1>
          <p className="text-[15px] m-0 mt-2" style={{ color: '#7f7982' }}>科学的训练安排，帮你更高效达成目标 💪</p>
        </div>

        {/* 7 Info Cards */}
        <div className="grid gap-[14px] mb-8" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          <InfoCard icon={goalIcon} iconBg="#fff0f5" label="训练目标" value={goalLabelMap[goal] || goal} />
          <InfoCard icon={gym ? '🏋️' : '🏠'} iconBg="#f0f0ff" label="训练场景" value={gym ? '健身房' : '居家训练'} />
          <InfoCard icon="⏱" iconBg="#f0f8ff" label="每日时长" value={`${plan?.profile?.dailyMinutes || 0} 分钟`} />
          <InfoCard icon="📅" iconBg="#fff8f0" label="计划周期" value={`${plan?.totalDays || 0} 天`} />
          <InfoCard icon="📈" iconBg="#f5f0ff" label="当前进度" value={`第 ${wk} 周`} />
          <InfoCard icon="⭐" iconBg="#fffdf0" label="今日训练" value={today.isPeriodDay ? '经期轻量' : today.type} />
          <InfoCard icon={today.isPeriodDay ? '🩸' : '💗'} iconBg={today.isPeriodDay ? '#fff0f5' : '#f5fff5'} label="身体状态" value={today.isPeriodDay ? '经期中' : '正常状态'} />
        </div>

        {/* ═══ MAIN 76/24 ═══ */}
        <div className="flex gap-[28px]">
          {/* LEFT 70% */}
          <div className="flex flex-col gap-5" style={{ flex: '0 0 70%', minWidth: 0 }}>

            {/* Day Nav */}
            <div style={{ marginTop: 30 }} />
            <style>{`.ds2::-webkit-scrollbar{height:4px}.ds2::-webkit-scrollbar-thumb{background:#e8e8e8;border-radius:2px}`}</style>
            <div className="flex items-end gap-3">
              <div ref={dayRef} className="ds2 flex gap-[14px] overflow-x-auto pb-2 flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e8e8e8 transparent' }}>
                {scheduleWithStatus.map((day, di) => <DayCard key={di} day={day} isSelected={sel === di} onClick={() => setSel(di)} />)}
              </div>
              <button onClick={() => dayRef.current?.scrollBy({ left: 350, behavior: 'smooth' })}
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center border-0 cursor-pointer flex-shrink-0 mb-2"
                style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            {/* Section title */}
            <div className="flex items-center justify-between mt-8 mb-0.5">
              <h2 className="text-[20px] font-semibold m-0" style={{ color: '#302d32' }}>每日训练内容<span className="text-[13px] font-normal ml-2" style={{ color: C.sub }}>· {today.isPeriodDay ? '经期日' : today.type}</span></h2>
              <span className="text-[13px] font-medium" style={{ color: '#8d878f' }}>约 {today.estimatedMinutes} 分钟</span>
            </div>

            {/* Training list container */}
            <div className="rounded-[24px] overflow-hidden" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: C.shadow }}>
              {today.exercises.some(e => e.type === '热身') && (
                <div className="flex items-center justify-between" style={{ height: 68, padding: '0 22px', background: 'linear-gradient(90deg, #fff7fa, #fffdfd)', borderBottom: '1px solid rgba(0,0,0,0.035)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[18px]">🔥</span>
                    <div><p className="text-[14px] font-semibold m-0" style={{ color: '#353138' }}>开始训练</p><p className="text-[11px] m-0 mt-0.5" style={{ color: C.sub }}>约 3–5 分钟 · 激活身体，预防运动损伤</p></div>
                  </div>
                  <motion.button whileHover={{ background: '#fde8ef' }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-[12px] font-semibold rounded-[18px] border-0 cursor-default transition-colors"
                    style={{ height: 36, padding: '0 18px', color: '#ee6695', background: '#fff7fa', border: '1px solid #f7bfd1' }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#ee6695"><polygon points="8,5 19,12 8,19" /></svg>开始
                  </motion.button>
                </div>
              )}
              {today.exercises.map((ex, i) => (
                <ExerciseRow key={i} ex={ex} idx={i + 1}
                  checked={!!doneMap[`${sel}-${i + 1}`]}
                  onToggle={() => toggle(i + 1)} onStart={start} />
              ))}
            </div>
          </div>

          {/* RIGHT 28% */}
          <div style={{ flex: '0 0 28%', marginTop: 40 }}>
            <aside className="lg:sticky lg:top-24 flex flex-col gap-[14px] w-full">
              <div className="rounded-[24px]" style={{ padding: '26px 26px 26px', background: 'rgba(255,255,255,0.86)', border: `1px solid ${C.cardBorder}`, boxShadow: '0 14px 34px rgba(50,25,35,0.055)', backdropFilter: 'blur(14px)' }}>
                <h3 className="text-[18px] font-semibold m-0 mb-[18px]" style={{ color: '#38343a' }}>今日训练概览</h3>

                <DashCard icon="🔥" iconBg="linear-gradient(135deg, #fff0f5, #ffe8ee)" title="预计消耗" value={cal} unit="kcal" />
                <div style={{ height: 14 }} />
                <DashCard icon="⏱" iconBg="linear-gradient(135deg, #f0f4ff, #e8eeff)" title="训练时长" value={`约 ${today.estimatedMinutes}`} unit="分钟" />
                <div style={{ height: 14 }} />
                <DashCard icon="🎯" iconBg="linear-gradient(135deg, #f0fff5, #e0fae8)" title="完成进度">
                  <div className="flex items-end gap-3 w-full">
                    <p className="text-[26px] font-semibold m-0 leading-none" style={{ color: '#302d33' }}>{todayPct}%</p>
                    <div className="flex-1 mb-1.5">
                      <div className="h-[6px] rounded-[3px] bg-[#eee] overflow-hidden">
                        <motion.div className="h-full rounded-[3px]" animate={{ width: `${todayPct}%` }} transition={{ duration: 0.7 }} style={{ background: C.pink }} />
                      </div>
                      <p className="text-[10.5px] m-0 mt-1" style={{ color: C.sub }}>{todayDone}/{todayTotal} 动作</p>
                    </div>
                  </div>
                </DashCard>
                <div style={{ height: 14 }} />
                <DashCard icon="📅" iconBg="linear-gradient(135deg, #fff8f0, #fff0e0)" title="今日课程">
                  <div>
                    <p className="text-[15px] font-semibold m-0 leading-tight" style={{ color: '#302d33' }}>Day {today.day} · {today.isPeriodDay ? '经期日' : today.type}</p>
                    <p className="text-[11.5px] m-0 mt-0.5" style={{ color: C.sub }}>{today.isPeriodDay ? '低强度拉伸恢复' : goal === '减脂' ? '燃脂有氧训练' : goal === '增肌' ? '力量增肌训练' : '全身塑形训练'}</p>
                  </div>
                </DashCard>
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
