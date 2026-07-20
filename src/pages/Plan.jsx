import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { generatePlan } from '../data/rules';
import { storage } from '../utils/storage';
import { getCurrentUser, isLoggedIn, logout as doLogout } from '../utils/auth';

/* ============================================
   Tokens
   ============================================ */
const C = {
  pink: '#f06a9a', pinkBg: '#fff4f8', pinkLight: '#fde8ef', pinkBorder: 'rgba(240,106,154,0.10)',
  title: '#29262c', body: '#686269', sub: '#99939b', muted: '#99939b',
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
  // 只有器械力量才显示次数/休息（跟练视频 reps 是时长文本）
  if (ex.reps && ex.reps !== '—' && ex.type !== '有氧' && ex.type !== '热身' && ex.type !== '拉伸' && !ex.reps.includes('分钟')) m.push({ val: ex.reps, label: '次数' });
  if (ex.rest && ex.rest !== '—') m.push({ val: ex.rest, label: '休息' });
  return m;
}
function getDur(ex) {
  // 器械力量统一显示：3组=8分钟，4组=10分钟（跟练视频 sets=1 不算）
  if (ex.type === '力量' && ex.sets > 1) {
    if (ex.sets <= 3) return '8 分钟';
    return '10 分钟';
  }
  const t = ex.sec * (ex.sets || 1);
  return t >= 60 ? `${Math.round(t / 60)} 分钟` : `${t} 秒`;
}
function getNote(ex) {
  if (ex.note) return ex.note;
  const map = { '热身': '热身激活 · 提高心率', '拉伸': '放松肌肉 · 缓解肌肉酸痛', '有氧': '有氧燃脂 · 提升心肺', '力量': '力量训练 · 增强肌力', '核心': '核心训练 · 稳定躯干' };
  return map[ex.type] || '';
}

const goalIcons = { '减脂': '🔥', '增肌': '💪', '塑形': '✨' };
const goalLabelMap = { '减脂': '减脂', '增肌': '增肌', '塑形': '塑形' };

/* ============================================
   打卡系统
   ============================================ */
function getCheckins() { return storage.get(uk('checkins')) || {}; }
function getCheckinCount() { return Object.keys(getCheckins()).length; }
function saveCheckin(dateStr) {
  const c = getCheckins();
  if (!c[dateStr]) { c[dateStr] = true; storage.set(uk('checkins'), c); }
}

/** 按当前登录用户隔离存储 key — 不同账号数据互不可见 */
function uk(key) {
  const u = getCurrentUser();
  return u ? `${key}__${u.email}` : key;
}

/* ============================================
   Sub-Components
   ============================================ */

