import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { sceneOptions } from '../data/rules';
import { getCurrentUser } from '../utils/auth';

/* ====== Design Tokens ====== */
const T = {
  // Color
  cTitle: '#222', cLabel: '#333', cAux: '#666', cUnit: '#999', cPh: '#B8B8B8',
  cBorder: '#ECECEC', cFocus: '#ff6ba8', cFocusRing: 'rgba(255,100,160,0.12)',
  cPink: '#FF5C93', cPinkGrad: 'linear-gradient(135deg, #FF5C93, #FF8AB6)',
  // Spacing (8px grid)
  s4: 4, s8: 8, s16: 16, s24: 24, s40: 40, s48: 48, s64: 64,
  // Input
  iH: 52, iR: 14, iF: 19, iP: 16,
  // Card
  cardR: 24, cardP: 40,
  // Button
  btnH: 56, btnR: 16, btnF: 20,
  // Label
  lblF: 18, lblW: 600,
};
const gap = { display: 'flex', flexDirection: 'column', gap: T.s24 };

// Shared input style
const IS = {
  width: '100%', height: T.iH, borderRadius: T.iR, border: `1px solid ${T.cBorder}`,
  background: '#FFF', padding: `0 ${T.iP}px`, fontSize: T.iF, color: T.cLabel,
  outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
};
const onF = (e) => { e.target.style.borderColor = T.cFocus; e.target.style.boxShadow = `0 0 0 4px ${T.cFocusRing}`; };
const onB = (e) => { e.target.style.borderColor = T.cBorder; e.target.style.boxShadow = 'none'; };
const phS = { ...IS, color: T.cPh, fontSize: '18px', fontWeight: 400 };

/* ====== 数据 ====== */
const timeOpts = [
  { value: '15', label: '15 分钟' }, { value: '30', label: '30 分钟' },
  { value: '45', label: '45 分钟' }, { value: '60', label: '60 分钟' },
  { value: '90', label: '90 分钟' }, { value: 'custom', label: '自定义' },
];
const goalOpts = [
  { value: '减脂', label: '🔥  减脂' }, { value: '增肌', label: '💪  增肌' },
  { value: '塑形', label: '✨  塑形' }, { value: '保持健康', label: '🌱  保持健康' },
];
const bpOpts = [
  { value: '上肢', label: '上肢' }, { value: '下肢', label: '下肢' },
  { value: '核心', label: '核心' }, { value: '全身', label: '全身' },
];
const menOpts = [
  { value: 'period', label: '经期中' }, { value: 'upcoming', label: '即将来临' }, { value: 'none', label: '非经期' },
];

/* ====== Select（单选，完全匹配 Input 样式） ====== */
function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const sel = options.find((o) => o.value === value);
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          ...IS, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
          borderColor: open ? T.cFocus : T.cBorder,
          boxShadow: open ? `0 0 0 4px ${T.cFocusRing}` : 'none',
          color: sel ? T.cLabel : T.cPh, fontSize: sel ? T.iF : '18px', fontWeight: sel ? 400 : 400,
        }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sel ? sel.label : placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: T.s8, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 50, width: '100%', marginTop: 6, background: '#FFF',
          borderRadius: T.iR, border: `1px solid ${T.cBorder}`, boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
          overflow: 'hidden', maxHeight: 240, overflowY: 'auto',
        }}>
          {options.map((o) => (
            <button key={o.value} type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: `0 ${T.iP}px`, height: 46, fontSize: '18px',
                color: value === o.value ? T.cPink : '#444', background: value === o.value ? '#fff5f8' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s',
              }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====== MultiSelect（多选，完全匹配 Input 样式） ====== */
function MultiSelect({ values, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const labels = options.filter((o) => values.includes(o.value)).map((o) => o.label);
  const display = labels.length > 0 ? labels.join('、') : placeholder;
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          ...IS, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
          borderColor: open ? T.cFocus : T.cBorder,
          boxShadow: open ? `0 0 0 4px ${T.cFocusRing}` : 'none',
          color: values.length > 0 ? T.cLabel : T.cPh, fontSize: values.length > 0 ? T.iF : '18px', fontWeight: 400,
        }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {display}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: T.s8, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 50, width: '100%', marginTop: 6, background: '#FFF',
          borderRadius: T.iR, border: `1px solid ${T.cBorder}`, boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
          overflow: 'hidden', maxHeight: 240, overflowY: 'auto',
        }}>
          {options.map((o) => {
            const chk = values.includes(o.value);
            return (
              <button key={o.value} type="button"
                onClick={() => onChange(chk ? values.filter((v) => v !== o.value) : [...values, o.value])}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  padding: `0 ${T.iP}px`, height: 46, fontSize: '18px', color: '#444',
                  background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, border: `2px solid ${chk ? T.cPink : '#ddd'}`,
                  background: chk ? T.cPink : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s',
                }}>
                  {chk && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ====== InputGroup（输入框+单位） ====== */
function InputGroup({ value, onChange, unit, placeholder, type = 'text', min, dateProps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
      <input
        type={type} value={value} onChange={onChange} min={min} placeholder={placeholder}
        {...(dateProps || {})}
        style={{
          ...IS, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none',
          flex: 1, minWidth: 0,
        }}
        onFocus={onF} onBlur={(e) => { onB(e);
          const sib = e.target.nextSibling; if (sib) { sib.style.borderColor = T.cBorder; sib.style.boxShadow = 'none'; }
        }}
      />
      <span style={{
        display: 'flex', alignItems: 'center', padding: `0 ${T.iP}px`, fontSize: '18px', color: T.cUnit,
        border: `1px solid ${T.cBorder}`, borderLeft: 'none', borderRadius: `0 ${T.iR}px ${T.iR}px 0`,
        background: '#FAFAFA', flexShrink: 0, whiteSpace: 'nowrap',
      }}>{unit}</span>
    </div>
  );
}

/* ====== Section 分组标题 ====== */
function GroupTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: T.s24, marginTop: T.s40, marginTopFirst: 0 }}>
      <span style={{ fontSize: '22px' }}>{icon}</span>
      <span style={{ fontSize: '22px', fontWeight: 600, color: T.cTitle }}>{title}</span>
    </div>
  );
}
// Override first group's margin-top
function GroupTitleFirst({ icon, title }) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: T.s24 }}>
      <span style={{ fontSize: '22px' }}>{icon}</span>
      <span style={{ fontSize: '22px', fontWeight: 600, color: T.cTitle }}>{title}</span>
    </div>
  );
}