function DayCard({ day, isSelected, onClick }) {
  const done = day._done;
  const typeIcons = { '力量日': '💪', '燃脂日': '🔥', '燃脂+力量': '🔥💪', '塑形日': '✨', '训练日': '🎯', '有氧日': '🏃', '综合日': '⭐', '经期拉伸': '🩸', '经期恢复': '🌸', '经期慢走': '🚶', '经期快走': '🚶‍♀️', '经期散步': '🚶' };
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
      <span className="text-[13px] font-semibold" style={{ color: isSelected ? C.pink : '#99939b' }}>Day {String(day.day).padStart(2, '0')}</span>
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
      {/* Name + note */}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold m-0 leading-tight truncate" style={{ color: '#353138', textDecoration: checked ? 'line-through' : 'none' }}>{ex.name}</p>
        <NoteText text={getNote(ex)} />
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

/** 将速度/坡度/阻力等参数自动加黑加粗 */
function NoteText({ text }) {
  if (!text) return <p className="text-[12px] m-0 mt-0.5" style={{ color: '#99939b' }}>—</p>;
  return (
    <p className="text-[12px] m-0 mt-0.5" style={{ color: '#99939b' }}>{text}</p>
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
   UserCard Popup
   ============================================ */
function UserCard({ user, goal, checkinDays, onClose, onReplan, onLogout }) {
  const cardRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (cardRef.current && !cardRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  const initial = (user?.email || '?')[0].toUpperCase();
  return (
    <motion.div ref={cardRef} initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
      className="absolute right-0 top-[50px] z-50 rounded-[20px] overflow-hidden"
      style={{ width: 280, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 16px 48px rgba(50,25,35,0.12)' }}>
      {/* Header */}
      <div style={{ padding: '22px 22px 18px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white text-[20px] font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f06a9a, #FF9ABB)', boxShadow: '0 4px 16px rgba(240,106,154,0.25)' }}>{initial}</div>
        <p className="text-[16px] font-semibold m-0 tracking-[-0.2px]" style={{ color: '#2d2a30' }}>{user?.email || '未登录'}</p>
      </div>
      {/* Stats */}
      <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="text-center">
          <p className="text-[22px] font-bold m-0 leading-none" style={{ color: '#302d33' }}>{goalIcons[goal] || '🎯'} {goalLabelMap[goal] || goal}</p>
          <p className="text-[11px] m-0 mt-1" style={{ color: C.sub }}>健身目标</p>
        </div>
        <div style={{ width: 1, background: 'rgba(0,0,0,0.05)' }} />
        <div className="text-center">
          <p className="text-[22px] font-bold m-0 leading-none" style={{ color: '#302d33' }}>{checkinDays}<span className="text-[13px] font-normal ml-0.5" style={{ color: C.sub }}>天</span></p>
          <p className="text-[11px] m-0 mt-1" style={{ color: C.sub }}>累计打卡</p>
        </div>
      </div>
      {/* Actions */}
      <div style={{ padding: '8px 12px' }}>
        <button onClick={onReplan}
          className="w-full text-left text-[13px] font-medium border-0 bg-transparent cursor-pointer rounded-[10px] transition-colors flex items-center gap-2"
          style={{ height: 40, padding: '0 12px', color: '#565158' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fdf2f6'; e.currentTarget.style.color = '#ee6a98'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#565158'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
          重新制定计划
        </button>
        <button onClick={onLogout}
          className="w-full text-left text-[13px] font-medium border-0 bg-transparent cursor-pointer rounded-[10px] transition-colors flex items-center gap-2"
          style={{ height: 40, padding: '0 12px', color: '#999' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#666'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#999'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          退出登录
        </button>
      </div>
    </motion.div>
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
  const [showUserCard, setShowUserCard] = useState(false);
  const dayRef = useRef(null);
  const user = getCurrentUser();
  const loggedIn = !!user;

  useEffect(() => {
    const p = storage.get(uk('profile'));
    if (!p) { nav('/onboarding'); return; }
    const generated = generatePlan(p);
    setPlan(generated);
    const saved = storage.get(uk('planDoneMap')); if (saved) setDoneMap(saved);
  }, [nav]);

  useEffect(() => {
    if (Object.keys(doneMap).length > 0) storage.set(uk('planDoneMap'), doneMap);
  }, [doneMap]);

  const goReplan = () => { storage.remove(uk('profile')); storage.remove(uk('planDoneMap')); setShowUserCard(false); nav('/onboarding'); };
  const handleLogout = () => { doLogout(); setShowUserCard(false); nav('/'); };

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

  // 自动打卡：今日全部完成
  useEffect(() => {
    if (todayPct === 100 && today && todayTotal > 0) {
      const todayStr = new Date().toISOString().slice(0, 10);
      saveCheckin(todayStr);
    }
  }, [todayPct, today, todayTotal]);

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
  const goal = plan?.profile?.goal || '减脂';
  const gym = plan?.scene === 'gym';
  const wk = Math.floor(sel / 7) + 1;
  const goalIcon = goalIcons[goal] || '🎯';
  const scheduleWithStatus = plan.schedule.map((d, i) => ({ ...d, ...(dayStatuses[i] || {}) }));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffdfd 0%, #fff7fa 55%, #fff1f6 100%)' }}>
      {/* Glow */}
      <div className="absolute pointer-events-none z-0" style={{ top: '-5%', right: '-3%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,104,152,0.10) 0%, transparent 70%)' }} />

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-30" style={{ height: 72, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between h-full" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0">
            <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F56898, #FF9ABB)', boxShadow: '0 4px 16px rgba(245,104,152,0.28)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <div className="flex flex-col leading-none gap-0.5"><span className="text-[28px] font-bold" style={{ color: '#111' }}>FitHer</span><span className="text-[12px]" style={{ color: '#F56898' }}>为更好的自己</span></div>
          </Link>
          <div className="flex items-center" style={{ gap: 44 }}>
            <Link to="/" className="text-[16px] font-medium no-underline" style={{ color: '#666' }}>首页</Link>
            <span className="text-[18px] font-semibold relative cursor-default" style={{ color: '#F56898' }}>
              训练计划<span className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 w-[36px] h-[3px] rounded-[999px] block" style={{ background: '#F56898' }} />
            </span>
            <Link to="/equipment" className="text-[18px] font-medium no-underline" style={{ color: '#666' }}>动作指导</Link>
            <Link to="/diet" className="text-[18px] font-medium no-underline" style={{ color: '#666' }}>饮食建议</Link>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0" style={{ width: 160, justifyContent: 'flex-end' }}>
            {loggedIn ? (
              <div className="relative">
                <button onClick={() => setShowUserCard(!showUserCard)}
                  className="h-[42px] rounded-full flex items-center justify-center text-white text-[16px] font-semibold border-0 cursor-pointer transition-all"
                  style={{ padding: '0 20px', background: 'linear-gradient(135deg, #F56898, #FF9ABB)', boxShadow: '0 8px 25px rgba(240,106,154,0.25)' }}>
                  个人主页
                </button>
                {showUserCard && (
                  <UserCard user={user} goal={goal} checkinDays={getCheckinCount()}
                    onClose={() => setShowUserCard(false)} onReplan={goReplan} onLogout={handleLogout} />
                )}
              </div>
            ) : (
              <Link to="/login" className="text-[13px] font-medium border rounded-[22px] bg-white no-underline inline-flex items-center" style={{ height: 42, padding: '0 20px', borderColor: '#e8e8e8', color: '#888' }}>登录</Link>
            )}
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
                <div className="flex items-center justify-center" style={{ height: 52, padding: '0 22px', background: 'linear-gradient(90deg, #fff7fa, #fffdfd)', borderBottom: '1px solid rgba(0,0,0,0.035)' }}>
                  <span className="text-[18px] mr-3">🔥</span>
                  <p className="text-[18px] font-semibold m-0" style={{ color: '#353138' }}>开始训练</p>
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
                      <p className="text-[10.5px] m-0 mt-1" style={{ color: '#99939b' }}>{todayDone}/{todayTotal} 动作</p>
                    </div>
                  </div>
                </DashCard>
                <div style={{ height: 14 }} />
                <DashCard icon="📅" iconBg="linear-gradient(135deg, #fff8f0, #fff0e0)" title="今日课程">
                  <div>
                    <p className="text-[15px] font-semibold m-0 leading-tight" style={{ color: '#302d33' }}>Day {today.day} · {today.isPeriodDay ? '经期日' : today.type}</p>
                    <p className="text-[11.5px] m-0 mt-0.5" style={{ color: '#99939b' }}>{today.isPeriodDay ? '低强度拉伸恢复' : goal === '减脂' ? '燃脂有氧训练' : goal === '增肌' ? '力量增肌训练' : '全身塑形训练'}</p>
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