/* ====== 主组件 ====== */
export default function Onboarding() {
  const nav = useNavigate();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [dailyMinutes, setDailyMinutes] = useState('');
  const [customMinutes, setCustomMinutes] = useState('');
  const [goal, setGoal] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [planDays, setPlanDays] = useState('');
  const [menstrual, setMenstrual] = useState('');
  const [periodDate, setPeriodDate] = useState('');
  const [scene, setScene] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const effMin = dailyMinutes === 'custom' ? customMinutes : dailyMinutes;
  const valid = goal && effMin >= 10 && planDays >= 7;

  const submit = (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    const u = getCurrentUser();
    const profileKey = u ? `fither_profile__${u.email}` : 'fither_profile';
    localStorage.setItem(profileKey, JSON.stringify({
      height: height || '', weight: weight || '', targetWeight: targetWeight || '', bodyFat,
      dailyMinutes: parseInt(effMin), goal, scene: scene || 'home',
      bodyParts: bodyParts.length === 0 ? [] : bodyParts,
      durationDays: parseInt(planDays),
      restrictions: [],
      hasMenstrual: menstrual === 'period' || menstrual === 'upcoming',
      menstrualStatus: menstrual, periodDate: periodDate || '', menstrualDays: 28,
    }));
    setTimeout(() => nav('/plan'), 400);
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(./其他页面底图.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>

      {/* ====== Nav ====== */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: T.cPinkGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(245,104,152,0.28)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>FitHer</span>
              <span style={{ fontSize: 12, color: '#F56898' }}>为更好的自己</span>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            <Link to="/" style={{ fontSize: 16, fontWeight: 500, color: T.cAux, textDecoration: 'none' }}>首页</Link>
            <span style={{ fontSize: 16, fontWeight: 600, color: T.cPink, position: 'relative', cursor: 'default' }}>
              训练计划<span style={{ position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)', width: 36, height: 3, borderRadius: 999, background: T.cPink, display: 'block' }} /></span>
            <Link to="/equipment" style={{ fontSize: 16, fontWeight: 500, color: T.cAux, textDecoration: 'none' }}>器材教学</Link>
            <Link to="/diet" style={{ fontSize: 16, fontWeight: 500, color: T.cAux, textDecoration: 'none' }}>饮食建议</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            <Link to="/" style={{ height: 42, padding: '0 20px', fontSize: 15, fontWeight: 600, color: '#FFF', borderRadius: 999, border: 'none', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', background: T.cPinkGrad, boxShadow: '0 6px 20px rgba(245,104,152,0.22)' }}>返回首页</Link>
          </div>
        </div>
      </motion.nav>

      {/* ====== 标题（卡片外） ====== */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: `48px 20px 0` }}>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#000', lineHeight: 1.2, margin: 0 }}>创建你的专属训练计划</h1>
          <p style={{ fontSize: 20, color: T.cUnit, lineHeight: 1.7, margin: `${T.s8}px 0 0` }}>请填写以下信息，FitHer 将根据你的情况生成个性化训练计划</p>
        </div>
      </div>

      {/* ====== 表单卡片 ====== */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: `36px 20px ${T.s64}px` }}>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <div style={{
            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: T.cardR, padding: T.cardP, boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
          }}>
            <form onSubmit={submit}>
              {/* ====== 📋 基础信息 ====== */}
              <GroupTitleFirst icon="📋" title="基础信息" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: T.s24, marginBottom: T.s40 }}>
                {/* 身高 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>身高 (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min={0}
                    placeholder="165" style={IS} onFocus={onF} onBlur={onB} />
                </div>
                {/* 体重 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>体重 (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min={0}
                    placeholder="55" style={IS} onFocus={onF} onBlur={onB} />
                </div>
                {/* 目标体重（仅减脂显示） */}
                {goal === '减脂' && (
                  <div>
                    <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>目标体重 (kg)</label>
                    <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} min={0}
                      placeholder={`当前 ${weight || '?'} kg，你想减到多少？`}
                      style={IS} onFocus={onF} onBlur={onB} />
                  </div>
                )}
                {/* 体脂率 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>体脂率</label>
                  <input type="text" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="例如：25%，或填「不知道」"
                    style={IS} onFocus={onF} onBlur={onB} />
                </div>
                {goal !== '减脂' && <div />}
              </div>

              {/* ====== 🎯 训练偏好 ====== */}
              <GroupTitle icon="🎯" title="训练偏好" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: T.s24, marginBottom: T.s40 }}>
                {/* 训练场景 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>训练场景</label>
                  <Select value={scene} onChange={setScene} options={sceneOptions} placeholder="请选择训练场景" />
                </div>
                {/* 训练目标 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>训练目标</label>
                  <Select value={goal} onChange={setGoal} options={goalOpts} placeholder="请选择训练目标" />
                </div>
                {/* 训练时间 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>每日空闲训练时间</label>
                  <Select value={dailyMinutes} onChange={setDailyMinutes} options={timeOpts} placeholder="请选择训练时间" />
                  {dailyMinutes === 'custom' && (
                    <div style={{ marginTop: T.s8 }}>
                      <InputGroup value={customMinutes} onChange={(e) => setCustomMinutes(e.target.value)} unit="分钟" placeholder="输入分钟数" type="number" min={10} />
                    </div>
                  )}
                </div>
                {/* 计划周期 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>计划周期 (天)</label>
                  <input type="number" value={planDays} onChange={(e) => setPlanDays(e.target.value)} min={7}
                    placeholder="最少 7 天，建议 21–60" style={IS} onFocus={onF} onBlur={onB} />
                </div>
                {/* 训练部位 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>训练部位</label>
                  <MultiSelect values={bodyParts} onChange={setBodyParts} options={bpOpts} placeholder="可多选，默认全身" />
                </div>
              </div>

              {/* ====== 🌸 个性化信息 ====== */}
              <GroupTitle icon="🌸" title="个性化信息" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: T.s24 }}>
                {/* 经期日期 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>最近经期日期</label>
                  <input type="date" value={periodDate} onChange={(e) => setPeriodDate(e.target.value)}
                    style={IS} onFocus={onF} onBlur={onB} />
                </div>
                {/* 经期状态 */}
                <div>
                  <label style={{ display: 'block', fontSize: T.lblF, fontWeight: T.lblW, color: T.cLabel, marginBottom: T.s8 }}>经期状态</label>
                  <Select value={menstrual} onChange={setMenstrual} options={menOpts} placeholder="当前状态（选填）" />
                </div>
                <div />
              </div>

              {/* ====== 提交按钮 ====== */}
              <div style={{ marginTop: T.s40 }}>
                <motion.button type="submit" disabled={!valid || submitting}
                  whileHover={valid && !submitting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={valid && !submitting ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: '100%', height: T.btnH, borderRadius: T.btnR, border: 'none',
                    fontSize: T.btnF, fontWeight: 600, color: '#FFF', cursor: valid && !submitting ? 'pointer' : 'default',
                    background: T.cPinkGrad, opacity: valid && !submitting ? 1 : 0.6,
                    boxShadow: valid && !submitting ? '0 8px 24px rgba(255,92,147,0.16)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                  {submitting ? '正在生成训练计划...' : '生成我的专属训练计划'}
                </motion.button>
                <p style={{ textAlign: 'center', marginTop: T.s16, fontSize: 16, color: T.cUnit }}>
                  {valid ? '点击生成后可在计划页面查看每日训练安排' : '请先完成必填项后再生成'}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
